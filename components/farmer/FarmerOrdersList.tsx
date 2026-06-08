"use client";

import { useState, useEffect } from 'react';
import { Package, MapPin, Calendar, Box } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageUtils';

import { useToast } from '@/context/ToastContext';
import { OrderStatusSelector } from '@/app/admin/orders/OrderStatusSelector';

export function FarmerOrdersList({ initialOrders, farmerId }: { initialOrders: any[], farmerId: string }) {
    const [orders, setOrders] = useState(initialOrders);
    const { success } = useToast();

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
        // Open-Source Real-Time Synchronization (Short Polling)
        const interval = setInterval(() => {
            fetchOrders();
        }, 3000); // Fetch every 3 seconds

        return () => clearInterval(interval);
    }, [farmerId, success]);

    if (orders.length === 0) {
        return (
            <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-12 text-center">
                <Box className="w-12 h-12 text-[#5c7a68] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
                <p className="text-[#9db8a8]">When customers buy your products, they will appear here.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            {orders.map((order) => {
                // Calculate farmer's earnings from this specific order
                const farmerTotal = order.items
                    .filter((item: any) => item.product?.farmerId === farmerId || item.farmerId === farmerId) // Defensive check
                    .reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
                
                return (
                    <div key={order.id} className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl overflow-hidden hover:border-[#30e87a]/50 transition-colors">
                        {/* Order Header */}
                        <div className="bg-[#112117]/50 p-4 md:p-6 border-b border-[#2d4035] flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-white">Order #{order.id.slice(-8)}</h3>
                                    <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
                                </div>
                                <p className="text-sm text-[#9db8a8] flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-sm text-[#9db8a8] uppercase tracking-wider font-semibold">Your Earnings</p>
                                <p className="text-2xl font-bold text-[#30e87a]">₹{farmerTotal.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Order Content */}
                        <div className="p-4 md:p-6 grid md:grid-cols-3 gap-6">
                            {/* Products List */}
                            <div className="md:col-span-2 space-y-4">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-[#30e87a]" />
                                    Products to Fulfill
                                </h4>
                                <div className="divide-y divide-[#2d4035]">
                                    {order.items
                                        .filter((item: any) => item.product?.farmerId === farmerId || item.farmerId === farmerId)
                                        .map((item: any) => (
                                        <div key={item.id} className="py-3 flex gap-4 first:pt-0 last:pb-0">
                                            <div className="h-16 w-16 bg-[#112117] rounded-lg relative overflow-hidden shrink-0 border border-[#2d4035]">
                                                {item.product?.images && getImageUrl(item.product.images) ? (
                                                    <Image
                                                        src={getImageUrl(item.product.images)!}
                                                        alt={item.product?.name || "Product"}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#9db8a8]">
                                                        <Package className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-bold text-white truncate">{item.product?.name || "Product"}</h5>
                                                <p className="text-sm text-[#9db8a8]">₹{item.price.toFixed(2)} × {item.quantity}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-bold text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#30e87a]" />
                                    Customer Details
                                </h4>
                                <div className="bg-[#112117] border border-[#2d4035] rounded-xl p-4 text-sm text-[#9db8a8] space-y-1">
                                    <p className="text-white font-bold">{order.shippingName}</p>
                                    <p className="truncate">{order.user?.email || 'Guest'}</p>
                                    <div className="pt-2 mt-2 border-t border-[#2d4035]">
                                        <p>{order.shippingStreet}</p>
                                        <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                                        <p className="mt-1 text-white">{order.shippingPhone}</p>
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
