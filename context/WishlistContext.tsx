'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from './ToastContext';

interface WishlistContextType {
    items: Set<string>; // Set of Product IDs
    toggleWishlist: (productId: string) => Promise<void>;
    loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [items, setItems] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const { success, error } = useToast();

    // Fetch initial wishlist
    useEffect(() => {
        if (session?.user) {
            fetchWishlist();
        } else {
            setItems(new Set());
        }
    }, [session]);

    const fetchWishlist = async () => {
        try {
            const res = await fetch('/api/wishlist');
            if (res.ok) {
                const data = await res.json();
                const ids = new Set(data.map((item: any) => item.productId));
                setItems(ids as Set<string>);
            }
        } catch (err) {
            console.error("Failed to fetch wishlist", err);
        }
    };

    const toggleWishlist = async (productId: string) => {
        if (!session?.user) {
            error("Please sign in to use your wishlist");
            return;
        }

        // Optimistic update
        const isAdded = items.has(productId);
        const newSet = new Set(items);
        if (isAdded) {
            newSet.delete(productId);
        } else {
            newSet.add(productId);
        }
        setItems(newSet);

        try {
            const res = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            });

            if (!res.ok) {
                throw new Error('Failed to update');
            }

            const data = await res.json();
            if (data.added) {
                success("Added to wishlist");
            } else {
                success("Removed from wishlist");
            }
        } catch (err) {
            // Revert on error
            setItems(items); // Reset to previous state
            error("Something went wrong");
        }
    };

    return (
        <WishlistContext.Provider value={{ items, toggleWishlist, loading }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
