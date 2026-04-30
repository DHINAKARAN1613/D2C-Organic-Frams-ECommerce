import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { User, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getCustomer(id: string) {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            orders: {
                orderBy: { createdAt: 'desc' },
                include: { items: true } // Assuming items exists, schema check needed if detailed view required
            }
        }
    });
    return user;
}

// React.use() workaround for Params in Next 15+ if needed, but standard prop works for server components usually.
// sticking to props: { params: { id: string } }
export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getCustomer(id);

    if (!user) return notFound();

    return (
        <div className="space-y-8">
            {/* Header / Profile Card */}
            <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="size-24 rounded-full bg-[#112117] border-2 border-[#30e87a] flex items-center justify-center overflow-hidden shadow-2xl shadow-[#30e87a]/10">
                    {user.image ? (
                        <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-10 h-10 text-[#30e87a]" />
                    )}
                </div>
                <div className="text-center md:text-left space-y-2 flex-1">
                    <h1 className="text-3xl font-bold text-white">{user.name || 'Guest User'}</h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[#9db8a8]">
                        <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user.email}</span>
                        {user.phone && <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {user.phone}</span>}
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-[#30e87a]">{user.orders.length}</div>
                    <div className="text-sm text-[#9db8a8] uppercase tracking-wider font-semibold">Total Orders</div>
                </div>
            </div>

            {/* Order History */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#30e87a]" /> Order History
                </h2>

                <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#112117]/50 text-[#9db8a8] text-xs uppercase tracking-wider font-semibold border-b border-[#2d4035]">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2d4035]">
                            {user.orders.map((order) => (
                                <tr key={order.id} className="hover:bg-[#253b30] transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm text-white">#{order.id.slice(-6)}</td>
                                    <td className="px-6 py-4 text-[#9db8a8] text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-[#112117] border-[#2d4035] text-white`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-white">₹{order.total.toFixed(2)}</td>
                                </tr>
                            ))}
                            {user.orders.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-[#9db8a8]">No orders found for this customer.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
