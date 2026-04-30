'use client';

import { useState } from 'react';
import { updateOrderStatus } from './actions';
import { Loader2, Check } from 'lucide-react';

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export function OrderStatusSelector({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newStatus = e.target.value;
        setIsLoading(true);
        await updateOrderStatus(orderId, newStatus);
        setIsLoading(false);
    }

    return (
        <div className="relative">
            <select
                value={currentStatus}
                onChange={handleChange}
                disabled={isLoading}
                className={`appearance-none bg-[#112117] border border-[#2d4035] text-xs font-bold px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#30e87a] disabled:opacity-50 cursor-pointer ${currentStatus === 'PENDING' ? 'text-yellow-500 border-yellow-500/20' :
                        currentStatus === 'CONFIRMED' ? 'text-blue-500 border-blue-500/20' :
                            currentStatus === 'SHIPPED' ? 'text-purple-500 border-purple-500/20' :
                                currentStatus === 'DELIVERED' ? 'text-[#30e87a] border-[#30e87a]/20' :
                                    'text-red-500 border-red-500/20'
                    }`}
            >
                {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
            </select>
            {isLoading && <Loader2 className="absolute right-2 top-1.5 w-3 h-3 animate-spin text-[#9db8a8]" />}
        </div>
    );
}
