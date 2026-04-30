import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// PATCH /api/admin/farmers/[userId]/verify  – toggle isVerifiedFarmer
export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { userId } = params;
    const { verified } = await req.json();

    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { isVerifiedFarmer: Boolean(verified) },
            select: { id: true, name: true, isVerifiedFarmer: true }
        });
        return NextResponse.json(user);
    } catch (e) {
        console.error('[VERIFY_FARMER]', e);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
