import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Package, TrendingUp } from 'lucide-react';

export default async function FarmerDashboard() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) return null;

    const productsCount = await prisma.product.count({
        where: { farmerId: userId }
    });

    // In a real application, we would also query orders containing these products to calculate revenue.
    // For now, we'll just show the product count.

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back, {session?.user?.name}!</h2>
                <p className="text-[#9db8a8]">Here is what is happening with your farm today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#1c2e24] p-6 rounded-2xl border border-[#2d4035]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Package className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                    <p className="text-[#9db8a8] text-sm font-semibold mb-1">Your Products</p>
                    <h3 className="text-3xl font-black text-white">{productsCount}</h3>
                </div>

                <div className="bg-[#1c2e24] p-6 rounded-2xl border border-[#2d4035]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-500/10 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <p className="text-[#9db8a8] text-sm font-semibold mb-1">Total Sales</p>
                    <h3 className="text-3xl font-black text-white">₹0</h3>
                    <p className="text-xs text-secondary-text mt-1">Feature coming soon</p>
                </div>
            </div>
        </div>
    );
}
