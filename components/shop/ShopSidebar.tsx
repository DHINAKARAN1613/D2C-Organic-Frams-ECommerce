'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useState, useEffect, Suspense } from 'react';
import { useTheme } from 'next-themes';

const CATEGORIES = [
    { name: 'All Products', slug: 'all' },
    { name: 'Vegetables', slug: 'vegetables' },
    { name: 'Fruits', slug: 'fruits' },
    { name: 'Organic Soaps', slug: 'organic-soaps' },
    { name: 'Essentials', slug: 'essentials' },
];

function ShopSidebarContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Initialize state from URL
    const [minPrice, setMinPrice] = useState(searchParams.get('min') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || '');
    // We don't need local state for inStock if we trigger immediately, 
    // but useful for controlled input visual.
    const inStockOnly = searchParams.get('stock') === 'true';

    const currentCategory = searchParams.get('category') || 'all';

    // Prevent hydration mismatch & Sync URL params
    useEffect(() => {
        setMounted(true);
        setMinPrice(searchParams.get('min') || '');
        setMaxPrice(searchParams.get('max') || '');
    }, [searchParams]);

    const isDark = mounted && resolvedTheme === 'dark';

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        router.push(`/shop?${params.toString()}`, { scroll: false });
    };

    const handleApplyPrice = () => {
        updateParams({
            min: minPrice,
            max: maxPrice
        });
    };

    const handleCategoryClick = (slug: string) => {
        updateParams({
            category: slug === 'all' ? null : slug
        });
    };

    const handleStockChange = (checked: boolean) => {
        updateParams({
            stock: checked ? 'true' : null
        });
    };

    const hasFilters = currentCategory !== 'all' || minPrice || maxPrice || inStockOnly;

    const clearFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        router.push('/shop');
    };

    return (
        <div className="w-full lg:w-64 space-y-8">
            {/* Header */}
            <div>
                <h2 className="font-bold text-xl text-foreground">Filters</h2>
            </div>

            {/* Categories */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-foreground">Categories</h3>
                <div className="flex flex-col space-y-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.slug}
                            onClick={() => handleCategoryClick(cat.slug)}
                            className={`text-left px-3 py-2 rounded-lg transition-all duration-200 ${(currentCategory === cat.slug)
                                ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                                : 'text-muted-foreground hover:bg-surface-highlight hover:text-foreground font-medium'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-foreground">Price Range</h3>
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-24 h-10 rounded-md border text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-colors
                            bg-surface text-foreground border-border placeholder:text-muted-foreground"
                    />
                    <span className="text-muted-foreground font-bold">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-24 h-10 rounded-md border text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-colors
                            bg-surface text-foreground border-border placeholder:text-muted-foreground"
                    />
                </div>
                <Button
                    onClick={handleApplyPrice}
                    variant="outline"
                    size="sm"
                    className="w-full font-semibold border-2 transition-all border-border text-muted-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground bg-transparent"
                >
                    Apply Price
                </Button>
            </div>

            {/* Stock Filter */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-foreground">Availability</h3>
                <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={(e) => handleStockChange(e.target.checked)}
                            className="peer h-5 w-5 rounded border-gray-600 text-primary focus:ring-primary transition-all cursor-pointer accent-primary bg-surface"
                        />
                    </div>
                    <span className="font-medium transition-colors text-muted-foreground group-hover:text-foreground">
                        In Stock Only
                    </span>
                </label>
            </div>

            {/* Clear Filters - Moved Bottom */}
            {hasFilters && (
                <button
                    onClick={clearFilters}
                    className="w-full py-2 text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                >
                    Clear All Filters
                </button>
            )}
        </div>
    );
}

export function ShopSidebar() {
    return (
        <Suspense fallback={<div className="w-full lg:w-64 animate-pulse h-96 bg-gray-100 dark:bg-zinc-800 rounded-xl" />}>
            <ShopSidebarContent />
        </Suspense>
    );
}
