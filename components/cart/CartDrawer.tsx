'use client';

import {
    X,
    ShoppingBag,
    ArrowRight,
    Trash2,
    Minus,
    Plus,
    Lock,
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Mock Recommendations Data (since we don't have global product access here easily without props)
const RECOMMENDATIONS = [
    {
        id: "7",
        name: "Organic Honey",
        price: 850,
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=200",
        details: "500g Jar"
    },
    {
        id: "6",
        name: "Artisan Sourdough",
        price: 560,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_3Wd8BKT5IzxyXvBlgtYUzXkf3qah6H0943Czp8vITtgMi3D8_1LUpo4qi6Tno5NMDdeKuuvhSxxp0LBMGA9LgnX8w-frCirLQ-YUYM5xFtArE8FyBVqfiYTG-NF4Pa8mO28wirxTkVM9c9CBmr5Mt17p6jCyajc-BRjqs6TKRyWTBlBk0B3tPaBXR4hDA8sKSn_KaQd7-dH_VI4q5k_SoU0aC9DrRqB5MxuTsBXW3-YlR_EMl5UQhJSkmETSiIMalgabZX3CsbE",
        details: "Per Loaf"
    },
    {
        id: "3",
        name: "Raw Almonds",
        price: 790,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFkNZan8Qr_v0eKgBTvA4SYhRMNgIef-BCVdGqpcWGYz2kuSrCMIkBHKfZnlwNnub4CnR1r0sI4VsKA2OooGL3kNWq0vwZFsh08EB9NBqgvjTYdqoRNkEjm8Asi85lK6T8i1UfE8B3jzea2FFsTw3qMpBkU1pSKESk8Gn0GfKFw3nfe5azDldsa6lZBksL4kiByRTDghw7Hz3ayuy-PXwiMmjShCvwyiFH6EvEinUA1P3n2HIbBFNKOXAp-wCD72px5sO2vb4safM",
        details: "250g"
    }
];

export function CartDrawer() {
    const { isOpen, toggleCart, items, subtotal, updateQuantity, removeItem, addItem } = useCart();
    const [promoCode, setPromoCode] = useState('');

    // Free Shipping Calculation (Threshold: ₹1500)
    const freeShippingThreshold = 1500;
    const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
    const progressPercentage = Math.min(100, (subtotal / freeShippingThreshold) * 100);

    // Prevent scrolling when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
                    />

                    {/* Drawer */}
                    <div className="fixed inset-y-0 right-0 z-50 flex max-w-full pl-0 md:pl-10 pointer-events-none">
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="pointer-events-auto w-screen max-w-md bg-[#112117] flex flex-col shadow-2xl h-full border-l border-[#2d4035]"
                        >
                            {/* Header */}
                            <header className="flex items-center justify-between px-6 py-6 border-b border-[#2d4035] bg-[#112117]">
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="text-primary w-6 h-6" />
                                    <h2 className="text-xl font-bold tracking-tight text-white">
                                        Your Cart
                                        <span className="text-[#9db8a8] font-normal text-base ml-1">({items.length} items)</span>
                                    </h2>
                                </div>
                                <button
                                    onClick={toggleCart}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1c2e24] text-white hover:bg-[#2d4035] transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </header>

                            {/* Scrollable Content Area */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-[#112117]">

                                {/* Free Shipping Progress */}
                                <div className="bg-[#1c2e24] p-4 rounded-xl border border-[#2d4035] shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm font-medium text-white">
                                            {remainingForFreeShipping > 0 ? 'Free Shipping' : 'Free Shipping Unlocked! 🎉'}
                                        </p>
                                        <p className="text-xs text-[#9db8a8]">
                                            {remainingForFreeShipping > 0 ? `₹${remainingForFreeShipping.toFixed(0)} away` : 'Qualified'}
                                        </p>
                                    </div>
                                    <div className="w-full bg-[#29382f] rounded-full h-1.5 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercentage}%` }}
                                            className="bg-primary h-1.5 rounded-full"
                                        />
                                    </div>
                                </div>

                                {/* Product List */}
                                <ul className="flex flex-col gap-6">
                                    {items.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                                            <ShoppingBag className="w-16 h-16 mb-4 text-gray-400" />
                                            <p className="text-lg font-medium text-white">Your cart is empty</p>
                                            <button
                                                onClick={toggleCart}
                                                className="mt-4 text-primary font-bold hover:underline"
                                            >
                                                Start Shopping
                                            </button>
                                        </div>
                                    ) : (
                                        items.map((item) => (
                                            <li key={item.id} className="flex gap-4 group">
                                                <div className="shrink-0 relative overflow-hidden rounded-xl border border-[#2d4035] w-24 h-24 bg-[#1c2e24]">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col flex-1 justify-between py-0.5">
                                                    <div>
                                                        <div className="flex justify-between items-start">
                                                            <h3 className="text-base font-medium text-white line-clamp-2 pr-4">{item.name}</h3>
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                className="text-[#9db8a8] hover:text-red-400 transition-colors"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                        <p className="text-sm text-[#9db8a8] mt-1">{item.category}</p>
                                                    </div>
                                                    <div className="flex justify-between items-end mt-2">
                                                        <p className="text-base font-semibold text-white">₹{item.price.toFixed(2)}</p>
                                                        <div className="flex items-center bg-[#1c2e24] rounded-full border border-[#2d4035] p-1 h-8">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                                className="w-7 h-full flex items-center justify-center text-[#9db8a8] hover:text-white transition-colors"
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </button>
                                                            <span className="text-sm font-medium w-6 text-center text-white">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="w-7 h-full flex items-center justify-center text-primary hover:text-green-600 dark:hover:text-green-300 transition-colors"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>

                                {/* Recommendations */}
                                {items.length > 0 && (
                                    <div className="pt-6 border-t border-[#2d4035]">
                                        <h4 className="text-sm font-semibold text-white mb-4">You might also like</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {RECOMMENDATIONS.map((rec) => (
                                                <div key={rec.id} className="w-full bg-[#1c2e24] rounded-xl p-3 border border-[#2d4035] hover:border-primary/50 transition-colors cursor-pointer group/card">
                                                    <div className="aspect-square rounded-lg bg-[#2d4035] mb-2 overflow-hidden relative">
                                                        <Image
                                                            src={rec.image}
                                                            alt={rec.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <p className="text-xs font-medium text-white truncate">{rec.name}</p>
                                                    <div className="flex justify-between items-center mt-1">
                                                        <span className="text-xs text-[#9db8a8]">₹{rec.price}</span>
                                                        <button
                                                            onClick={() => addItem({ ...rec, category: 'Recommended' })} // Simple add
                                                            className="w-6 h-6 rounded-full bg-[#2d4035] flex items-center justify-center text-primary group-hover/card:bg-primary group-hover/card:text-[#112117] transition-all"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer / Checkout Section */}
                            {items.length > 0 && (
                                <div className="border-t border-[#2d4035] bg-[#1c2e24] px-6 py-6 pb-8">
                                    {/* Promo Code */}
                                    <div className="relative mb-6">
                                        <input
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            className="w-full h-12 pl-4 pr-12 rounded-xl bg-[#111814] border border-[#3c5345] text-white placeholder:text-[#9db8a8] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all"
                                            placeholder="Promo code"
                                            type="text"
                                        />
                                        <button className="absolute right-2 top-2 bottom-2 px-3 text-xs font-bold text-primary hover:bg-[#2d4035] rounded-lg transition-colors">
                                            APPLY
                                        </button>
                                    </div>

                                    {/* Subtotal Row */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between text-[#9db8a8] text-sm">
                                            <span>Subtotal</span>
                                            <span className="text-white font-medium">₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[#9db8a8] text-sm">
                                            <span>Shipping</span>
                                            <span className="text-white font-medium">Calculated at next step</span>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    {/* Checkout Button */}
                                    <Link href="/checkout" onClick={toggleCart} className="group w-full h-14 bg-[#30e87a] hover:bg-[#2bd970] active:scale-[0.98] rounded-full flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_0_20px_rgba(48,232,122,0.15)]">
                                        <span className="text-[#112117] font-bold text-base tracking-wide">Proceed to Checkout</span>
                                        <ArrowRight className="text-[#112117] group-hover:translate-x-1 transition-transform w-5 h-5" />
                                    </Link>

                                    <p className="text-center text-xs text-[#5c6e63] mt-4 flex items-center justify-center gap-1">
                                        <Lock className="w-3 h-3" />
                                        Secure Checkout
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
