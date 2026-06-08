"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Star, MessageSquare, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { getImageUrl } from '@/lib/imageUtils';

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: { name: string | null; image: string | null };
}

export function ProductReviews({ productId }: { productId: string }) {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    
    const [rating, setRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/products/${productId}/reviews`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data.reviews);
                setAverageRating(data.averageRating);
                setTotalReviews(data.totalReviews);
            }
        } catch (err) {
            console.error("Failed to fetch reviews");
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            setError("You must be logged in to leave a review.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch(`/api/products/${productId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, comment })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to submit review");
            } else {
                setSuccess(true);
                setComment('');
                setRating(5);
                fetchReviews(); // Refresh the list
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 mt-12 pt-12 border-t border-[#2d4035]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Customer Reviews</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star} 
                                    className={`w-6 h-6 ${star <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-[#2d4035]'}`} 
                                />
                            ))}
                        </div>
                        <p className="text-[#9db8a8] font-medium">
                            <span className="text-white text-lg font-bold mr-1">{averageRating.toFixed(1)}</span>
                            out of 5 ({totalReviews} reviews)
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Leave a Review Form */}
                <div className="lg:col-span-1 bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-6 h-fit">
                    <h3 className="text-xl font-bold text-white mb-4">Write a Review</h3>
                    
                    {success ? (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-green-500 font-bold text-sm">Review Submitted!</h4>
                                <p className="text-[#9db8a8] text-xs mt-1">Thank you for your feedback.</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#9db8a8] mb-2">Rating</label>
                                <div className="flex items-center gap-1 cursor-pointer">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            className={`w-8 h-8 transition-colors ${
                                                star <= (hoveredRating || rating) 
                                                    ? 'text-yellow-400 fill-yellow-400' 
                                                    : 'text-[#2d4035]'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-[#9db8a8] mb-2">Comment (Optional)</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                    placeholder="What did you like about this product?"
                                    className="w-full bg-[#112117] border border-[#2d4035] rounded-xl p-3 text-white placeholder-[#5c7a68] focus:outline-none focus:border-[#30e87a] resize-none"
                                />
                            </div>

                            {error && (
                                <div className="flex items-start gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting || !session}
                                className="w-full bg-[#30e87a] text-[#112117] font-bold rounded-xl py-3 hover:bg-[#25c464] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Submitting...' : session ? 'Submit Review' : 'Log in to Review'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-4">
                    {reviews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center p-12 bg-[#1c2e24] border border-[#2d4035] rounded-2xl border-dashed">
                            <MessageSquare className="w-12 h-12 text-[#5c7a68] mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No reviews yet</h3>
                            <p className="text-[#9db8a8] max-w-sm">Be the first to share your thoughts on this product! Only customers who have purchased this item can leave a review.</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-[#112117] border border-[#2d4035] flex items-center justify-center overflow-hidden shrink-0">
                                            {getImageUrl(review.user.image) ? (
                                                <img src={getImageUrl(review.user.image)!} alt="User" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-5 h-5 text-[#9db8a8]" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{review.user.name || 'Anonymous'}</p>
                                            <p className="text-xs text-[#5c7a68]">
                                                {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star 
                                                key={star} 
                                                className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-[#2d4035]'}`} 
                                            />
                                        ))}
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="text-[#9db8a8] text-sm leading-relaxed">{review.comment}</p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
