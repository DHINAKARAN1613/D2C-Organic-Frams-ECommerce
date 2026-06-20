import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ProductClient } from './ProductClient';
import { getImageUrl } from '@/lib/imageUtils';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const isLoggedIn = !!session?.user;

    // Fetch product and reviews from Prisma
    const dbProduct = await prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            farmer: true,
            reviews: {
                include: {
                    user: {
                        select: { name: true, image: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!dbProduct || !dbProduct.farmerId) {
        notFound();
    }

    // Fetch related products (other products with farmers)
    const relatedDb = await prisma.product.findMany({
        where: { 
            farmerId: { not: null },
            id: { not: id } 
        },
        take: 4,
        orderBy: { createdAt: 'desc' }
    });

    const relatedProducts = relatedDb.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        image: getImageUrl(p.images) || '/placeholder.png'
    }));

    // Calculate real-time farmer success rate based on actual Orders
    let actualSuccessRate = dbProduct.farmer?.isVerifiedFarmer ? 99 : (dbProduct.farmer?.kycStatus === 'VERIFIED' ? 95 : 85); // Default fallbacks
    
    if (dbProduct.farmerId) {
        const farmerOrders = await prisma.order.findMany({
            where: {
                items: {
                    some: { product: { farmerId: dbProduct.farmerId } }
                },
                status: { in: ['DELIVERED', 'CANCELLED', 'RETURNED'] } // Only count completed/failed orders
            },
            select: { status: true }
        });

        const totalResolved = farmerOrders.length;
        if (totalResolved > 0) {
            const successfulDeliveries = farmerOrders.filter(o => o.status === 'DELIVERED').length;
            actualSuccessRate = Math.round((successfulDeliveries / totalResolved) * 100);
        }
    }

    const productProps = {
        id: dbProduct.id,
        name: dbProduct.name,
        description: dbProduct.description,
        price: dbProduct.price,
        originalPrice: dbProduct.originalPrice,
        image: getImageUrl(dbProduct.images) || '/placeholder.png',
        images: dbProduct.images,
        stock: dbProduct.stock,
        category: dbProduct.category.name,
        unit: dbProduct.unit,
        outOfStock: dbProduct.stock <= 0,
        rating: 5.0, // Calculated in client
        farmer: dbProduct.farmer ? {
            id: dbProduct.farmer.id,
            name: dbProduct.farmer.name || 'Anonymous Farmer',
            image: getImageUrl(dbProduct.farmer.image) || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Farmer',
            location: dbProduct.farmer.farmAddress || 'Local Farm',
            isVerified: dbProduct.farmer.isVerifiedFarmer,
            successRate: actualSuccessRate
        } : null,
        badge: null,
        badgeColor: null,
        details: `1 ${dbProduct.unit}`,
        attributes: [
            { icon: 'public', label: 'Origin', value: 'Local Sustainable Farm' },
            { icon: 'eco', label: 'Certification', value: '100% Organic' }
        ]
    };

    return (
        <ProductClient 
            product={productProps} 
            reviews={dbProduct.reviews} 
            relatedProducts={relatedProducts}
            isLoggedIn={isLoggedIn} 
        />
    );
}
