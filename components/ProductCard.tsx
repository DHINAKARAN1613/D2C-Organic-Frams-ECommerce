'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from './ui/Button';
import { WishlistButton } from './ui/WishlistButton';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    originalPrice?: number | null;
    image: string;
    category: string;
    stock: number;
    unit?: string;
    farmerName?: string | null;
}

export function ProductCard({ id, name, price, originalPrice, image, category, stock, unit, farmerName }: ProductCardProps) {
    const { addItem, items, updateQuantity } = useCart();
    const [mounted, setMounted] = useState(false);
    const isOutOfStock = stock <= 0;

    useEffect(() => {
        setMounted(true);
    }, []);

    const cartItem = items.find(item => item.id === id);
    const quantity = (mounted && cartItem) ? cartItem.quantity : 0;

    return (
        <div
            suppressHydrationWarning
            className={`group flex flex-col rounded-3xl p-4 transition-all duration-300 border border-transparent hover:-translate-y-1
            bg-surface text-foreground border-border shadow-md shadow-black/5 dark:shadow-black/20 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10
            ${isOutOfStock ? 'opacity-75 grayscale' : ''}`}
        >
            {/* Image Section - Clean & Centered */}
            <div className={`relative aspect-square mb-4 rounded-2xl overflow-hidden transition-colors 
                bg-background/80 dark:bg-white/5 group-hover:bg-background dark:group-hover:bg-white/10`}>
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Wishlist Button */}
                <div className="absolute top-2 right-2 z-20">
                    <WishlistButton productId={id} />
                </div>

                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-background/60 dark:bg-black/60 z-10">
                        <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-foreground text-background shadow-lg">
                            Sold Out
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col gap-1 mb-4">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {category}
                    </span>
                </div>

                <div className="flex justify-between items-start gap-2 relative z-10">
                    <div className="flex flex-col">
                        <h3 className="font-bold text-base leading-tight line-clamp-2 product-text-force">
                            {name}
                        </h3>
                        {farmerName && <p className="text-[10px] text-primary mt-1 font-semibold uppercase tracking-wider">Sold by: {farmerName}</p>}
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                        <span className="font-extrabold text-lg product-text-force">
                            ₹{Math.floor(price)}
                        </span>
                        {originalPrice && originalPrice > price && (
                            <span className="text-xs text-muted-foreground line-through mt-[-2px]">
                                ₹{Math.floor(originalPrice)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Section - Full Width Button */}
            <div className="mt-auto">
                {quantity === 0 ? (
                    <Button
                        className={`w-full rounded-xl border-2 font-bold transition-all duration-300 h-11 ${isOutOfStock
                            ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(48,232,122,0.4)]'
                            }`}
                        onClick={(e) => {
                            e.preventDefault();
                            if (!isOutOfStock) addItem({ id, name, price, image, category });
                        }}
                        disabled={isOutOfStock}
                    >
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart +'}
                    </Button>
                ) : (
                    <div className="flex items-center justify-between w-full h-11 bg-green-500 rounded-xl px-1 shadow-lg animate-in fade-in zoom-in duration-200 shadow-green-200/50 dark:shadow-green-900/20">
                        <button
                            className="w-10 h-full flex items-center justify-center text-white hover:bg-green-600 rounded-l-lg transition-colors"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateQuantity(id, quantity - 1);
                            }}
                        >
                            <span className="text-xl font-bold leading-none mb-1">-</span>
                        </button>
                        <div className="flex flex-col items-center justify-center leading-none text-white">
                            <span className="font-bold text-lg">{quantity}</span>
                            <span className="text-base font-bold mt-0.5">₹{Math.floor(price * quantity)}</span>
                        </div>
                        <button
                            className="w-10 h-full flex items-center justify-center text-white hover:bg-green-600 rounded-r-lg transition-colors"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addItem({ id, name, price, image, category });
                            }}
                        >
                            <span className="text-xl font-bold leading-none mb-1">+</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
