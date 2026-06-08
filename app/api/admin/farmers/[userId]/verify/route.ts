import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ userId: string }> }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Await the params to fix the Next.js 15+ "params is a Promise" issue
        const { userId } = await params;
        const { verified, action } = await req.json();

        // `action` can be "APPROVE" or "REJECT" for the new KYC flow
        // Fallback to the old `verified` boolean logic for safety if needed
        const isApproved = action === 'APPROVE' || verified === true;
        const isRejected = action === 'REJECT';

        let kycStatus = 'UNVERIFIED';
        let isVerifiedFarmer = false;

        if (isApproved) {
            kycStatus = 'VERIFIED';
            isVerifiedFarmer = true;
        } else if (isRejected) {
            kycStatus = 'REJECTED';
            isVerifiedFarmer = false;
        }

        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                isVerifiedFarmer,
                kycStatus,
            },
            select: {
                id: true,
                name: true,
                isVerifiedFarmer: true,
                kycStatus: true,
            }
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('[VERIFY_FARMER]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
