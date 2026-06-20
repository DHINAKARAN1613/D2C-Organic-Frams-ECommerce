'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, User, Leaf } from 'lucide-react';
import { Button } from './ui/Button';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserNav } from './UserNav';
import { useCart } from '@/context/CartContext';
import { LanguageToggle } from './ui/LanguageToggle';

export function Navbar() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const { toggleCart, items } = useCart();

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    // Calculate total items
    const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
            isScrolled 
                ? 'bg-[#112117]/95 backdrop-blur-md border-b border-[#2d4035] py-0' 
                : 'bg-transparent py-2'
        }`}>
            <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="relative flex items-center gap-2 group">
                    {/* Ambient Glow */}
                    <div className="absolute inset-0 -z-10 blur-xl bg-primary/30 rounded-full opacity-50 animate-pulse"></div>

                    <div className="relative size-10 rounded-xl bg-[#112117]/80 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-lg group-hover:border-primary/50 transition-colors">
                        <Leaf className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-white leading-none tracking-tight drop-shadow-md">Yogam</span>
                        <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 tracking-widest drop-shadow-sm">Organic Farms</span>
                    </div>
                </Link>

                {/* Search Bar (Desktop) */}
                <div className="hidden md:flex flex-1 max-w-md mx-4">
                    <div className="relative w-full group/search">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-text group-focus-within/search:text-primary transition-colors">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-full leading-5 bg-surface text-foreground placeholder-muted-foreground focus:outline-none focus:bg-surface-highlight focus:ring-1 focus:ring-primary sm:text-sm transition-all"
                            placeholder="Search for soaps, oils, essentials..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 sm:gap-6">
                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-6">
                        <Link href="/shop" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Shop</Link>
                        <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
                        <Link href="/auth/signup?role=farmer" className="text-sm font-medium text-[#30e87a] hover:text-[#25c465] transition-colors flex items-center gap-1"><Leaf className="w-4 h-4"/> For Farmers</Link>
                    </div>

                    <div className="h-6 w-px bg-white/10 hidden lg:block"></div>

                    {/* Icons */}
                    <div className="flex items-center gap-2">
                        <LanguageToggle />

                        <motion.button
                            onClick={toggleCart}
                            aria-label="Cart"
                            className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors group"
                            whileHover="hover"
                        >
                            <motion.div
                                variants={{
                                    hover: { rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 0.5 } }
                                }}
                            >
                                <ShoppingBag className="w-6 h-6 group-hover:text-primary transition-colors" />
                            </motion.div>
                            <AnimatePresence>
                                {itemsCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute top-0 right-0 size-2.5 bg-[#30e87a] rounded-full border border-[#112117] shadow-[0_0_8px_rgba(48,232,122,0.6)]"
                                    ></motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {session ? (
                            <UserNav />
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/auth/signin"
                                    className="hidden sm:block text-sm font-medium text-white hover:text-primary transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="px-5 py-2.5 rounded-full bg-[#30e87a] text-[#112117] text-sm font-bold hover:bg-[#25c465] hover:scale-105 transition-all shadow-[0_0_20px_rgba(48,232,122,0.3)]"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-white hover:bg-white/10 rounded-full"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-b border-[#2d4035] overflow-hidden bg-[#112117]"
                    >
                        <div className="container px-4 py-6 flex flex-col gap-4">
                            {/* Mobile Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-text" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full bg-[#1c2e24] rounded-full pl-9 pr-4 py-3 text-white text-sm focus:ring-1 focus:ring-primary outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                            setIsMenuOpen(false);
                                        }
                                    }}
                                />
                            </div>
                            <Link href="/" className="text-white font-medium hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>
                                Home
                            </Link>
                            <Link href="/shop" className="text-white font-medium hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>
                                Shop
                            </Link>
                            <Link href="/about" className="text-white font-medium hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>
                                About
                            </Link>
                            <Link href="/auth/signup?role=farmer" className="text-[#30e87a] font-bold hover:text-[#25c465] py-2 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                                <Leaf className="w-4 h-4" /> For Farmers
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
