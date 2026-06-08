import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ProductClient } from './ProductClient';
import { getImageUrl } from '@/lib/imageUtils';
import { PRODUCTS } from '@/lib/data'; // For fallback

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

    let productProps = null;
    let reviews: any[] = [];

    if (dbProduct) {
        productProps = {
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
            badge: null,
            badgeColor: null,
            details: `1 ${dbProduct.unit}`,
            attributes: [
                { icon: 'public', label: 'Origin', value: 'Local Sustainable Farm' },
                { icon: 'eco', label: 'Certification', value: '100% Organic' }
            ]
        };
        reviews = dbProduct.reviews;
    } else {
        // Fallback to static data if not found in DB (e.g. for old IDs)
        const staticProduct = PRODUCTS.find(p => p.id === id);
        if (staticProduct) {
            productProps = staticProduct;
            reviews = []; // Static products have no dynamic reviews yet
        }
    }

    return (
        <ProductClient 
            product={productProps} 
            reviews={reviews} 
            isLoggedIn={isLoggedIn} 
        />
    );
}
