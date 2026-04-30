import prisma from '@/lib/prisma';
import { Package, Truck, CheckCircle } from 'lucide-react';
import { OrderStatusSelector } from './OrderStatusSelector';

export const dynamic = 'force-dynamic';

async function getOrders() {
    try {
        const orders = await prisma.order.findMany({
            include: { user: true, items: true },
            orderBy: { createdAt: 'desc' }
        });
        return orders;
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        return [];
    }
}

const STATUS_Styles = {
    PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    CONFIRMED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    SHIPPED: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    DELIVERED: 'bg-[#30e87a]/10 text-[#30e87a] border-[#30e87a]/20',
    CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export default async function OrdersPage() {
    const orders = await getOrders();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Orders</h2>
                    <p className="text-[#9db8a8]">Track and manage customer orders.</p>
                </div>
            </div>

            <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#112117]/50 text-[#9db8a8] text-xs uppercase tracking-wider font-semibold border-b border-[#2d4035]">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2d4035]">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[#9db8a8]">
                                        No items ordered yet.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-[#253b30] transition-colors">
                                        <td className="px-6 py-4 text-white font-mono text-sm">#{order.id.slice(-6)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">{order.shippingName || order.user?.name || 'Guest'}</span>
                                                <span className="text-xs text-[#5c6e63]">{order.shippingCity}, {order.shippingZip}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[#9db8a8] text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-white">₹{order.total.toFixed(2)}</td>
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
