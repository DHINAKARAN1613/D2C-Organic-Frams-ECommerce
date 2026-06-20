import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const searchParams = req.nextUrl.searchParams;
        const farmerId = searchParams.get('farmerId'); // For user initiating chat
        
        // If a USER passes a farmerId, find or create the chat session
        if (farmerId && session.user.role === 'USER') {
            let chatSession = await prisma.chatSession.findFirst({
                where: { userId: session.user.id, farmerId: farmerId }
            });

            if (!chatSession) {
                chatSession = await prisma.chatSession.create({
                    data: {
                        userId: session.user.id,
                        farmerId: farmerId,
                        isBotActive: false // Farmer chats don't use AI bot by default
                    }
                });
            }
            return NextResponse.json({ sessionId: chatSession.id });
        }

        // Otherwise, return all chats for the current user/farmer
        const isFarmer = session.user.role === 'FARMER';
        
        const chatSessions = await prisma.chatSession.findMany({
            where: isFarmer ? { farmerId: session.user.id } : { userId: session.user.id, farmerId: { not: null } },
            include: {
                user: { select: { id: true, name: true, image: true } },
                farmer: { select: { id: true, name: true, image: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json(chatSessions);
    } catch (error) {
        console.error('Messages GET Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
