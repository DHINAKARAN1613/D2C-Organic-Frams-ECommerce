'use client';

import { useState } from 'react';
import { Edit2, X, Loader2, Save } from 'lucide-react';
import { updateFarmerProduct } from '@/app/farmer/products/actions';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '@/lib/imageUtils';
import { useToast } from '@/context/ToastContext';

export function EditFarmerProductButton({ product }: { product: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { error, success } = useToast();

    const rawImage = getImageUrl(product.images) || '';

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        const res = await updateFarmerProduct(product.id, formData);
        setIsLoading(false);

        if (res.success) {
            setIsOpen(false);
            success('Product updated successfully');
        } else {
            error('Failed to update product');
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                title="Edit Product"
            >
                <Edit2 className="w-4 h-4" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-surface border border-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <Edit2 className="w-5 h-5 text-primary" /> Edit Product
                                </h3>
                                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-extrabold text-muted-foreground uppercase mb-1">Product Name</label>
                                        <input name="name" defaultValue={product.name} required className="w-full bg-background border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-sm shadow-inner" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-muted-foreground uppercase mb-1">Stock</label>
                                        <input name="stock" type="number" defaultValue={product.stock} required className="w-full bg-background border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-sm shadow-inner" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-extrabold text-muted-foreground uppercase mb-1">Price (₹)</label>
                                        <input name="price" type="number" step="0.01" defaultValue={product.price} required className="w-full bg-background border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-sm shadow-inner" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-muted-foreground uppercase mb-1">Original Price (₹)</label>
                                        <input name="originalPrice" type="number" step="0.01" defaultValue={product.originalPrice || ''} className="w-full bg-background border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-sm shadow-inner" placeholder="Optional" />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-extrabold text-muted-foreground uppercase mb-1">Unit</label>
                                        <input name="unit" defaultValue={product.unit} required className="w-full bg-background border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-sm shadow-inner" />
                                    </div>
                                    <div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-extrabold text-muted-foreground uppercase mb-1">Product Image</label>
                                    <div className="space-y-3">
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
                                                        const input = document.getElementById(`edit-image-${product.id}`) as HTMLInputElement;
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
                                        <input
                                            id={`edit-image-${product.id}`}
                                            name="image"
                                            defaultValue={rawImage}
                                            className="w-full bg-background border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-sm shadow-inner"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3 border-t border-border mt-2">
                                    <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg border border-border font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-sm">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-extrabold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 text-sm shadow-md">
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save Changes
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
