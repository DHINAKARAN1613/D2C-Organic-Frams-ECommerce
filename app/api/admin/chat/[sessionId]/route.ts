import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await context.params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const chatSession = await prisma.chatSession.findUnique({
            where: { id: sessionId },
            include: {
                user: { select: { name: true, email: true, image: true } },
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!chatSession) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(chatSession);
    } catch (error) {
        console.error('Admin Chat GET Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await context.params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { content } = body;

        if (!content || typeof content !== 'string') {
            return NextResponse.json({ error: "Invalid content" }, { status: 400 });
        }

        // Verify session exists
        const chatSession = await prisma.chatSession.findUnique({
            where: { id: sessionId }
        });

        if (!chatSession) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        // Create message
        const message = await prisma.message.create({
            data: {
                chatSessionId: sessionId,
                senderId: session.user.id,
                content: content
            }
        });

        // Update session updatedAt and disable AI bot
        await prisma.chatSession.update({
            where: { id: sessionId },
            data: { updatedAt: new Date(), isBotActive: false }
        });



        return NextResponse.json(message);
    } catch (error) {
        console.error('Admin Chat POST Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
