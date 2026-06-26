'use client';

import { Search, Bell } from 'lucide-react';

export function AdminHeader() {
    return (
        <header className="h-20 w-full flex items-center justify-between pl-16 pr-8 md:px-8 bg-surface sticky top-0 z-40 border-b border-border shadow-sm shrink-0">
            {/* Title / Breadcrumb Placeholder */}
            <div className="min-w-0">
                <h2 className="text-2xl font-bold text-foreground tracking-tight truncate">Dashboard Overview</h2>
                <p className="text-sm font-medium text-muted-foreground truncate">Welcome back, here's what's happening today.</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 shrink-0">
                {/* Search */}
                <div className="relative w-80 hidden md:block">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search for orders, products..."
                        className="w-full h-10 bg-background border border-border rounded-full pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner"
                    />
                </div>

                {/* Notifications */}
                <div className="relative group">
                    <button className="relative p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-surface"></span>
                    </button>

                    {/* Hover Dropdown for notifications */}
                    <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                        <div className="p-4 border-b border-border">
                            <h3 className="font-bold text-foreground">Notifications</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex gap-3 items-start">
                                <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-foreground">New order received</p>
                                    <p className="text-xs font-medium text-muted-foreground">2 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="w-2 h-2 mt-1.5 bg-orange-500 rounded-full shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Low stock alert</p>
                                    <p className="text-xs font-medium text-muted-foreground">1 hour ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-6 border-l border-border">
                </div>
            </div>
        </header>
    );
}
