import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateAprioriRules, getRecommendationsForProduct } from '@/lib/apriori';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
        return NextResponse.json(
            { error: 'Product ID is required for recommendations' },
            { status: 400 }
        );
    }

    try {
        // 1. Fetch all successful orders (that have items)
        // For a real production app with millions of orders, you'd want to cache this 
        // or run it as a background cron job. For this project, we calculate on the fly.
        const orders = await prisma.order.findMany({
            where: {
                status: {
                    not: 'CANCELLED',
                },
            },
            include: {
                items: true,
            },
        });

        // 2. Format data for the Apriori algorithm
        const transactions = orders
            .filter((order) => order.items.length > 0)
            .map((order) => ({
                id: order.id,
                items: order.items.map((item) => item.productId),
            }));

        if (transactions.length === 0) {
            return NextResponse.json({ recommendations: [] });
        }

        // 3. Run the Apriori Algorithm
        // Lowered minSupport and minConfidence for dev environments with less data
        const rules = generateAprioriRules(transactions, 0.01, 0.01);

        // 4. Get Top Recommended Product IDs for the requested Product
        const recommendedProductIds = getRecommendationsForProduct(productId, rules, 3);

        if (recommendedProductIds.length === 0) {
            return NextResponse.json({ recommendations: [] });
        }

        // 5. Fetch the actual Product details to return to the frontend
        const recommendedProducts = await prisma.product.findMany({
            where: {
                id: {
                    in: recommendedProductIds,
                },
                // Optionally, ensure they are in stock
                // stock: { gt: 0 }
            },
            select: {
                id: true,
                name: true,
                price: true,
                images: true,
                unit: true,
            }
        });

        return NextResponse.json({ recommendations: recommendedProducts });
    } catch (error) {
        console.error('Error generating recommendations:', error);
        return NextResponse.json(
            { error: 'Failed to generate recommendations' },
            { status: 500 }
        );
    }
}
