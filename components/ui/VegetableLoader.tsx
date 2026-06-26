'use client';

import { Carrot, Apple, Leaf, Banana } from 'lucide-react';
import { motion } from 'framer-motion';

export function VegetableLoader() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
            <div className="relative w-24 h-24">
                <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                    {/* Ring of Vegetables */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500">
                        <Carrot className="w-8 h-8 rotate-180" />
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-red-500">
                        <Apple className="w-8 h-8" />
                    </div>
                    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-green-500">
                        <Leaf className="w-8 h-8 -rotate-90" />
                    </div>
                    <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-yellow-400">
                        <Banana className="w-8 h-8 rotate-90" />
                    </div>
                </motion.div>

                {/* Center Logo/Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-md shadow-primary/50" />
                </div>
            </div>

            <div className="flex flex-col items-center gap-2">
                <p className="text-primary font-extrabold text-lg animate-pulse">Growing Goodness...</p>
                <p className="text-muted-foreground text-sm font-semibold">Harvesting fresh data for you.</p>
            </div>
        </div>
    );
}

export function VegetableLoaderPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background">
            <VegetableLoader />
        </div>
    );
}
