'use client';

import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number | null;
    images: string;
    stock: number;
    unit: string;
    category: { name: string };
}

export default function WishlistPage() {
    const { items } = useWishlist();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // We need to fetch the full product details for the IDs in the wishlist
        // Since the Context only has IDs, we should probably have an endpoint that returns the full wishlist objects
        // Context fetches `/api/wishlist` which returns `{ product: ... }`.
        // Wait, Context `fetchWishlist` only set `items` (Set<string>).
        // I should probably fetch the full list here.
        fetchFullWishlist();
    }, [items]); // Re-fetch if items change (e.g. removed via button)

    const fetchFullWishlist = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/wishlist');
            if (res.ok) {
                const data = await res.json();
                // data is Array of { product: Product, ... }
                setProducts(data.map((item: any) => item.product));
            }
        } catch (error) {
            console.error("Failed to load wishlist products", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-12 text-center text-[#9db8a8]">Loading your favorites...</div>;
    }

    if (products.length === 0) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <div className="w-20 h-20 bg-[#1c2e24] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-[#9db8a8] opacity-50" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Your wishlist is empty</h1>
                <p className="text-[#9db8a8] mb-8">Save items you love to find them easily later.</p>
                <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-[#30e87a] text-[#112117] font-bold rounded-full hover:bg-[#30e87a]/90 transition-colors">
                    <ShoppingBag className="w-5 h-5" />
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                My Wishlist
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        originalPrice={product.originalPrice}
                        image={(() => {
                            try {
                                return JSON.parse(product.images)[0];
                            } catch {
                                return product.images;
                            }
                        })()}
                        category={product.category?.name || 'Organic'} // API might return nested category
                        stock={product.stock}
                        unit={product.unit}
                    />
                ))}
            </div>
        </div>
    );
}
