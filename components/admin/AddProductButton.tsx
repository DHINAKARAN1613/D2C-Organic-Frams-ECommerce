'use client';

import { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { createProduct } from '@/app/admin/products/actions';
import { motion, AnimatePresence } from 'framer-motion';

export function AddProductButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        const res = await createProduct(formData);
        setIsLoading(false);

        if (res.success) {
            setIsOpen(false);
            // Optionally show toast
        } else {
            alert('Failed to create product');
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#30e87a] text-[#112117] text-sm font-bold hover:bg-[#2bd970] transition-colors shadow-lg shadow-[#30e87a]/20"
            >
                <Plus className="w-4 h-4" /> Add Product
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1c2e24] border border-[#2d4035] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-[#2d4035] flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">Add New Product</h3>
                                <button onClick={() => setIsOpen(false)} className="text-[#9db8a8] hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#9db8a8] uppercase mb-1">Product Name</label>
                                    <input name="name" required className="w-full bg-[#112117] border border-[#2d4035] rounded-lg p-3 text-white focus:outline-none focus:border-[#30e87a]" placeholder="e.g. Organic Avocados" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#9db8a8] uppercase mb-1">Price (₹)</label>
                                        <input name="price" type="number" step="0.01" required className="w-full bg-[#112117] border border-[#2d4035] rounded-lg p-3 text-white focus:outline-none focus:border-[#30e87a]" placeholder="0.00" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#9db8a8] uppercase mb-1">Original Price (₹)</label>
                                        <input name="originalPrice" type="number" step="0.01" className="w-full bg-[#112117] border border-[#2d4035] rounded-lg p-3 text-white focus:outline-none focus:border-[#30e87a]" placeholder="Optional" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#9db8a8] uppercase mb-1">Stock</label>
                                        <input name="stock" type="number" required className="w-full bg-[#112117] border border-[#2d4035] rounded-lg p-3 text-white focus:outline-none focus:border-[#30e87a]" placeholder="0" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#9db8a8] uppercase mb-1">Unit</label>
                                        <input name="unit" required className="w-full bg-[#112117] border border-[#2d4035] rounded-lg p-3 text-white focus:outline-none focus:border-[#30e87a]" placeholder="e.g. kg, pcs" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#9db8a8] uppercase mb-1">Category</label>
                                    <input name="category" required className="w-full bg-[#112117] border border-[#2d4035] rounded-lg p-3 text-white focus:outline-none focus:border-[#30e87a]" placeholder="e.g. Fresh Produce" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#9db8a8] uppercase mb-1">Product Image</label>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    setIsLoading(true);
                                                    const formData = new FormData();
                                                    formData.append('file', file);

                                                    try {
                                                        const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                                        const data = await res.json();
                                                        if (data.success) {
                                                            // Set the hidden input value
                                                            const input = document.getElementsByName('image')[0] as HTMLInputElement;
                                                            if (input) input.value = data.url;
                                                        }
                                                    } catch (err) {
                                                        console.error(err);
                                                        alert('Upload failed');
                                                    } finally {
                                                        setIsLoading(false);
                                                    }
                                                }}
                                                className="block w-full text-sm text-[#9db8a8]
                                                  file:mr-4 file:py-2 file:px-4
                                                  file:rounded-lg file:border-0
                                                  file:text-xs file:font-semibold
                                                  file:bg-[#30e87a]/10 file:text-[#30e87a]
                                                  hover:file:bg-[#30e87a]/20
                                                "
                                            />
                                        </div>
                                        <input name="image" className="w-full bg-[#112117] border border-[#2d4035] rounded-lg p-3 text-white focus:outline-none focus:border-[#30e87a] text-sm" placeholder="Or paste image URL..." />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg border border-[#2d4035] text-[#9db8a8] hover:bg-[#2d4035] transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-lg bg-[#30e87a] text-[#112117] font-bold hover:bg-[#2bd970] transition-colors disabled:opacity-50 flex items-center gap-2">
                                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Save Product
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
