
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.email !== 'admin@example.com') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: { name: true, email: true }
            }
        }
    });

    return NextResponse.json(orders);
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.email !== 'admin@example.com') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { id, status } = body;

    const order = await prisma.order.update({
        where: { id },
        data: { status },
    });

    return NextResponse.json(order);
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.email !== 'admin@example.com') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return new NextResponse('Missing ID', { status: 400 });
    }

    try {
        // Delete order items first (no cascade in schema)
        await prisma.orderItem.deleteMany({
            where: { orderId: id },
        });

        // Delete the order
        await prisma.order.delete({
            where: { id },
        });

        return new NextResponse('Deleted', { status: 200 });
    } catch (error) {
        console.error('DELETE_ORDER_ERROR', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
