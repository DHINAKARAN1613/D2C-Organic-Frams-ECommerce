'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Leaf, LogOut, Store, ShoppingBag, BarChart3, ShieldCheck, MessageSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

export function FarmerSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { t } = useLanguage();

    const MENU_ITEMS = [
        { name: t.dashboard, icon: LayoutDashboard, href: '/farmer' },
        { name: t.products, icon: Package, href: '/farmer/products' },
        { name: t.orders, icon: ShoppingBag, href: '/farmer/orders' },
        { name: 'Messages', icon: MessageSquare, href: '/farmer/messages' },
        { name: t.analytics, icon: BarChart3, href: '/farmer/analytics' },
        { name: 'Verification', icon: ShieldCheck, href: '/farmer/kyc' },
    ];

    return (
        <aside className="w-full h-full bg-[#112117] flex flex-col overflow-y-auto">
            {/* Logo Section */}
            <div className="p-8 pb-12">
                <Link href="/farmer" className="flex items-center gap-3 group">
                    <div className="size-10 rounded-xl bg-[#30e87a]/10 flex items-center justify-center border border-[#30e87a]/20 group-hover:bg-[#30e87a]/20 transition-colors">
                        <Leaf className="w-6 h-6 text-[#30e87a]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-white leading-none tracking-tight">Yogam</span>
                        <span className="text-xs font-semibold text-[#9db8a8] tracking-widest uppercase mt-1">Farmer Panel</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-[#30e87a] text-[#112117] font-bold shadow-lg shadow-[#30e87a]/20'
                                : 'text-[#9db8a8] hover:bg-[#1c2e24] hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-[#112117]' : 'text-[#9db8a8] group-hover:text-white'}`} />
                            <span className="text-sm flex-1">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 mt-auto border-t border-[#2d4035] space-y-2">
                <div className="px-4 py-2">
                    <LanguageToggle />
                </div>
                <Link
                    href="/shop"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-[#9db8a8] hover:bg-[#1c2e24] hover:text-[#30e87a] group"
                >
                    <Store className="w-5 h-5 text-[#9db8a8] group-hover:text-[#30e87a]" />
                    <span className="text-sm font-medium flex-1">{t.shop}</span>
                </Link>
                <div className="pt-2 mt-2 flex items-center gap-3 px-4 border-t border-[#2d4035]/50">
                    <div className="size-10 rounded-full bg-[#1c2e24] border border-[#2d4035] flex items-center justify-center overflow-hidden">
                        <img src={session?.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Farmer"} alt="Farmer" className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{session?.user?.name || "Farmer"}</p>
                        <p className="text-xs text-[#9db8a8] truncate">Seller</p>
                    </div>
                    <Link href="/api/auth/signout" className="p-2 text-[#9db8a8] hover:text-red-400 transition-colors" title={t.logout}>
                        <LogOut className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </aside>
    );
}
