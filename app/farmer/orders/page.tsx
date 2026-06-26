import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { FarmerOrdersList } from '@/components/farmer/FarmerOrdersList';

import { FarmerOrdersHeader } from '@/components/farmer/FarmerOrdersHeader';

export const metadata = {
    title: 'Orders | Farmer Panel | Yogam Organic Farms',
};

export default async function FarmerOrdersPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'FARMER') {
        redirect('/auth/signin');
    }

    // Fetch orders that contain products owned by this farmer
    const orders = await prisma.order.findMany({
        where: {
            items: {
                some: {
                    product: { farmerId: session.user.id }
                }
            }
        },
        include: {
            items: {
                where: {
                    product: { farmerId: session.user.id }
                },
                include: { product: true }
            },
            user: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <FarmerOrdersHeader />

            <FarmerOrdersList initialOrders={orders} farmerId={session.user.id} />
        </div>
    );
}
