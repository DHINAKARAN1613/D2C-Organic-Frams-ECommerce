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
        const { type, code } = body;

        if (!code || (type !== 'EMAIL' && type !== 'PHONE')) {
            return new NextResponse('Invalid request', { status: 400 });
        }

        // Find the latest active OTP for this user and type
        const otpRecord = await prisma.oTP.findFirst({
            where: {
                userId: session.user.id,
                type: type,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        if (!otpRecord) {
            return new NextResponse('No OTP requested', { status: 400 });
        }

        if (otpRecord.expiresAt < new Date()) {
            return new NextResponse('OTP has expired', { status: 400 });
        }

        if (otpRecord.code !== code) {
            return new NextResponse('Invalid OTP code', { status: 400 });
        }

        // OTP is valid. Delete it and update user.
        await prisma.oTP.deleteMany({
            where: {
                userId: session.user.id,
                type: type,
            }
        });

        const updateData: any = {};
        if (type === 'EMAIL') {
            updateData.emailVerified = new Date();
        } else if (type === 'PHONE') {
            updateData.phoneVerified = new Date();
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
        });

        return NextResponse.json({ success: true, user: updatedUser });

    } catch (error) {
        console.error('[OTP_VERIFY_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
