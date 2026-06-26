'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, User, Leaf } from 'lucide-react';
import { Button } from './ui/Button';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserNav } from './UserNav';
import { useCart } from '@/context/CartContext';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const pathname = usePathname();
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

    const isHeroTop = pathname === '/' && !isScrolled;

    return (
        <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
            isScrolled 
                ? 'bg-surface/95 backdrop-blur-md border-b border-border py-0 text-foreground shadow-md' 
                : pathname === '/'
                    ? 'bg-gradient-to-b from-black/70 via-black/30 to-transparent backdrop-blur-[2px] border-b border-white/10 py-3 text-white'
                    : 'bg-surface/85 backdrop-blur-md border-b border-border/60 py-2 text-foreground shadow-sm'
        }`}>
            <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="relative flex items-center gap-2 group">
                    {/* Ambient Glow */}
                    <div className="absolute inset-0 -z-10 blur-xl bg-primary/30 rounded-full opacity-50 animate-pulse"></div>

                    <div className="relative size-10 rounded-xl bg-surface backdrop-blur-sm border border-border flex items-center justify-center shadow-md group-hover:border-primary/50 transition-colors">
                        <Leaf className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-lg font-bold leading-none tracking-tight drop-shadow-sm ${isHeroTop ? 'text-white' : 'text-foreground'}`}>Yogam</span>
                        <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 tracking-widest drop-shadow-sm">Organic Farms</span>
                    </div>
                </Link>

                {/* Search Bar (Desktop) */}
                <div className="hidden md:flex flex-1 max-w-md mx-4">
                    <div className="relative w-full group/search">
                        <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${isHeroTop ? 'text-white/70 group-focus-within/search:text-yellow-400' : 'text-muted-foreground group-focus-within/search:text-primary'}`}>
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            className={`block w-full pl-11 pr-4 py-2.5 border rounded-full leading-5 placeholder:text-muted-foreground focus:outline-none sm:text-sm transition-all shadow-inner ${
                                isHeroTop
                                    ? 'bg-black/40 border-white/20 text-white placeholder:text-white/70 focus:bg-black/60 focus:ring-1 focus:ring-yellow-400'
                                    : 'bg-surface border-border text-foreground placeholder:text-muted-foreground focus:bg-surface-highlight focus:ring-1 focus:ring-primary'
                            }`}
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
                        <Link href="/shop" className={`text-sm font-bold transition-colors ${isHeroTop ? 'text-white hover:text-yellow-400' : 'text-foreground hover:text-primary'}`}>Shop</Link>
                        <Link href="/about" className={`text-sm font-semibold transition-colors ${isHeroTop ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>About</Link>
                        <Link href="/auth/signup?role=farmer" className={`text-sm font-extrabold transition-colors flex items-center gap-1 ${isHeroTop ? 'text-yellow-400 hover:text-yellow-300' : 'text-primary hover:text-primary/80'}`}><Leaf className="w-4 h-4"/> For Farmers</Link>
                    </div>

                    <div className={`h-6 w-px hidden lg:block ${isHeroTop ? 'bg-white/20' : 'bg-border'}`}></div>

                    {/* Icons */}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <motion.button
                            onClick={toggleCart}
                            aria-label="Cart"
                            className={`relative p-2 rounded-full transition-colors group ${isHeroTop ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-muted/50'}`}
                            whileHover="hover"
                        >
                            <motion.div
                                variants={{
                                    hover: { rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 0.5 } }
                                }}
                            >
                                <ShoppingBag className={`w-6 h-6 transition-colors stroke-[2] ${isHeroTop ? 'group-hover:text-yellow-400' : 'group-hover:text-primary'}`} />
                            </motion.div>
                            <AnimatePresence>
                                {itemsCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute top-0 right-0 size-2.5 bg-primary rounded-full border border-background shadow-md"
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
                                    className={`hidden sm:block text-sm font-bold transition-colors ${isHeroTop ? 'text-white hover:text-yellow-400' : 'text-foreground hover:text-primary'}`}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-extrabold hover:opacity-90 hover:scale-105 transition-all shadow-md"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className={`md:hidden p-2 rounded-full ${isHeroTop ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-muted/50'}`}
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
                        className="md:hidden border-b border-border overflow-hidden bg-surface shadow-xl"
                    >
                        <div className="container px-4 py-6 flex flex-col gap-4">
                            {/* Mobile Search */}
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full bg-background border border-border rounded-full pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:ring-1 focus:ring-primary outline-none shadow-inner"
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
                            <Link href="/" className="text-foreground font-bold hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>
                                Home
                            </Link>
                            <Link href="/shop" className="text-foreground font-bold hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>
                                Shop
                            </Link>
                            <Link href="/about" className="text-foreground font-bold hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>
                                About
                            </Link>
                            <Link href="/auth/signup?role=farmer" className="text-primary font-extrabold hover:opacity-80 py-2 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                                <Leaf className="w-4 h-4" /> For Farmers
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
