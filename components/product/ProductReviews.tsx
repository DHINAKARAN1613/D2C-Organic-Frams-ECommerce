'use client';

import { useState } from 'react';
import { Star, Loader2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string | Date;
    user: {
        name: string | null;
        image: string | null;
    };
}

interface ProductReviewsProps {
    productId: string;
    reviews: Review[];
    isLoggedIn: boolean;
}

export function ProductReviews({ productId, reviews: initialReviews, isLoggedIn }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { success, error } = useToast();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoggedIn) {
            router.push('/auth/signin');
            return;
        }

        if (rating === 0) {
            error('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/products/${productId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, comment }),
            });

            const data = await res.text();

            if (!res.ok) {
                throw new Error(data || 'Failed to submit review');
            }

            const newReview = JSON.parse(data);
            setReviews([newReview, ...reviews]);
            setRating(0);
            setComment('');
            success('Review submitted successfully!');
        } catch (err: any) {
            error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-8">Customer Reviews</h2>

            {/* Review Form */}
            <div className="bg-surface/50 border border-border rounded-2xl p-6 md:p-8 mb-8">
                <h3 className="text-lg font-bold text-foreground mb-4">Write a Review</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-8 h-8 ${
                                            star <= (hoverRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                                                : 'text-muted-foreground'
                                        } transition-all`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2">Comment (Optional)</label>
                        <textarea
                            id="comment"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full bg-background border border-border rounded-xl p-4 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                            placeholder="Share your experience with this product..."
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl hover:bg-[#25c465] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Review'}
                    </button>
                </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-background border border-border rounded-2xl">
                        <Star className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-foreground font-medium">No reviews yet.</p>
                        <p className="text-muted-foreground text-sm">Be the first to review this product!</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-background border border-border rounded-2xl p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center overflow-hidden shrink-0">
                                            {review.user?.image ? (
                                                <img src={review.user.image} alt={review.user.name || 'User'} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-5 h-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">{review.user?.name || 'Anonymous User'}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-border'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="text-foreground leading-relaxed">
                                        {review.comment}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
