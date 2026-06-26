import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import FarmerProductsClient from '@/components/farmer/FarmerProductsClient';

async function getFarmerProducts(farmerId: string) {
    try {
        const products = await prisma.product.findMany({
            where: { farmerId },
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        });
        return products;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}

export default async function FarmerProductsPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        redirect('/auth/signin');
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isVerifiedFarmer: true }
    });

    if (!user) {
        redirect('/auth/signin');
    }

    const isVerified = user.isVerifiedFarmer;
    const products = isVerified ? await getFarmerProducts(userId) : [];

    return <FarmerProductsClient products={products} isVerified={isVerified} />;
}
