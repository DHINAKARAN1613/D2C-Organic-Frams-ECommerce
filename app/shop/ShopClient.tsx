'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Leaf,
    SlidersHorizontal,
    ChevronDown,
    Star,
    Check,
    Plus,
    Minus,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { ShopFilters } from './ShopFilters';
import { WishlistButton } from '@/components/ui/WishlistButton';
// Removed static CATEGORIES import





// Imports removed from here

// ... (existing imports)

export function ShopClient({ initialProducts, categories }: { initialProducts: any[], categories: string[] }) {
    const { addItem, items } = useCart();
    const { success } = useToast();
    const [priceRange, setPriceRange] = useState(2500);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [visibleCount, setVisibleCount] = useState(8);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState("recommended");
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Prevent body scroll when filter drawer is open
    useEffect(() => {
        if (isFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isFilterOpen]);

    const filteredProducts = useMemo(() => {
        return initialProducts.filter(product => {
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
            const matchesPrice = product.price <= priceRange;
            const matchesStock = !inStockOnly || !product.outOfStock;
            return matchesCategory && matchesPrice && matchesStock;
        }).sort((a, b) => {
            switch (sortBy) {
                case "price-low-high":
                    return a.price - b.price;
                case "price-high-low":
                    return b.price - a.price;
                case "rating-high-low":
                    return b.rating - a.rating;
                default:
                    return 0; // Recommended (original order)
            }
        });
    }, [initialProducts, selectedCategory, priceRange, inStockOnly, sortBy]);

    const visibleProducts = filteredProducts.slice(0, visibleCount);

    const handleQuantityChange = (id: string, delta: number) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + delta)
        }));
    };

    const handleAddToCart = (product: any) => {
        const qty = quantities[product.id] || 1;
        for (let i = 0; i < qty; i++) {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category
            });
        }
        // Reset quantity after adding
        setQuantities(prev => ({ ...prev, [product.id]: 1 }));
        success(`Added ${qty} ${product.name} to cart`);
    };

    const getCartCount = (id: string) => {
        const item = items.find(i => i.id === id);
        return item ? item.quantity : 0;
    };

    const handleReset = () => {
        setPriceRange(2500);
        setInStockOnly(false);
        setSelectedCategory("All");
    };

    return (
        <div className="flex flex-1 w-full px-4 lg:px-8 pt-28 pb-8 gap-8 font-display bg-background min-h-screen text-foreground transition-colors duration-300">
            {/* Sticky Sidebar (Filters) */}
            <aside className="hidden lg:block w-72 shrink-0 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
                <ShopFilters
                    categories={categories}
                    inStockOnly={inStockOnly}
                    onReset={handleReset}
                    priceRange={priceRange}
                    selectedCategory={selectedCategory}
                    setInStockOnly={setInStockOnly}
                    setPriceRange={setPriceRange}
                    setSelectedCategory={setSelectedCategory}
                />
            </aside>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {isFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFilterOpen(false)}
                            className="fixed inset-0 bg-black/80 z-[60] lg:hidden backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full sm:w-[400px] z-[70] bg-[#112117] border-l border-[#2d4035] p-6 overflow-y-auto lg:hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold">Filters</h2>
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <ShopFilters
                                categories={categories}
                                inStockOnly={inStockOnly}
                                onReset={handleReset}
                                priceRange={priceRange}
                                selectedCategory={selectedCategory}
                                setInStockOnly={setInStockOnly}
                                setPriceRange={setPriceRange}
                                setSelectedCategory={setSelectedCategory}
                            />
                            <div className="mt-8 pt-4 border-t border-[#2d4035]">
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="w-full py-3 bg-[#30e87a] text-[#111814] font-bold rounded-xl hover:bg-[#25c465] transition-colors shadow-lg shadow-[#30e87a]/20"
                                >
                                    Show {filteredProducts.length} Products
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex flex-col flex-1 min-w-0">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 text-sm mb-6">
                    <Link href="/" className="text-secondary-text hover:text-white transition-colors">Home</Link>
                    <span className="text-secondary-text">/</span>
                    <Link href="/shop" className="text-secondary-text hover:text-white transition-colors">Shop</Link>
                    <span className="text-secondary-text">/</span>
                    <span className="text-white font-medium">{selectedCategory}</span>
                </div>

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">Shop Essentials</h1>
                        <p className="text-secondary-text text-lg max-w-xl">Pure, organic, and ethically sourced products for your home and health.</p>
                    </div>
                    {/* Mobile Filter Trigger */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="lg:hidden flex items-center gap-2 bg-[#2d4035] text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform"
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        Filters
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2d4035]">
                    <p className="text-secondary-text text-sm">Showing <span className="text-white font-bold">{visibleProducts.length}</span> of <span className="text-white font-bold">{filteredProducts.length}</span> products</p>
                    <div className="flex items-center gap-2 relative">
                        <span className="text-sm text-secondary-text hidden sm:inline">Sort by:</span>
                        <div className="relative">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center gap-2 text-sm font-bold text-white bg-[#1c2e24] px-3 py-1.5 rounded-lg border border-[#2d4035] hover:border-primary transition-colors"
                            >
                                {sortBy === "recommended" && "Recommended"}
                                {sortBy === "price-low-high" && "Price: Low to High"}
                                {sortBy === "price-high-low" && "Price: High to Low"}
                                {sortBy === "rating-high-low" && "Top Rated"}
                                <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isSortOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-[#1c2e24] border border-[#2d4035] rounded-xl shadow-xl z-50 overflow-hidden"
                                    >
                                        {[
                                            { label: "Recommended", value: "recommended" },
                                            { label: "Price: Low to High", value: "price-low-high" },
                                            { label: "Price: High to Low", value: "price-high-low" },
                                            { label: "Top Rated", value: "rating-high-low" },
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setSortBy(option.value);
                                                    setIsSortOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${sortBy === option.value
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'text-secondary-text hover:bg-white/5 hover:text-white'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Leaf className="w-16 h-16 text-primary mb-4" />
                        <h3 className="text-xl font-bold">No products found</h3>
                        <p className="text-secondary-text">Try adjusting your filters.</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-6"
                    >
                        <AnimatePresence>
                            {visibleProducts.map((product) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={product.id}
                                    className="group flex flex-col bg-surface border border-border shadow-md shadow-black/5 dark:shadow-black/20 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:bg-surface-highlight rounded-3xl p-3 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <Link href={`/product/${product.id}`} className="relative w-full aspect-square rounded-xl overflow-hidden bg-white/5 mb-4 block">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {product.badge && (
                                            <div className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${product.badgeColor} shadow-md`}>
                                                {product.badge}
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <WishlistButton productId={product.id} />
                                        </div>
                                    </Link>

                                    <div className="flex flex-col flex-1 gap-1">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col">
                                                <Link href={`/product/${product.id}`} className="text-foreground font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">{product.name}</Link>
                                                {product.farmerName && <span className="text-xs text-primary mt-0.5">Sold by: {product.farmerName}</span>}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-[#ffd700]">
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                {product.rating}
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground text-sm mb-3">{product.description}</p>

                                        <div className="mt-auto flex flex-col gap-3">
                                            <div className="flex justify-between items-end">
                                                <div className="flex flex-col leading-none">
                                                    {product.originalPrice && <p className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</p>}
                                                    <p className={`text-xl font-bold ${product.originalPrice ? 'text-rose-500' : 'text-foreground'}`}>₹{product.price}</p>
                                                </div>
                                                {getCartCount(product.id) > 0 && (
                                                    <div className="text-xs text-primary font-medium flex items-center gap-1">
                                                        <Check className="w-3 h-3" /> In Cart ({getCartCount(product.id)})
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {!product.outOfStock ? (
                                                    <>
                                                        <div className="flex items-center rounded-full bg-background border border-border">
                                                            <button
                                                                onClick={() => handleQuantityChange(product.id, -1)}
                                                                className="w-8 h-8 flex items-center justify-center text-sm hover:text-primary transition-colors"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="w-6 text-center text-sm font-bold">{quantities[product.id] || 1}</span>
                                                            <button
                                                                onClick={() => handleQuantityChange(product.id, 1)}
                                                                className="w-8 h-8 flex items-center justify-center text-sm hover:text-primary transition-colors"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => handleAddToCart(product)}
                                                            className="flex-1 flex items-center justify-center h-9 rounded-full bg-gradient-to-r from-[#30e87a] to-[#25b060] bg-[length:200%_100%] text-white font-bold text-sm transition-all duration-300 shadow-[0_4px_14px_0_rgba(48,232,122,0.39)] hover:bg-[100%_0] hover:shadow-[0_6px_25px_rgba(48,232,122,0.4)] hover:-translate-y-1 active:scale-95 active:translate-y-0"
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="w-full h-9 rounded-full bg-[#2d4035] text-white/50 font-bold text-sm cursor-not-allowed"
                                                    >
                                                        Out of Stock
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Pagination Controls */}
                {(visibleCount < filteredProducts.length || visibleCount > 8) && (
                    <div className="mt-12 flex justify-center gap-4">
                        {visibleCount < filteredProducts.length && (
                            <button
                                onClick={() => setVisibleCount(prev => prev + 6)}
                                className="px-8 py-3 bg-primary text-primary-foreground font-extrabold rounded-full transition-all hover:opacity-90 shadow-md text-sm"
                            >
                                Load More Products
                            </button>
                        )}

                        {visibleCount > 8 && (
                            <button
                                onClick={() => setVisibleCount(8)}
                                className="px-8 py-3 border border-border bg-surface text-foreground hover:bg-muted font-bold rounded-full transition-all shadow-sm text-sm"
                            >
                                Show Less
                            </button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
