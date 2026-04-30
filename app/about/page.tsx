import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Sprout, Leaf, Heart, Sun } from 'lucide-react';

export const metadata = {
    title: 'Our Story | Yogam Farms',
    description: 'Learn about the journey of Yogam Farms and our commitment to organic, sustainable agriculture.',
};

export default function AboutPage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-green-900/20 z-10" />
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2940&auto=format&fit=crop"
                        alt="Farm Landscape"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="container relative z-20 text-center px-4 pt-20">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg tracking-tight">
                        Cultivating <span className="text-green-400">Wellness</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md">
                        From our soil to your soul. The journey of Yogam Farms began with a simple seed of thought: eating real food shouldn't be a luxury.
                    </p>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-20 container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-card p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-shadow text-center group">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">100% Organic</h3>
                        <p className="text-muted-foreground">
                            No synthetic pesticides or GMOs. Just pure, unadulterated nature working its magic on our crops.
                        </p>
                    </div>
                    <div className="bg-card p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-shadow text-center group">
                        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <Sun className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Sustainable Farming</h3>
                        <p className="text-muted-foreground">
                            We use regenerative practices that enrich the soil, conserve water, and support local biodiversity.
                        </p>
                    </div>
                    <div className="bg-card p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-shadow text-center group">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Community First</h3>
                        <p className="text-muted-foreground">
                            We're more than a farm; we're a family. We support fair wages and local food security initiatives.
                        </p>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-secondary/30">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider">
                                <Sprout className="h-4 w-4" /> The Beginning
                            </div>
                            <h2 className="text-4xl font-bold text-foreground">
                                Returning to Our Roots
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Yogam Farms started 5 years ago when we realized that the "fresh" produce in markets was anything but. It was traveled miles, lost nutrients, and was coated in wax.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                We decided to reclaim the connection between the farmer and the table. What started as a small patch of spinach has grown into a diverse ecosystem of fruits, vegetables, and ethically sourced essentials.
                            </p>
                            <div className="pt-4">
                                <Link href="/shop">
                                    <Button size="lg" className="rounded-full px-8">
                                        Taste the Difference
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1 relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2940&auto=format&fit=crop"
                                alt="Farmer holding harvest"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Team/CTA Section */}
            <section className="py-24 container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to eat better?</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
                    Join thousands of families who have switched to Yogam Farms for their weekly produce. Fresh, organic, and delivered to your door.
                </p>
                <Link href="/shop">
                    <Button size="lg" className="rounded-full text-lg px-10 py-6 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                        Start Shopping Now
                    </Button>
                </Link>
            </section>
        </div>
    );
}
