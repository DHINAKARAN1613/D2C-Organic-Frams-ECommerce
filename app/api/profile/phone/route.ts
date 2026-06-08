import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { phone } = body;

        if (!phone) {
            return new NextResponse('Phone number is required', { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: { phone }
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('[PROFILE_PHONE_PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
