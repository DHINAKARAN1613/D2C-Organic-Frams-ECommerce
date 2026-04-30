
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { items, address, total, paymentId } = body;

        if (!items || items.length === 0) {
            return new NextResponse('No items in cart', { status: 400 });
        }

        const order = await prisma.$transaction(async (tx) => {
            // 1. Verify Stock & Decrement for all items
            for (const item of items) {
                const product = await tx.product.findUnique({ where: { id: item.id } });

                if (!product) {
                    throw new Error(`Product not found: ${item.name || item.id}`);
                }

                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}. Only ${product.stock} left.`);
                }

                await tx.product.update({
                    where: { id: item.id },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            // 2. Create Order
            return await (tx.order as any).create({
                data: {
                    userId: session.user.id,
                    total: total,
                    status: paymentId ? 'PROCESSING' : 'PENDING',
                    paymentId: paymentId || null,
                    shippingName: address.name,
                    shippingStreet: address.street,
                    shippingCity: address.city,
                    shippingState: address.state,
                    shippingZip: address.zip,
                    shippingPhone: address.phone,
                    shippingLocation: address.location,
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.id,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
            });
        });

        return NextResponse.json(order);
    } catch (error: any) {
        console.error('[ORDER_POST]', error);
        return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
}
