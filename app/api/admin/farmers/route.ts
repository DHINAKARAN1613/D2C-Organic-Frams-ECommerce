import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { farmerId, action } = body;

        if (!farmerId || !['APPROVE', 'REJECT'].includes(action)) {
            return new NextResponse('Invalid request', { status: 400 });
        }

        const updateData: any = {
            kycStatus: action === 'APPROVE' ? 'VERIFIED' : 'REJECTED'
        };

        if (action === 'APPROVE') {
            updateData.isVerifiedFarmer = true;
            updateData.role = 'FARMER';
        } else {
            updateData.isVerifiedFarmer = false;
        }

        const user = await prisma.user.update({
            where: { id: farmerId },
            data: updateData
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('[ADMIN_FARMER_PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
