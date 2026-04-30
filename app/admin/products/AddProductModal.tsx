
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, Upload, Loader2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/ToastContext';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    categories: { id: string; name: string }[];
}

// Extra State for UI
export function AddProductModal({ isOpen, onClose, onSuccess, categories, initialData }: AddProductModalProps & { initialData?: any }) {
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        stock: '',
        unit: 'pcs',
        categoryId: '',
        image: ''
    });

    useEffect(() => {
        if (initialData) {
            // Parse image from JSON string if needed, or take first valid
            let imgUrl = '';
            try {
                const parsed = JSON.parse(initialData.images);
                imgUrl = Array.isArray(parsed) ? parsed[0] : parsed;
            } catch (e) {
                imgUrl = initialData.images || '';
            }

            setFormData({
                name: initialData.name,
                description: initialData.description,
                price: initialData.price,
                originalPrice: initialData.originalPrice || '',
                stock: initialData.stock,
                unit: initialData.unit || 'pcs',
                categoryId: initialData.categoryId,
                image: imgUrl
            });
        } else {
            // Reset for Add Mode
            setFormData({
                name: '',
                description: '',
                price: '',
                originalPrice: '',
                stock: '',
                unit: 'pcs',
                categoryId: '',
                image: ''
            });
        }
    }, [initialData, isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                // Use a direct alert here or just ignore, but better to use toast if we could access it here.
                // Since hooks can only be at top level, we access methods via closure if defined above, or we need to access context inside component.
                // We will use the toastError we defined in handleSubmit scope? No, we need it at component level.
                // Let's rely on the toastError extracted at top level of component.
                toastError("File too large. Max 5MB.");
                return;
            }
            setImageFile(file);
            setFormData(prev => ({ ...prev, image: '' }));
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const { success, error: toastError } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalImage = formData.image;
            if (imageFile) {
                finalImage = await convertToBase64(imageFile);
            }

            const payload = {
                ...formData,
                image: finalImage,
                isNewCategory,
                newCategoryName
            };

            let res;
            if (initialData) {
                // EDIT MODE
                res = await fetch('/api/admin/products', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: initialData.id, ...payload }),
                });
            } else {
                // CREATE MODE
                res = await fetch('/api/admin/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || (initialData ? 'Failed to update' : 'Failed to create'));
            }

            if (!initialData) {
                setFormData({ name: '', description: '', price: '', originalPrice: '', stock: '', unit: 'pcs', categoryId: '', image: '' });
                setIsNewCategory(false);
                setNewCategoryName('');
                setImageFile(null);
            }

            onSuccess();
            onClose();
            success(initialData ? 'Product Updated Successfully! ✏️' : 'Product Created Successfully! 🎉');
        } catch (err: any) {
            console.error(err);
            toastError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-background rounded-xl shadow-xl w-full max-w-lg overflow-hidden border max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center p-4 border-b bg-muted/30">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                {initialData ? '✏️ Edit Product' : <><Plus className="h-5 w-5 text-primary" /> Add New Product</>}
                            </h2>
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Product Name</label>
                                <Input
                                    required
                                    placeholder="e.g. Organic Honey"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Original Price / MRP (₹)</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.originalPrice}
                                        onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Offer Price (₹)</label>
                                    <Input
                                        required
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Stock</label>
                                    <Input
                                        required
                                        type="number"
                                        placeholder="0"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Unit</label>
                                    <select
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={formData.unit}
                                        onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                    >
                                        <option value="pcs">Pieces (pcs)</option>
                                        <option value="kg">Kilogram (kg)</option>
                                        <option value="g">Gram (g)</option>
                                        <option value="l">Liter (l)</option>
                                        <option value="ml">Milliliter (ml)</option>
                                        <option value="dozen">Dozen</option>
                                        <option value="pack">Pack</option>
                                        <option value="bunch">Bunch</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                {!isNewCategory ? (
                                    <select
                                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
                                        required
                                        value={formData.categoryId}
                                        onChange={e => {
                                            if (e.target.value === 'NEW_CATEGORY_OPTION') {
                                                setIsNewCategory(true);
                                                setFormData({ ...formData, categoryId: '' });
                                            } else {
                                                setFormData({ ...formData, categoryId: e.target.value });
                                            }
                                        }}
                                    >
                                        <option value="">Select Category...</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                        <option value="NEW_CATEGORY_OPTION" className="font-bold text-primary">+ Create New Category</option>
                                    </select>
                                ) : (
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Enter new category name..."
                                            required
                                            value={newCategoryName}
                                            onChange={e => setNewCategoryName(e.target.value)}
                                            autoFocus
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setIsNewCategory(false);
                                                setNewCategoryName('');
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Detailed Description</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm border-gray-200"
                                    required
                                    placeholder="Describe the product..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Product Image</label>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs text-muted-foreground mb-1 block">Option 1: Upload File</label>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-background px-2 text-muted-foreground">Or</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Option 2: Image URL</label>
                                        <Input
                                            disabled={!!imageFile}
                                            placeholder="https://..."
                                            value={formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (initialData ? 'Save Changes' : <><Plus className="mr-2 h-4 w-4" /> Create Product</>)}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
