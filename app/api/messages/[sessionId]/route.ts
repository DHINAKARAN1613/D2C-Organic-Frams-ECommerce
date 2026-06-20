import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { sessionId } = await context.params;

        const chatSession = await prisma.chatSession.findUnique({
            where: { id: sessionId },
            include: {
                user: { select: { id: true, name: true, image: true } },
                farmer: { select: { id: true, name: true, image: true } },
                messages: { orderBy: { createdAt: 'asc' } }
            }
        });

        if (!chatSession) return NextResponse.json({ error: "Not found" }, { status: 404 });

        // Ensure user is either the customer or the farmer
        if (chatSession.userId !== session.user.id && chatSession.farmerId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        return NextResponse.json(chatSession);
    } catch (error) {
        console.error('Messages Session GET Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { sessionId } = await context.params;
        const body = await req.json();
        const { content } = body;

        if (!content || typeof content !== 'string') return NextResponse.json({ error: "Invalid content" }, { status: 400 });

        const chatSession = await prisma.chatSession.findUnique({ where: { id: sessionId } });
        if (!chatSession) return NextResponse.json({ error: "Not found" }, { status: 404 });

        if (chatSession.userId !== session.user.id && chatSession.farmerId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const message = await prisma.message.create({
            data: {
                chatSessionId: sessionId,
                senderId: session.user.id,
                content: content
            }
        });

        await prisma.chatSession.update({
            where: { id: sessionId },
            data: { updatedAt: new Date() }
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error('Messages Session POST Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
