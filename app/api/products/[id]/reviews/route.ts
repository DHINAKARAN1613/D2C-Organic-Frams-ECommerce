import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        const { id: productId } = await params;

        if (!session?.user?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { rating, comment } = body;

        if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
            return new NextResponse('Invalid rating', { status: 400 });
        }

        // Optional: Check if the user has actually purchased the product
        const hasPurchased = await prisma.orderItem.findFirst({
            where: {
                productId: productId,
                order: {
                    userId: session.user.id,
                    status: {
                        in: ['DELIVERED', 'SHIPPED', 'CONFIRMED']
                    }
                }
            }
        });

        if (!hasPurchased) {
            return new NextResponse('You must purchase this product before reviewing it.', { status: 403 });
        }

        // Check if user already reviewed
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId: productId
                }
            }
        });

        if (existingReview) {
            return new NextResponse('You have already reviewed this product', { status: 400 });
        }

        const review = await prisma.review.create({
            data: {
                rating,
                comment,
                userId: session.user.id,
                productId: productId
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            }
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error('[REVIEW_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
