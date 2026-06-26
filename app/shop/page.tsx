import { ShopClient } from './ShopClient';
import prisma from '@/lib/prisma';
import { getImageUrl } from '@/lib/imageUtils';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Shop Essentials | Yogam Organic Farms',
    description: 'Pure, organic, and ethically sourced products for your home and health.',
};

export default async function ShopPage() {
    const dbProducts = await prisma.product.findMany({
        where: {
            farmerId: { not: null }
        },
        include: {
            category: true,
            farmer: true
        },
        orderBy: { createdAt: 'desc' }
    });

    const products = dbProducts.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        images: p.images, 
        image: getImageUrl(p.images) || '/placeholder.png',
        stock: p.stock,
        category: p.category.name,
        unit: p.unit,
        farmerName: p.farmer?.name || null,
        outOfStock: p.stock <= 0,
        rating: 5.0, 
        badge: null,
        badgeColor: null
    }));

    const dbCategories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });
    
    const categoryNames = ["All", ...dbCategories.map(c => c.name)];

    return <ShopClient initialProducts={products} categories={categoryNames} />;
}
