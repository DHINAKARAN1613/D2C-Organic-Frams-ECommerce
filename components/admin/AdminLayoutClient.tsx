"use client";

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';
import { Menu, X } from 'lucide-react';

export default function AdminLayoutClient({ children, lowStockCount }: { children: React.ReactNode, lowStockCount?: number }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#112117] overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar with mobile classes */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-[#0d1a12] border-r border-[#2d4035] transform transition-transform duration-300 ease-in-out md:static md:translate-x-0
                ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
            `}>
                <div className="absolute top-4 right-4 md:hidden">
                    <button onClick={() => setIsSidebarOpen(false)} className="text-[#9db8a8] hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <Sidebar lowStockCount={lowStockCount} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile Header Toggle (if Header doesn't have it, we can overlay it or modify Header. Let's wrap Header) */}
                <div className="md:hidden absolute top-4 left-4 z-50">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-lg bg-[#1c2e24] border border-[#2d4035] text-[#9db8a8] hover:text-white shadow-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-[#2d4035] scrollbar-track-transparent">
                    {children}
                </main>
            </div>
        </div>
    );
}
