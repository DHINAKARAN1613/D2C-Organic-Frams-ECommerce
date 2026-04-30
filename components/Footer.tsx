'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Leaf } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-background pt-16 pb-8 border-t border-border">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="size-6 text-yellow-500 flex items-center justify-center bg-yellow-500/10 rounded-full">
                                <Leaf className="w-4 h-4 fill-current" />
                            </div>
                            <span className="text-foreground text-lg font-bold font-display">Yogam <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Organic Farms</span></span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Ethically sourced, organic products for a healthier you and a happier planet.
                        </p>
                    </div>

                    {/* Links Column 1 */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-foreground font-bold mb-1">Shop</h4>
                        <Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">New Arrivals</Link>
                        <Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">Best Sellers</Link>
                        <Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">Gift Cards</Link>
                        <Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">Sale</Link>
                    </div>

                    {/* Links Column 2 */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-foreground font-bold mb-1">Support</h4>
                        <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">Help Center</Link>
                        <Link href="/orders" className="text-muted-foreground hover:text-primary transition-colors text-sm">Track Order</Link>
                        <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact Us</Link>
                    </div>

                    {/* Socials Column */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-foreground font-bold">Follow Us</h4>
                        <div className="flex gap-3">
                            <a aria-label="Facebook" className="size-10 rounded-full bg-surface flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all" href="#">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a aria-label="Instagram" className="size-10 rounded-full bg-surface flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all" href="#">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a aria-label="Twitter" className="size-10 rounded-full bg-surface flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all" href="#">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground text-sm text-center md:text-left">© {new Date().getFullYear()} Organic Essentials. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/policies" className="text-secondary-text hover:text-white text-sm">Privacy Policy</Link>
                        <Link href="/terms" className="text-secondary-text hover:text-white text-sm">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
