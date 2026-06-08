import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';



export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        let chatSession = await prisma.chatSession.findFirst({
            where: { userId: session.user.id },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!chatSession) {
            chatSession = await prisma.chatSession.create({
                data: {
                    userId: session.user.id,
                    status: 'OPEN'
                },
                include: { messages: true }
            });
        }

        return NextResponse.json(chatSession);
    } catch (error) {
        console.error('Chat GET Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { content } = body;

        if (!content || typeof content !== 'string') {
            return NextResponse.json({ error: "Invalid content" }, { status: 400 });
        }

        let chatSession = await prisma.chatSession.findFirst({
            where: { userId: session.user.id },
            include: { messages: { orderBy: { createdAt: 'desc' }, take: 10 } }
        });

        if (!chatSession) {
            chatSession = await prisma.chatSession.create({
                data: { userId: session.user.id },
                include: { messages: true }
            });
        }

        // 1. Create and broadcast the user's message
        const userMessage = await prisma.message.create({
            data: {
                chatSessionId: chatSession.id,
                senderId: session.user.id,
                content: content,
                isBot: false
            }
        });



        await prisma.chatSession.update({
            where: { id: chatSession.id },
            data: { updatedAt: new Date() }
        });

        // 2. Open-Source AI Bot Logic (Hugging Face)
        if (chatSession.isBotActive && process.env.HF_TOKEN) {
            try {
                const { HfInference } = await import('@huggingface/inference');
                const hf = new HfInference(process.env.HF_TOKEN);
                
                // Construct chat history for context
                const history = chatSession.messages.reverse().map(msg => ({
                    role: msg.isBot ? 'assistant' : 'user',
                    content: msg.content
                }));

                const systemInstruction = `You are the Yogam Organic Farms customer support bot. 
Be concise, helpful, and friendly. Answer questions about organic farming, shipping, or products.
CRITICAL INSTRUCTION: If the user asks to speak to a human, asks for an admin, mentions a refund, or has a complex issue you cannot solve, you MUST reply with EXACTLY this string: [TRANSFER_TO_ADMIN]
Do not include any other text if you use the transfer string.`;

                // We use Mistral or Llama-3 depending on availability on the free tier
                const response = await hf.chatCompletion({
                    model: "mistralai/Mistral-7B-Instruct-v0.2",
                    messages: [
                        { role: 'system', content: systemInstruction },
                        ...history,
                        { role: 'user', content }
                    ],
                    max_tokens: 500,
                    temperature: 0.1
                });

                let botReply = response.choices[0]?.message?.content || "";
                let transferRequested = false;

                if (botReply.includes('[TRANSFER_TO_ADMIN]')) {
                    botReply = "I am connecting you with a human customer service agent. They will be with you shortly.";
                    transferRequested = true;
                }

                // Save bot message
                await prisma.message.create({
                    data: {
                        chatSessionId: chatSession.id,
                        senderId: null, // Null indicates it's not a real user
                        content: botReply || "Sorry, I am having trouble understanding.",
                        isBot: true
                    }
                });

                // If transferring, disable bot
                if (transferRequested) {
                    await prisma.chatSession.update({
                        where: { id: chatSession.id },
                        data: { isBotActive: false }
                    });
                }
            } catch (aiError) {
                console.error("Open-Source AI Error:", aiError);
                // Fallback message if AI fails
                await prisma.message.create({
                    data: {
                        chatSessionId: chatSession.id,
                        senderId: null,
                        content: "I am having trouble connecting to my AI brain right now. I have notified a human customer service agent who will be with you shortly.",
                        isBot: true
                    }
                });
                
                await prisma.chatSession.update({
                    where: { id: chatSession.id },
                    data: { isBotActive: false }
                });
            }
        }

        return NextResponse.json(userMessage);
    } catch (error) {
        console.error('Chat POST Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

