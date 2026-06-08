import prisma from '@/lib/prisma';
import { IndianRupee, ShoppingBag, Users, Tractor, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Analytics | Yogam Organic Farms',
};

export default async function AnalyticsPage() {
    // 1. Fetch High-Level Metrics
    const [
        totalOrders,
        totalCustomers,
        totalFarmers,
        revenueAggr,
        recentOrders
    ] = await Promise.all([
        prisma.order.count(),
        prisma.user.count({ where: { role: 'USER' } }),
        prisma.user.count({ where: { role: 'FARMER' } }),
        prisma.order.aggregate({
            _sum: { total: true },
            where: { status: { not: 'CANCELLED' } }
        }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } }
        })
    ]);

    const totalRevenue = revenueAggr._sum.total || 0;

    // 2. Fetch Last 7 Days Sales for Chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentSales = await prisma.order.findMany({
        where: {
            createdAt: { gte: sevenDaysAgo },
            status: { not: 'CANCELLED' }
        },
        select: { total: true, createdAt: true }
    });

    // Initialize 7 days array
    const chartData = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(sevenDaysAgo);
        date.setDate(date.getDate() + i);
        return {
            label: date.toLocaleDateString('en-US', { weekday: 'short' }),
            value: 0,
            date: date
        };
    });

    // Aggregate sales
    recentSales.forEach(order => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        
        const chartItem = chartData.find(item => item.date.getTime() === orderDate.getTime());
        if (chartItem) {
            chartItem.value += order.total;
        }
    });

    const maxSalesValue = Math.max(...chartData.map(d => d.value), 1000); // Fallback max to 1000 for visual scale

    // UI Metric Cards Data
    const metrics = [
        { title: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: IndianRupee, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
        { title: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
        { title: 'Total Customers', value: totalCustomers, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
        { title: 'Total Farmers', value: totalFarmers, icon: Tractor, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2d4035] pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Analytics Overview</h2>
                    <p className="text-[#9db8a8] mt-1">Real-time performance metrics and sales trends.</p>
                </div>
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
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-6 md:p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white">Sales Last 7 Days</h3>
                            <p className="text-sm text-[#9db8a8]">Daily revenue progression</p>
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
                        {/* Y-Axis scale markers (Decorative) */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                            {[4, 3, 2, 1, 0].map(i => (
                                <div key={i} className="w-full border-t border-[#9db8a8] border-dashed"></div>
                            ))}
                        </div>

                        {chartData.map((data, i) => {
                            const heightPercentage = Math.max((data.value / maxSalesValue) * 100, 4); // Min 4% height to be visible
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 relative z-10 group">
                                    {/* Tooltip */}
                                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#112117] border border-[#2d4035] text-white text-xs py-1 px-2 rounded whitespace-nowrap shadow-xl pointer-events-none">
                                        ₹{data.value.toFixed(2)}
                                    </div>
                                    
                                    {/* Bar */}
                                    <div className="w-full bg-[#112117] rounded-t-lg relative overflow-hidden h-full flex items-end">
                                        <div 
                                            className="w-full bg-gradient-to-t from-[#25c464] to-[#30e87a] rounded-t-lg transition-all duration-1000 ease-out"
                                            style={{ height: `${heightPercentage}%` }}
                                        ></div>
                                    </div>
                                    
                                    {/* Label */}
                                    <span className="text-xs text-[#9db8a8] font-medium">{data.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Orders List */}
                <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Recent Orders</h3>
                        <Link href="/admin/orders" className="text-sm text-[#30e87a] hover:underline flex items-center gap-1">
                            View All <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {recentOrders.length > 0 ? recentOrders.map(order => (
                            <Link key={order.id} href={`/admin/orders`} className="block group">
                                <div className="p-4 rounded-xl bg-[#112117]/50 border border-[#2d4035] group-hover:border-[#30e87a]/50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="truncate pr-4">
                                            <p className="text-sm font-bold text-white truncate">{order.user?.name || 'Guest User'}</p>
                                            <p className="text-xs text-[#9db8a8] truncate">{order.id.slice(-8)}</p>
                                        </div>
                                        <p className="text-sm font-bold text-[#30e87a] shrink-0">₹{order.total.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-[#5c7a68]">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        <span className={`px-2 py-0.5 rounded-full font-semibold ${
                                            order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500' :
                                            order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-500' :
                                            order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500' :
                                            'bg-purple-500/10 text-purple-500'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-center text-[#9db8a8]">
                                <ShoppingBag className="w-8 h-8 mb-2 opacity-50" />
                                <p className="text-sm">No recent orders found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
