'use client';

import { useState } from 'react';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { deleteProduct } from '@/app/admin/products/actions';
import { motion, AnimatePresence } from 'framer-motion';

export function DeleteProductButton({ productId }: { productId: string }) {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { error, success } = useToast();

    const handleDelete = async () => {
        setIsDeleting(true);
        const res = await deleteProduct(productId);
        if (res.error) {
            error(res.error || 'Failed to delete product');
            setIsDeleting(false);
            return;
        }
        success('Product deleted successfully');
        setIsConfirming(false);
        setIsDeleting(false);
    };

    return (
        <>
            <button
                onClick={() => setIsConfirming(true)}
                className="p-2 rounded-lg text-[#9db8a8] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                title="Delete Product"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <AnimatePresence>
                {isConfirming && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1c2e24] border border-red-500/30 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Delete Product?</h3>
                                <p className="text-[#9db8a8] text-sm mb-6">
                                    This action cannot be undone. This will permanently remove the product from your inventory.
                                </p>

                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => setIsConfirming(false)}
                                        disabled={isDeleting}
                                        className="px-4 py-2 rounded-lg border border-[#2d4035] text-[#9db8a8] hover:bg-[#2d4035] transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition-colors shadow-lg shadow-red-500/20 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
