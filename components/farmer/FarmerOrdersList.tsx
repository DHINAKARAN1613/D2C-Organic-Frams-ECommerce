"use client";

import { useState, useEffect } from 'react';
import { Package, MapPin, Calendar, Box } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageUtils';

import { useToast } from '@/context/ToastContext';
import { OrderStatusSelector } from '@/app/admin/orders/OrderStatusSelector';
import { useLanguage } from '@/context/LanguageContext';

export function FarmerOrdersList({ initialOrders, farmerId }: { initialOrders: any[], farmerId: string }) {
    const [orders, setOrders] = useState(initialOrders);
    const { success } = useToast();
    const { t } = useLanguage();

    const fetchOrders = async () => {
        try {
            const response = await fetch(`/api/farmer/orders?farmerId=${farmerId}`);
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchOrders();
        }, 10000);

        return () => clearInterval(interval);
    }, [farmerId, success]);

    if (orders.length === 0) {
        return (
            <div className="bg-surface border border-border rounded-2xl p-12 text-center shadow-md">
                <Box className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">{t.noOrdersYet}</h3>
                <p className="text-muted-foreground font-medium">{t.ordersAppearHere}</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            {orders.map((order) => {
                const farmerTotal = order.items
                    .filter((item: any) => item.product?.farmerId === farmerId || item.farmerId === farmerId)
                    .reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
                
                return (
                    <div key={order.id} className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors shadow-md">
                        <div className="bg-muted/50 p-4 md:p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-foreground">{t.orderNumber}{order.id.slice(-8)}</h3>
                                    <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
                                </div>
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-sm text-muted-foreground uppercase tracking-wider font-extrabold">{t.yourEarnings}</p>
                                <p className="text-2xl font-bold text-primary">₹{farmerTotal.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="p-4 md:p-6 grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-4">
                                <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-primary" />
                                    {t.productsToFulfill}
                                </h4>
                                <div className="divide-y divide-border">
                                    {order.items
                                        .filter((item: any) => item.product?.farmerId === farmerId || item.farmerId === farmerId)
                                        .map((item: any) => (
                                        <div key={item.id} className="py-3 flex gap-4 first:pt-0 last:pb-0">
                                            <div className="h-16 w-16 bg-muted rounded-lg relative overflow-hidden shrink-0 border border-border shadow-sm">
                                                {item.product?.images && getImageUrl(item.product.images) ? (
                                                    <Image
                                                        src={getImageUrl(item.product.images)!}
                                                        alt={item.product?.name || "Product"}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                        <Package className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-bold text-foreground truncate">{item.product?.name || "Product"}</h5>
                                                <p className="text-sm font-medium text-muted-foreground">₹{item.price.toFixed(2)} × {item.quantity}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-bold text-foreground">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    {t.customerDetails}
                                </h4>
                                <div className="bg-muted border border-border rounded-xl p-4 text-sm font-medium text-muted-foreground space-y-1 shadow-inner">
                                    <p className="text-foreground font-bold">{order.shippingName}</p>
                                    <p className="truncate">{order.user?.email || 'Guest'}</p>
                                    <div className="pt-2 mt-2 border-t border-border">
                                        <p>{order.shippingStreet}</p>
                                        <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                                        <p className="mt-1 font-bold text-foreground">{order.shippingPhone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
