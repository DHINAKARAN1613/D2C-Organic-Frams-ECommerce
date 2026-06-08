import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch all chat sessions, ordered by most recently updated
        const chatSessions = await prisma.chatSession.findMany({
            orderBy: { updatedAt: 'desc' },
            include: {
                user: { select: { name: true, email: true, image: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1 // Only get the latest message for the inbox preview
                }
            }
        });

        return NextResponse.json(chatSessions);
    } catch (error) {
        console.error('Admin Chat GET Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
