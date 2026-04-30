'use client';

import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart, CartItem as CartItemType } from '@/context/CartContext';

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCart();

    return (
        <div className="flex gap-4 py-4 border-b">
            <div className="relative h-20 w-20 rounded-lg overflow-hidden border bg-muted shrink-0">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="flex flex-col flex-1 justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                    <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2 border rounded-full px-2 py-1 bg-muted/50">
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-primary transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                        >
                            <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-primary transition-colors"
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>
                    <p className="font-bold text-sm">₹ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}
