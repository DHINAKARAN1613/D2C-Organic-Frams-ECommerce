'use client';

import image from 'next/image';
import { useCart } from '@/context/CartContext';
import { CartItem } from '../cart/CartItem';

export function OrderSummary() {
    const { items, subtotal } = useCart();

    return (
        <div className="bg-card rounded-lg border p-6 space-y-6">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                ))}
            </div>

            <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>₹ {subtotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
