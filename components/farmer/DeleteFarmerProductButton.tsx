'use client';

import { useState } from 'react';
import { Trash2, Loader2, AlertTriangle, X } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { deleteFarmerProduct } from '@/app/farmer/products/actions';
import { motion, AnimatePresence } from 'framer-motion';

export function DeleteFarmerProductButton({ productId }: { productId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const { error, success } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    async function handleDelete() {
        setIsLoading(true);
        const res = await deleteFarmerProduct(productId);
        setIsLoading(false);

        if (res.success) {
            setIsOpen(false);
            success('Product deleted successfully');
        } else {
            error('Failed to delete product');
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-lg text-[#9db8a8] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Delete Product"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1c2e24] border border-red-500/20 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-[#2d4035] flex items-center justify-between bg-red-500/5">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-500" /> Delete Product
                                </h3>
                                <button onClick={() => setIsOpen(false)} className="text-[#9db8a8] hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6">
                                <p className="text-[#9db8a8]">Are you sure you want to delete this product? This action cannot be undone.</p>
                            </div>

                            <div className="p-6 pt-0 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-[#2d4035] text-[#9db8a8] hover:bg-[#2d4035] transition-colors"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                    className="px-6 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
