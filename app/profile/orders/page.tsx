'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Package, Clock, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Order {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    items: any[];
}

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch('/api/orders/history');
                if (res.status === 401) {
                    router.push('/api/auth/signin');
                    return;
                }
                if (!res.ok) throw new Error('Failed to fetch orders');
                const data = await res.json();
                setOrders(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, [router]);

    if (loading) {
        return <div className="p-8 text-center text-gray-400 font-medium">Loading your orders...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center space-y-4">
                <Package className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                <h1 className="text-2xl font-bold">No orders yet</h1>
                <p className="text-muted-foreground">Start shopping to see your orders here.</p>
                <Link href="/shop">
                    <Button>Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Clock className="h-8 w-8 text-primary" />
                Order History
            </h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-card border rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-white">#{order.id.slice(-8)}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                            </p>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                            <p className="font-bold text-lg text-foreground">₹ {order.total.toFixed(2)}</p>
                            <Link href={`/profile/orders/${order.id}`}>
                                <Button variant="outline" size="sm">
                                    Track Order <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
