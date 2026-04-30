'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

export function WishlistButton({ productId }: { productId: string }) {
    const { items, toggleWishlist } = useWishlist();
    const isWishlisted = items.has(productId);

    return (
        <button
            onClick={(e) => {
                e.preventDefault(); // Prevent triggering parent link
                e.stopPropagation();
                toggleWishlist(productId);
            }}
            className={`p-2 rounded-full transition-all duration-300
                ${isWishlisted
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 rotate-0' // Added rotate for some flair? Maybe simple is better
                    : 'bg-black/30 text-white hover:bg-red-500 hover:text-white backdrop-blur-md'
                }`}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
            <Heart
                className={`w-5 h-5 transition-transform duration-300 ${isWishlisted ? 'fill-current scale-110' : 'scale-100'}`}
            />
        </button>
    );
}
