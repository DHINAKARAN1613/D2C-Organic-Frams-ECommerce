import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { aadharNumber, aadharImage, farmAddress } = body;

        if (!aadharNumber || !aadharImage || !farmAddress) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Basic Aadhar Validation (12 digits)
        if (!/^\d{12}$/.test(aadharNumber)) {
            return new NextResponse('Invalid Aadhar Number. Must be 12 digits.', { status: 400 });
        }

        const user = await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                aadharNumber,
                aadharImage,
                farmAddress,
                kycStatus: 'PENDING'
            }
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('[KYC_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
