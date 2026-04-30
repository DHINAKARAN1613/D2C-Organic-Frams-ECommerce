
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const wishlist = await prisma.wishlistItem.findMany({
            where: { userId: session.user.id },
            include: { product: true },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(wishlist);
    } catch (error) {
        console.error('[WISHLIST_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { productId } = await req.json();
        if (!productId) {
            return new NextResponse('Product ID required', { status: 400 });
        }

        // Check if already in wishlist
        const existing = await prisma.wishlistItem.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId
                }
            }
        });

        if (existing) {
            // Remove
            await prisma.wishlistItem.delete({
                where: { id: existing.id }
            });
            return NextResponse.json({ added: false });
        } else {
            // Add
            await prisma.wishlistItem.create({
                data: {
                    userId: session.user.id,
                    productId
                }
            });
            return NextResponse.json({ added: true });
        }

    } catch (error) {
        console.error('[WISHLIST_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
