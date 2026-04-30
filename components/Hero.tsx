'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { ArrowRight, Leaf } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-background py-20 md:py-32">
            {/* Background Blobs (Decoration) */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                        <Leaf className="h-4 w-4" />
                        100% Organic & Fresh
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                        Harvesting <br />
                        <span className="text-primary">Nature's Best</span> <br />
                        For You.
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-lg">
                        Experience the true taste of nature with our certified organic produce.
                        Delivered fresh from our sustainable farms to your doorstep within 24 hours.
                    </p>
                    <div className="flex gap-4 pt-4">
                        <Button size="lg" className="rounded-full shadow-lg shadow-primary/20" href="/shop">
                            Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-full" href="/about">
                            Our Story
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative h-[400px] md:h-[600px] bg-secondary/10 rounded-3xl overflow-hidden flex items-center justify-center p-8 border border-secondary/20"
                >
                    {/* Placeholder for Hero Image */}
                    <div className="text-center">
                        <span className="text-9xl filter drop-shadow-2xl animate-pulse">🧺</span>
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute top-10 right-10 text-6xl"
                        >
                            🍓
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            className="absolute bottom-20 left-10 text-7xl"
                        >
                            🥦
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
