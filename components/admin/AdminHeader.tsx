'use client';

import { Search, Bell } from 'lucide-react';

export function AdminHeader() {
    return (
        <header className="h-20 w-full flex items-center justify-between pl-16 pr-8 md:px-8 bg-[#112117] sticky top-0 z-40 border-b border-[#2d4035] shadow-sm shrink-0">
            {/* Title / Breadcrumb Placeholder */}
            <div className="min-w-0">
                <h2 className="text-2xl font-bold text-white tracking-tight truncate">Dashboard Overview</h2>
                <p className="text-sm text-[#9db8a8] truncate">Welcome back, here's what's happening today.</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 shrink-0">
                {/* Search */}
                <div className="relative w-80 hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9db8a8]" />
                    <input
                        type="text"
                        placeholder="Search for orders, products..."
                        className="w-full h-10 bg-[#1c2e24] border border-[#2d4035] rounded-full pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#30e87a] transition-all"
                    />
                </div>

                {/* Notifications */}
                <div className="relative group">
                    <button className="relative p-2 rounded-full hover:bg-[#1c2e24] transition-colors text-[#9db8a8] hover:text-white">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#30e87a] rounded-full ring-2 ring-[#112117]"></span>
                    </button>

                    {/* Hover Dropdown for notifications */}
                    <div className="absolute right-0 top-full mt-2 w-80 bg-[#1c2e24] border border-[#2d4035] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                        <div className="p-4 border-b border-[#2d4035]">
                            <h3 className="font-bold text-white">Notifications</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex gap-3 items-start">
                                <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full shrink-0" />
                                <div>
                                    <p className="text-sm text-white">New order received</p>
                                    <p className="text-xs text-[#5c6e63]">2 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="w-2 h-2 mt-1.5 bg-orange-500 rounded-full shrink-0" />
                                <div>
                                    <p className="text-sm text-white">Low stock alert</p>
                                    <p className="text-xs text-[#5c6e63]">1 hour ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-6 border-l border-[#2d4035]">
                </div>
            </div>
        </header>
    );
}
