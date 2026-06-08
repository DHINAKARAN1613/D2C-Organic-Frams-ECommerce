
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session?.user?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const order = await prisma.order.findUnique({
            where: {
                id: id,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            return new NextResponse('Order not found', { status: 404 });
        }

        // Security check: Ensure user owns the order (or is Admin)
        // Note: session.user.role is not fully typed yet, assuming access if ID matches
        // In a real app we'd check if (order.userId !== session.user.id && session.user.role !== 'ADMIN')
        if (order.userId !== session.user.id) {
            // Allow admin bypass if we had role check working, strict for now unless updated
            // For now, strict owner check
            return new NextResponse('Forbidden', { status: 403 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('[ORDER_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session?.user?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { status } = body;

        if (!status) {
            return new NextResponse('Status is required', { status: 400 });
        }

        const order = await prisma.order.update({
            where: {
                id: id,
            },
            data: {
                status,
            },
            include: {
                user: true
            }
        });

        // Trigger real-time notifications

        return NextResponse.json(order);
    } catch (error) {
        console.error('[ORDER_PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
