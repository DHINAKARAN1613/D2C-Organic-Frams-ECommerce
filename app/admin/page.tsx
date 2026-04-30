import prisma from '@/lib/prisma';
import {
    DollarSign,
    ShoppingBag,
    AlertCircle,
    TrendingUp,
    Filter,
    Plus,
    Edit2,
    Trash2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AddProductButton } from '@/components/admin/AddProductButton';
import { getImageUrl } from '@/lib/imageUtils';

// Force dynamic
export const dynamic = 'force-dynamic';

async function getStats() {
    try {
        const [orderCount, productCount, lowStockCount, totalRevenue] = await Promise.all([
            prisma.order.count(),
            prisma.product.count(),
            prisma.product.count({ where: { stock: { lt: 10 } } }),
            prisma.order.aggregate({
                _sum: { total: true }
            })
        ]);

        return {
            orders: orderCount,
            products: productCount,
            lowStock: lowStockCount,
            revenue: totalRevenue._sum.total || 0
        };
    } catch (e) {
        console.error("Stats fetch failed", e);
        return { orders: 0, products: 0, lowStock: 0, revenue: 0 };
    }
}

async function getRecentProducts() {
    try {
        return await prisma.product.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { category: true }
        });
    } catch {
        return [];
    }
}

export default async function AdminDashboard() {
    const stats = await getStats();
    const recentProducts = await getRecentProducts();

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1c2e24] border border-[#2d4035] p-6 rounded-2xl flex flex-col justify-between h-48 relative overflow-hidden group hover:border-[#30e87a]/30 transition-colors">
                    <div className="flex justify-between items-start">
                        <div className="size-12 rounded-xl flex items-center justify-center bg-[#30e87a]/20 text-[#30e87a]">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <span className="flex items-center gap-1 bg-[#30e87a]/10 text-[#30e87a] text-xs font-bold px-2 py-1 rounded-lg border border-[#30e87a]/20">
                            <TrendingUp className="w-3 h-3" /> Live
                        </span>
                    </div>
                    <div>
                        <p className="text-[#9db8a8] text-sm font-medium mb-1">Total Revenue</p>
                        <h3 className="text-4xl font-bold text-white tracking-tight">₹{stats.revenue.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-[#1c2e24] border border-[#2d4035] p-6 rounded-2xl flex flex-col justify-between h-48 relative overflow-hidden group hover:border-[#30e87a]/30 transition-colors">
                    <div className="flex justify-between items-start">
                        <div className="size-12 rounded-xl flex items-center justify-center bg-blue-500/20 text-blue-500">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <span className="flex items-center gap-1 bg-blue-500/10 text-blue-500 text-xs font-bold px-2 py-1 rounded-lg border border-blue-500/20">
                            <TrendingUp className="w-3 h-3" /> {stats.orders} Total
                        </span>
                    </div>
                    <div>
                        <p className="text-[#9db8a8] text-sm font-medium mb-1">Total Orders</p>
                        <h3 className="text-4xl font-bold text-white tracking-tight">{stats.orders}</h3>
                    </div>
                </div>

                <div className="bg-[#1c2e24] border border-[#2d4035] p-6 rounded-2xl flex flex-col justify-between h-48 relative overflow-hidden group hover:border-[#30e87a]/30 transition-colors">
                    <div className="flex justify-between items-start">
                        <div className="size-12 rounded-xl flex items-center justify-center bg-orange-500/20 text-orange-500">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <span className="flex items-center gap-1 bg-orange-500/10 text-orange-500 text-xs font-bold px-2 py-1 rounded-lg border border-orange-500/20">
                            Action
                        </span>
                    </div>
                    <div>
                        <p className="text-[#9db8a8] text-sm font-medium mb-1">Low Stock Alerts</p>
                        <h3 className="text-4xl font-bold text-white tracking-tight">{stats.lowStock} Items</h3>
                    </div>
                </div>
            </div>

            {/* Product Management Section */}
            <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-[#2d4035] flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Recent Products</h3>
                    <div className="flex items-center gap-3">
                        <Link href="/admin/products">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#112117] border border-[#2d4035] text-[#9db8a8] text-sm hover:text-white transition-colors">
                                View All
                            </button>
                        </Link>
                        <AddProductButton />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#112117]/50 text-[#9db8a8] text-xs uppercase tracking-wider font-semibold border-b border-[#2d4035]">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Stock</th>
                                <th className="px-6 py-4">Unit</th>
                                <th className="px-6 py-4">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2d4035]">
                            {recentProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[#9db8a8]">
                                        No products yet.
                                    </td>
                                </tr>
                            ) : (
                                recentProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-[#253b30] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-lg bg-white/5 relative overflow-hidden border border-white/10">
                                                    {getImageUrl(product.images) ? (
                                                        <Image src={getImageUrl(product.images)!} alt={product.name} fill className="object-cover" />
                                                    ) : <div className="w-full h-full bg-[#112117]" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{product.name}</p>
                                                    <p className="text-xs text-[#5c6e63]">{product.category.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${product.stock >= 10
                                                ? 'bg-[#30e87a]/10 text-[#30e87a] border-[#30e87a]/20'
                                                : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                                }`}>
                                                {product.stock >= 10 ? 'In Stock' : 'Low Stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`font-bold ${product.stock < 10 ? 'text-orange-500' : 'text-white'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[#9db8a8] text-sm">{product.unit}</td>
                                        <td className="px-6 py-4 font-bold text-white">₹{product.price}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
