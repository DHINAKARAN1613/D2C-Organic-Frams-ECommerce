import prisma from '@/lib/prisma';
import { User, Mail, Phone, Calendar, Leaf } from 'lucide-react';
import Link from 'next/link';
import { VerifyFarmerButton } from '@/components/admin/VerifyFarmerButton';

export const dynamic = 'force-dynamic';

async function getCustomers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { orders: true, products: true } } }
        });
        return users;
    } catch (error) {
        console.error("Failed to fetch customers:", error);
        return [];
    }
}

export default async function CustomersPage() {
    const users = await getCustomers();
    const farmers = users.filter(u => u.role === 'FARMER');
    const customers = users.filter(u => u.role !== 'FARMER' && u.role !== 'ADMIN');

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Users & Farmers</h2>
                <p className="text-[#9db8a8]">Manage registered users and verify farmer accounts.</p>
            </div>

            {/* Farmers Section */}
            {farmers.length > 0 && (
                <section className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-[#30e87a]" /> Farmer Accounts
                        <span className="text-sm font-normal text-[#9db8a8]">({farmers.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {farmers.map((user) => (
                            <div key={user.id} className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-5 group hover:border-[#30e87a]/30 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-11 rounded-full bg-[#112117] border border-[#2d4035] flex items-center justify-center overflow-hidden shrink-0">
                                            {user.image ? (
                                                <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-5 h-5 text-[#9db8a8]" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-white truncate">{user.name || 'Guest User'}</h3>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                {(user as any).isVerifiedFarmer ? (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">✓ Verified</span>
                                                ) : (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#30e87a]/10 text-[#30e87a] border border-[#30e87a]/20 font-bold">Farmer</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-[#9db8a8]">
                                        <Mail className="w-3.5 h-3.5 shrink-0" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                    {user.phone && (
                                        <div className="flex items-center gap-2 text-sm text-[#9db8a8]">
                                            <Phone className="w-3.5 h-3.5 shrink-0" />
                                            <span>{user.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-[#9db8a8]">
                                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-[#2d4035] flex justify-between items-center gap-2">
                                    <span className="text-xs text-[#9db8a8]">{user._count.products} products · {user._count.orders} orders</span>
                                    <VerifyFarmerButton
                                        userId={user.id}
                                        isVerified={(user as any).isVerifiedFarmer}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Regular Customers */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-[#9db8a8]" /> Customers
                    <span className="text-sm font-normal text-[#9db8a8]">({customers.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customers.map((user) => (
                        <div key={user.id} className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-5 hover:border-[#30e87a]/20 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="size-11 rounded-full bg-[#112117] border border-[#2d4035] flex items-center justify-center overflow-hidden shrink-0">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5 text-[#9db8a8]" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-white truncate">{user.name || 'Guest User'}</h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-[#9db8a8]/10 text-[#9db8a8] border-[#9db8a8]/20'} font-bold`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-[#9db8a8]">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span className="truncate">{user.email || 'No Email'}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-2 text-sm text-[#9db8a8]">
                                        <Phone className="w-3.5 h-3.5" />
                                        <span>{user.phone}</span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#2d4035] flex justify-between items-center">
                                <span className="text-xs text-[#9db8a8]">{user._count.orders} orders</span>
                                <Link href={`/admin/customers/${user.id}`} className="text-xs text-[#30e87a] font-bold hover:underline">View History</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
