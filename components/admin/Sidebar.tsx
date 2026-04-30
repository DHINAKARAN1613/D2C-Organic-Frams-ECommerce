'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, Users, BarChart3, Settings, Leaf, LogOut } from 'lucide-react';

const MENU_ITEMS = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Products', icon: Package, href: '/admin/products' },
    { name: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
    { name: 'Customers', icon: Users, href: '/admin/customers' },
    { name: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
];

export function Sidebar({ lowStockCount = 0 }: { lowStockCount?: number }) {
    const pathname = usePathname();

    return (
        <aside className="w-full h-full bg-[#112117] flex flex-col overflow-y-auto">
            {/* Logo Section */}
            <div className="p-8 pb-12">
                <Link href="/admin" className="flex items-center gap-3 group">
                    <div className="size-10 rounded-xl bg-[#30e87a]/10 flex items-center justify-center border border-[#30e87a]/20 group-hover:bg-[#30e87a]/20 transition-colors">
                        <Leaf className="w-6 h-6 text-[#30e87a]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-white leading-none tracking-tight">Yogam</span>
                        <span className="text-xs font-semibold text-[#9db8a8] tracking-widest uppercase mt-1">Admin Panel</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
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
                            {item.name === 'Products' && lowStockCount > 0 && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-[#112117] text-[#30e87a]' : 'bg-orange-500 text-white'
                                    }`}>
                                    {lowStockCount}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 mt-auto border-t border-[#2d4035] space-y-2">
                <Link
                    href="/shop"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-[#9db8a8] hover:bg-[#1c2e24] hover:text-[#30e87a] group"
                >
                    <ShoppingBag className="w-5 h-5 text-[#9db8a8] group-hover:text-[#30e87a]" />
                    <span className="text-sm font-medium flex-1">Back to Store</span>
                </Link>
                <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#9db8a8] hover:bg-[#1c2e24] hover:text-white transition-colors"
                >
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-medium">Settings</span>
                </Link>

                <div className="pt-2 mt-2 flex items-center gap-3 px-4 border-t border-[#2d4035]/50">
                    <div className="size-10 rounded-full bg-[#1c2e24] border border-[#2d4035] flex items-center justify-center overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">Alex Morgan</p>
                        <p className="text-xs text-[#9db8a8] truncate">Admin</p>
                    </div>
                    <Link href="/api/auth/signout" className="p-2 text-[#9db8a8] hover:text-red-400 transition-colors" title="Sign Out">
                        <LogOut className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </aside>
    );
}
