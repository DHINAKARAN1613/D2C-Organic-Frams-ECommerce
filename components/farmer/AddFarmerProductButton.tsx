'use client';

import { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { Plus, X, Loader2 } from 'lucide-react';
import { createFarmerProduct } from '@/app/farmer/products/actions';
import { motion, AnimatePresence } from 'framer-motion';

export function AddFarmerProductButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { error, success } = useToast();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        const res = await createFarmerProduct(formData);
        setIsLoading(false);

        if (res.success) {
            setIsOpen(false);
            success('Product created successfully');
        } else {
            error('Failed to create product');
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-extrabold hover:opacity-90 transition-all shadow-md"
            >
                <Plus className="w-4 h-4 stroke-[2.5]" /> Add Product
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-surface border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <h3 className="text-xl font-bold text-foreground">Add New Product</h3>
                                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-extrabold text-muted-foreground uppercase mb-1">Product Name</label>
                                    <input name="name" required className="w-full bg-background border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-sm shadow-inner" placeholder="e.g. Organic Avocados" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-muted-foreground uppercase mb-1">Price (₹)</label>
                                        <input name="price" type="number" step="0.01" required className="w-full bg-background border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-sm shadow-inner" placeholder="0.00" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-muted-foreground uppercase mb-1">Original Price (₹)</label>
                                        <input name="originalPrice" type="number" step="0.01" className="w-full bg-background border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-sm shadow-inner" placeholder="Optional" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-muted-foreground uppercase mb-1">Stock</label>
                                        <input name="stock" type="number" required className="w-full bg-background border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-sm shadow-inner" placeholder="0" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-muted-foreground uppercase mb-1">Unit</label>
                                        <input name="unit" required className="w-full bg-background border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-sm shadow-inner" placeholder="e.g. kg, pcs" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-extrabold text-muted-foreground uppercase mb-1">Category</label>
                                    <input name="category" required className="w-full bg-background border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-sm shadow-inner" placeholder="e.g. Fresh Produce" />
                                </div>
                                <div>
                                    <label className="block text-xs font-extrabold text-muted-foreground uppercase mb-1">Product Image</label>
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
                                                            const input = document.getElementsByName('image')[0] as HTMLInputElement;
                                                            if (input) input.value = data.url;
                                                        } else {
                                                            error('Upload failed');
                                                        }
                                                    } catch (err) {
                                                        console.error(err);
                                                        error('Upload failed');
                                                    } finally {
                                                        setIsLoading(false);
                                                    }
                                                }}
                                                className="block w-full text-sm font-semibold text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                            />
                                        </div>
                                        <input name="image" className="w-full bg-background border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-sm shadow-inner" placeholder="Or paste image URL..." />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg border border-border font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-sm">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-extrabold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 text-sm shadow-md">
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
