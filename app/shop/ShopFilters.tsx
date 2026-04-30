'use client';

import React from 'react';

interface ShopFiltersProps {
    priceRange: number;
    setPriceRange: (value: number) => void;
    inStockOnly: boolean;
    setInStockOnly: (value: boolean) => void;
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    categories: string[];
    onReset: () => void;
}

export function ShopFilters({
    priceRange,
    setPriceRange,
    inStockOnly,
    setInStockOnly,
    selectedCategory,
    setSelectedCategory,
    categories,
    onReset
}: ShopFiltersProps) {
    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                    onClick={onReset}
                    className="text-xs font-medium text-primary hover:underline"
                >
                    Reset All
                </button>
            </div>
            {/* Categories */}
            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-secondary-text uppercase tracking-wider">Categories</h3>
                <div className="flex flex-col gap-3">
                    {categories.map((cat) => (
                        <label key={cat} className="group flex items-center gap-3 cursor-pointer">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name="category"
                                    checked={selectedCategory === cat}
                                    onChange={() => setSelectedCategory(cat)}
                                    className="peer sr-only"
                                />
                                <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${selectedCategory === cat
                                    ? 'border-[#30e87a] shadow-[0_0_10px_rgba(48,232,122,0.3)]'
                                    : 'border-[#3c5345] group-hover:border-[#4d6a59]'
                                    }`}></div>
                                <div className={`absolute w-2.5 h-2.5 rounded-full bg-[#30e87a] transition-all duration-300 ${selectedCategory === cat ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                                    }`}></div>
                            </div>
                            <span className={`transition-colors duration-300 ${selectedCategory === cat ? 'text-white font-bold' : 'text-secondary-text group-hover:text-white'
                                }`}>{cat}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="h-px bg-[#2d4035] w-full"></div>
            {/* Price Range */}
            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-secondary-text uppercase tracking-wider">Price Range</h3>
                <div className="flex items-center justify-between text-sm text-white mb-2">
                    <span>₹0</span>
                    <span>₹2500</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="2500"
                    step="50"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-2 bg-[#2d4035] rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex gap-3 mt-2">
                    <div className="bg-[#2d4035] rounded-lg px-3 py-2 flex-1 text-center text-sm">Min: ₹0</div>
                    <div className="bg-[#2d4035] rounded-lg px-3 py-2 flex-1 text-center text-sm">Max: ₹{priceRange}</div>
                </div>
            </div>
            <div className="h-px bg-[#2d4035] w-full"></div>
            {/* Availability */}
            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-secondary-text uppercase tracking-wider">Availability</h3>
                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-white group-hover:text-primary transition-colors">In Stock Only</span>
                    <div className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={inStockOnly}
                            onChange={(e) => setInStockOnly(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-[#2d4035] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                </label>
            </div>
        </div>
    );
}
