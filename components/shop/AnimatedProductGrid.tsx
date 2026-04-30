'use client';

import { motion, Variants } from 'framer-motion';
import { ProductCard } from '@/components/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/lib/data';

interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number | null;
    images: string;
    stock: number;
    category: { name: string };
    unit?: string | null;
}

interface AnimatedProductGridProps {
    products: Product[];
}

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } }
};

export function AnimatedProductGrid({ products }: AnimatedProductGridProps) {
    if (products.length === 0) {
        return <div className="text-center py-12 text-muted-foreground w-full col-span-full">No products found matching your filters.</div>;
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            {products.map((product) => {
                let imageUrl = '/placeholder.png';
                try {
                    const parsed = JSON.parse(product.images);
                    imageUrl = Array.isArray(parsed) ? parsed[0] : parsed;
                } catch (e) {
                    imageUrl = product.images || '/placeholder.png';
                }

                return (
                    <motion.div key={product.id} variants={item} layout>
                        <ProductCard
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            originalPrice={product.originalPrice}
                            image={imageUrl}
                            category={product.category.name}
                            stock={product.stock}
                            unit={product.unit || 'pcs'}
                        />
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
