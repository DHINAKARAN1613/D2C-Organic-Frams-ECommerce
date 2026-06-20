'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/imageUtils';
import {
    Star,
    Minus,
    Plus,
    ShoppingBag,
    ChevronRight,
    Leaf,
    Globe,
    Truck,
    ShieldCheck,
    PlayCircle,
    MapPin,
    TrendingUp,
    CheckCircle2,
    Store
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { WishlistButton } from '@/components/ui/WishlistButton';
import { ProductReviews } from '@/components/product/ProductReviews';

const IconMap = {
    public: Globe,
    eco: Leaf,
    local_shipping: Truck,
    verified: ShieldCheck
} as any;

export function ProductClient({ product, reviews, relatedProducts, isLoggedIn }: { product: any, reviews: any[], relatedProducts: any[], isLoggedIn: boolean }) {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('standard');
    const { addItem } = useCart();
    const { success } = useToast();

    // START: True AI Recommendations (Apriori Algorithm)
    const [frequentlyBought, setFrequentlyBought] = useState<any[]>([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!product?.id) return;
            try {
                const res = await fetch(`/api/recommendations?productId=${product.id}`);
                if (!res.ok) throw new Error('Failed to fetch recommendations');
                const data = await res.json();
                setFrequentlyBought(data.recommendations || []);
            } catch (error) {
                console.error("Failed to load recommendations:", error);
            } finally {
                setLoadingRecommendations(false);
            }
        };
        fetchRecommendations();
    }, [product?.id]);
    // END: True AI Recommendations

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark text-white pt-24">
                <Leaf className="w-16 h-16 text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                <Link href="/shop" className="text-primary hover:underline flex items-center gap-2">
                    Back to Shop
                </Link>
            </div>
        )
    }

    const currentPrice = selectedSize === 'double' ? Math.round(product.price * 2 * 0.9) : product.price; // 10% discount on double

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem({
                id: product.id,
                name: product.name,
                price: currentPrice, // Use adjusted price
                image: product.image,
                category: product.category
            })
        }
        success(`Added ${quantity} ${product.name} (${selectedSize} pack) to cart.`);
    };

    // Calculate average rating
    const avgRating = reviews.length > 0 ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length : 5.0;

    return (
        <div className="flex-grow w-full font-display bg-background min-h-screen text-foreground pt-24 pb-12 overflow-x-hidden">
            <main className="container mx-auto flex grow flex-col px-4 md:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-foreground font-medium">{product.name}</span>
                </nav>

                {/* Product Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-20">
                    {/* Left Column: Gallery */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                        <div className="relative w-full aspect-square md:aspect-[4/3] rounded-lg overflow-hidden bg-surface border border-border group">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Floating Badge */}
                            {product.badge && (
                                <div className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full ${product.badgeColor || 'bg-primary text-primary-foreground'}`}>
                                    {product.badge}
                                </div>
                            )}
                        </div>

                        {/* Thumbnails (Mocked using same image + effects for demo) */}
                        <div className="grid grid-cols-4 gap-3">
                            <button className="aspect-square rounded-2xl overflow-hidden border-2 border-primary ring-2 ring-primary/20 transition-all relative">
                                <Image src={product.image} alt="Thumbnail 1" fill className="object-cover" />
                            </button>
                            <button className="aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-border transition-all opacity-70 hover:opacity-100 relative">
                                <Image src={product.image} alt="Thumbnail 2" fill className="object-cover" />
                            </button>
                            <button className="aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-border transition-all opacity-70 hover:opacity-100 relative">
                                <Image src={product.image} alt="Thumbnail 3" fill className="object-cover" />
                            </button>
                            <button className="aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-border transition-all opacity-70 hover:opacity-100 flex items-center justify-center bg-surface">
                                <PlayCircle className="text-3xl opacity-50" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Product Info */}
                    <div className="lg:col-span-5 flex flex-col pt-2">
                        {/* Header Info */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight mb-2">{product.name}</h1>
                                <div className="flex items-center gap-2">
                                    <div className="flex text-primary">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-[18px] h-[18px] ${i < Math.round(avgRating) ? 'fill-current' : 'text-muted-foreground'}`} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">({avgRating.toFixed(1)}/5.0 from {reviews.length} reviews)</span>
                                </div>
                            </div>
                        </div>

                        {/* Price & Details */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl font-bold text-foreground">₹{currentPrice.toFixed(2)}</span>
                            {product.details && (
                                <span className="text-sm font-medium text-muted-foreground bg-white/5 px-2 py-1 rounded">
                                    {product.details}
                                </span>
                            )}
                            {!product.outOfStock ? (
                                <span className="bg-primary/20 text-primary text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wide">In Stock</span>
                            ) : (
                                <span className="bg-red-500/20 text-red-500 text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wide">Out of Stock</span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-base leading-relaxed text-muted-foreground mb-8 whitespace-pre-wrap">
                            {product.description}
                        </p>

                        {/* Seller Details Card */}
                        {product.farmer && (
                            <div className="bg-surface border border-border rounded-2xl p-5 mb-8 flex flex-col gap-4">
                                <h3 className="font-bold text-foreground flex items-center gap-2">
                                    <Store className="w-5 h-5 text-primary" />
                                    Seller Profile
                                </h3>
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative size-14 rounded-full overflow-hidden border border-border">
                                            <Image src={product.farmer.image} alt={product.farmer.name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <p className="font-bold text-lg text-foreground">{product.farmer.name}</p>
                                                {product.farmer.isVerified && (
                                                    <span title="Verified Farmer" className="flex items-center">
                                                        <CheckCircle2 className="w-4 h-4 text-primary fill-primary/20" />
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <MapPin className="w-3 h-3" /> {product.farmer.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
                                            <TrendingUp className="w-4 h-4" />
                                            <span className="font-bold text-sm">{product.farmer.successRate}% Success Rate</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1 text-right">Based on completed deliveries</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Options */}
                        <div className="space-y-6 mb-8 border-t border-b border-border py-6">
                            {/* Size Selector */}
                            <div>
                                <span className="block text-sm font-bold text-foreground mb-3">Select Size</span>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => setSelectedSize('standard')}
                                        className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all active:scale-95 ${selectedSize === 'standard' ? 'bg-foreground text-background' : 'border border-border text-foreground hover:border-primary hover:text-primary'}`}
                                    >
                                        {product.details || 'Standard Packet'}
                                    </button>
                                    <button
                                        onClick={() => setSelectedSize('double')}
                                        className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all active:scale-95 ${selectedSize === 'double' ? 'bg-foreground text-background' : 'border border-border text-foreground hover:border-primary hover:text-primary'}`}
                                    >
                                        Double Pack <span className="text-xs ml-1 text-primary font-bold">(-10%)</span>
                                    </button>
                                </div>
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center bg-surface rounded-full p-1 border border-border w-max">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="size-10 flex items-center justify-center rounded-full hover:bg-surface-highlight text-foreground transition-colors"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="w-10 text-center font-bold text-lg text-foreground">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="size-10 flex items-center justify-center rounded-full hover:bg-surface-highlight text-foreground transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-center">
                                    <WishlistButton productId={product.id} />
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.outOfStock}
                                    className={`flex-1 h-[50px] rounded-full font-bold text-base tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${product.outOfStock ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-primary hover:bg-[#25b560] text-primary-foreground shadow-[0_0_20px_rgba(48,232,122,0.3)] hover:shadow-[0_0_30px_rgba(48,232,122,0.5)]'}`}
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    {product.outOfStock ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>

                        {/* Attributes */}
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                            {product.attributes?.map((attr: any, idx: number) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="p-2 rounded-full bg-surface text-primary">
                                        {(() => {
                                            const Icon = IconMap[attr.icon] || Globe;
                                            return <Icon className="w-5 h-5" />;
                                        })()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground">{attr.label}</p>
                                        <p className="text-muted-foreground">{attr.value}</p>
                                    </div>
                                </div>
                            )) || (
                                <>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-full bg-surface text-primary"><Globe className="w-5 h-5" /></div>
                                        <div><p className="font-bold text-foreground">Origin</p><p className="text-muted-foreground">Local Sustainable Farm</p></div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-full bg-surface text-primary"><Leaf className="w-5 h-5" /></div>
                                        <div><p className="font-bold text-foreground">Certification</p><p className="text-muted-foreground">100% Organic</p></div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Recommendations */}
                {frequentlyBought.length > 0 && (
                    <section className="mt-12 bg-surface/50 p-6 md:p-8 rounded-2xl border border-border/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/20 text-primary rounded-lg">
                                <Leaf className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-foreground">Frequently Bought Together</h2>
                                <p className="text-sm text-muted-foreground mt-1">Customers who bought this item also bought</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {frequentlyBought.map((p) => (
                                <Link href={`/product/${p.id}`} key={p.id} className="flex gap-4 p-4 rounded-xl hover:bg-surface border border-transparent hover:border-border transition-all">
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-border/50 bg-background">
                                        <Image
                                            src={getImageUrl(p.images) || '/placeholder.png'}
                                            alt={p.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="font-bold text-foreground hover:text-primary transition-colors line-clamp-2">{p.name}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="font-bold text-foreground">₹{p.price.toFixed(2)}</span>
                                            {p.unit && <span className="text-xs text-muted-foreground bg-surface px-2 py-0.5 rounded-full">per {p.unit}</span>}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Customer Reviews Section */}
                <section className="mb-12">
                    <ProductReviews productId={product.id} reviews={reviews} isLoggedIn={isLoggedIn} />
                </section>

                {/* Related Products */}
                <section className="mt-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">You might also like</h2>
                        <Link href="/shop" className="text-primary font-medium hover:underline decoration-2 underline-offset-4 text-sm">View All</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((p) => (
                            <Link href={`/product/${p.id}`} key={p.id} className="group flex flex-col gap-3">
                                <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-surface border border-border">
                                    <Image
                                        src={p.image}
                                        alt={p.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-3 right-3 z-10">
                                        <WishlistButton productId={p.id} />
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
                                        <span className="bg-primary text-primary-foreground font-bold text-xs py-2 px-4 rounded-full uppercase tracking-wide">View Details</span>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">{p.name}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{p.description}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="font-bold text-foreground">₹{p.price}</span>
                                        {p.originalPrice && <span className="text-xs text-muted-foreground line-through">₹{p.originalPrice}</span>}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
