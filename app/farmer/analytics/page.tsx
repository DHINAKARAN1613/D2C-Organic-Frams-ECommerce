import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { IndianRupee, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import PriceChart from '@/components/farmer/PriceChart';
import FarmerAnalyticsClient from '@/components/farmer/FarmerAnalyticsClient';

export const metadata = {
    title: 'Analytics | Farmer Panel | Yogam Organic Farms',
};

export default async function FarmerAnalyticsPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'FARMER') {
        redirect('/auth/signin');
    }

    // 1. Fetch Farmer's Products
    const myProducts = await prisma.product.findMany({
        where: { farmerId: session.user.id },
        select: { id: true, name: true, stock: true }
    });
    
    const myProductIds = myProducts.map(p => p.id);

    // 2. Fetch Order Items for Farmer's Products
    const myOrderItems = await prisma.orderItem.findMany({
        where: {
            productId: { in: myProductIds },
            order: { status: { not: 'CANCELLED' } }
        },
        include: {
            order: { select: { createdAt: true } },
            product: { select: { name: true } }
        }
    });

    // 3. Calculate Metrics
    let totalEarnings = 0;
    let totalItemsSold = 0;
    
    myOrderItems.forEach(item => {
        totalEarnings += (item.price * item.quantity);
        totalItemsSold += item.quantity;
    });

    const activeProducts = myProducts.filter(p => p.stock > 0).length;
    const lowStockProducts = myProducts.filter(p => p.stock < 10 && p.stock > 0).length;
    const outOfStockProducts = myProducts.filter(p => p.stock === 0).length;

    // 4. Calculate Sales for the Last 7 Days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const chartData = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(sevenDaysAgo);
        date.setDate(date.getDate() + i);
        return {
            label: date.toLocaleDateString('en-US', { weekday: 'short' }),
            value: 0,
            date: date
        };
    });

    myOrderItems.forEach(item => {
        const orderDate = new Date(item.order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        
        const chartItem = chartData.find(c => c.date.getTime() === orderDate.getTime());
        if (chartItem) {
            chartItem.value += (item.price * item.quantity);
        }
    });

    const maxSalesValue = Math.max(...chartData.map(d => d.value), 500); // Minimum scale

    return (
        <FarmerAnalyticsClient
            totalEarnings={totalEarnings}
            totalItemsSold={totalItemsSold}
            activeProducts={activeProducts}
            attentionNeeded={lowStockProducts + outOfStockProducts}
            chartData={chartData}
            maxSalesValue={maxSalesValue}
            totalProductsCount={myProducts.length}
            lowStockProducts={lowStockProducts}
            outOfStockProducts={outOfStockProducts}
        />
    );
}
