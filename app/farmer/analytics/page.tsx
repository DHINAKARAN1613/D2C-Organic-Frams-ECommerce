import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { IndianRupee, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import PriceChart from '@/components/farmer/PriceChart';

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

    // UI Metrics
    const metrics = [
        { title: 'Total Earnings', value: `₹${totalEarnings.toFixed(2)}`, icon: IndianRupee, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
        { title: 'Items Sold', value: totalItemsSold, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
        { title: 'Active Products', value: activeProducts, icon: Package, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
        { title: 'Attention Needed', value: lowStockProducts + outOfStockProducts, icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
    ];

    return (
        <div className="space-y-8">
            <div className="border-b border-[#2d4035] pb-6">
                <h1 className="text-3xl font-bold text-white tracking-tight">Your Farm Analytics</h1>
                <p className="text-[#9db8a8] mt-1">Track your sales, earnings, and inventory health.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, i) => (
                    <div key={i} className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-6 relative overflow-hidden group hover:border-[#30e87a]/50 transition-colors">
                        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl ${metric.bg} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`p-3 rounded-xl ${metric.bg} ${metric.border} border`}>
                                <metric.icon className={`w-6 h-6 ${metric.color}`} />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-white tracking-tight">{metric.value}</h3>
                            <p className="text-[#9db8a8] text-sm mt-1 font-medium">{metric.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Earnings Chart */}
                <div className="lg:col-span-2 bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-6 md:p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white">Earnings Last 7 Days</h3>
                            <p className="text-sm text-[#9db8a8]">Your daily revenue progression</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-[#30e87a]">
                                ₹{chartData.reduce((acc, curr) => acc + curr.value, 0).toFixed(2)}
                            </p>
                            <p className="text-xs text-[#9db8a8] uppercase tracking-wider font-semibold">Weekly Total</p>
                        </div>
                    </div>

                    {/* Custom CSS Bar Chart */}
                    <div className="flex-1 flex items-end gap-2 sm:gap-4 mt-auto min-h-[250px] relative">
                        {/* Y-Axis scale markers */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                            {[4, 3, 2, 1, 0].map(i => (
                                <div key={i} className="w-full border-t border-[#9db8a8] border-dashed"></div>
                            ))}
                        </div>

                        {chartData.map((data, i) => {
                            const heightPercentage = Math.max((data.value / maxSalesValue) * 100, 4);
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 relative z-10 group">
                                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#112117] border border-[#2d4035] text-white text-xs py-1 px-2 rounded whitespace-nowrap shadow-xl pointer-events-none">
                                        ₹{data.value.toFixed(2)}
                                    </div>
                                    <div className="w-full bg-[#112117] rounded-t-lg relative overflow-hidden h-full flex items-end">
                                        <div 
                                            className="w-full bg-gradient-to-t from-[#3b82f6] to-[#60a5fa] rounded-t-lg transition-all duration-1000 ease-out"
                                            style={{ height: `${heightPercentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-[#9db8a8] font-medium">{data.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Inventory Health */}
                <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-6 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-6">Inventory Health</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-[#9db8a8]">Active & Healthy</span>
                                <span className="text-emerald-400 font-bold">{activeProducts}</span>
                            </div>
                            <div className="h-2 w-full bg-[#112117] rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(activeProducts / Math.max(myProducts.length, 1)) * 100}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-[#9db8a8]">Low Stock (&lt;10)</span>
                                <span className="text-orange-400 font-bold">{lowStockProducts}</span>
                            </div>
                            <div className="h-2 w-full bg-[#112117] rounded-full overflow-hidden">
                                <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(lowStockProducts / Math.max(myProducts.length, 1)) * 100}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-[#9db8a8]">Out of Stock</span>
                                <span className="text-red-400 font-bold">{outOfStockProducts}</span>
                            </div>
                            <div className="h-2 w-full bg-[#112117] rounded-full overflow-hidden">
                                <div className="h-full bg-red-400 rounded-full" style={{ width: `${(outOfStockProducts / Math.max(myProducts.length, 1)) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6">
                        <Link href="/farmer/products" className="w-full block text-center bg-[#112117] hover:bg-[#2d4035] text-[#9db8a8] hover:text-white border border-[#2d4035] rounded-xl py-3 text-sm font-bold transition-colors">
                            Manage Inventory
                        </Link>
                    </div>
                </div>
            </div>

            {/* Price Chart Open-Source Feature */}
            <div className="mt-8">
                <PriceChart />
            </div>
        </div>
    );
}
