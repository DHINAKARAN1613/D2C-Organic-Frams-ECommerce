import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import FarmerDashboardClient from '@/components/farmer/FarmerDashboardClient';

export default async function FarmerDashboard() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) return null;

    const productsCount = await prisma.product.count({
        where: { farmerId: userId }
    });

    return (
        <FarmerDashboardClient
            userName={session?.user?.name || "Farmer"}
            productsCount={productsCount}
        />
    );
}
