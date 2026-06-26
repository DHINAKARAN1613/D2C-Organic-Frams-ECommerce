'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Leaf, LogOut, Store, ShoppingBag, BarChart3, ShieldCheck, MessageSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';

export function FarmerSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { t } = useLanguage();

    const MENU_ITEMS = [
        { name: t.dashboard, icon: LayoutDashboard, href: '/farmer' },
        { name: t.products, icon: Package, href: '/farmer/products' },
        { name: t.orders, icon: ShoppingBag, href: '/farmer/orders' },
        { name: t.messages, icon: MessageSquare, href: '/farmer/messages' },
        { name: t.analytics, icon: BarChart3, href: '/farmer/analytics' },
        { name: t.verification, icon: ShieldCheck, href: '/farmer/kyc' },
    ];

    return (
        <aside className="w-full h-full bg-surface border-r border-border flex flex-col overflow-y-auto transition-colors duration-300">
            {/* Logo Section */}
            <div className="p-8 pb-12">
                <Link href="/farmer" className="flex items-center gap-3 group">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                        <Leaf className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-foreground leading-none tracking-tight">Yogam</span>
                        <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mt-1">{t.farmerPanel}</span>
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
                                ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20'
                                : 'text-muted-foreground hover:bg-surface-highlight hover:text-foreground'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
                            <span className="text-sm flex-1">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 mt-auto border-t border-border space-y-2">
                <div className="px-4 py-2 flex items-center justify-between gap-2">
                    <LanguageToggle />
                    <ThemeToggle />
                </div>
                <Link
                    href="/shop"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-muted-foreground hover:bg-muted hover:text-foreground group font-medium"
                >
                    <Store className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm flex-1">{t.shop}</span>
                </Link>
                <div className="pt-2 mt-2 flex items-center gap-3 px-4 border-t border-border">
                    <div className="size-10 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        <img src={session?.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Farmer"} alt="Farmer" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{session?.user?.name || "Farmer"}</p>
                        <p className="text-xs font-semibold text-muted-foreground truncate">{t.seller}</p>
                    </div>
                    <Link href="/api/auth/signout" className="p-2 text-muted-foreground hover:text-red-500 transition-colors" title={t.logout}>
                        <LogOut className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </aside>
    );
}
