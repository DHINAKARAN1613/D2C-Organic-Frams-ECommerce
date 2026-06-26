'use client';

import Image from 'next/image';
import { getImageUrl } from '@/lib/imageUtils';
import { AddFarmerProductButton } from '@/components/farmer/AddFarmerProductButton';
import { EditFarmerProductButton } from '@/components/farmer/EditFarmerProductButton';
import { DeleteFarmerProductButton } from '@/components/farmer/DeleteFarmerProductButton';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FarmerProductsClientProps {
    products: any[];
    isVerified: boolean;
}

export default function FarmerProductsClient({ products, isVerified }: FarmerProductsClientProps) {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">{t.myProducts}</h2>
                    <p className="text-muted-foreground font-medium">{t.manageProduce}</p>
                </div>
                <div className="flex items-center gap-4">
                    {isVerified && <AddFarmerProductButton />}
                </div>
            </div>

            {!isVerified ? (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-12 text-center max-w-2xl mx-auto mt-12 shadow-sm">
                    <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-foreground mb-3">{t.pendingVerification}</h3>
                    <p className="text-muted-foreground text-lg mb-6 leading-relaxed font-medium">
                        {t.accountUnderReview}
                    </p>
                    <p className="text-amber-500 text-sm font-extrabold uppercase tracking-widest">
                        {t.notifyOnceApproved}
                    </p>
                </div>
            ) : (
                <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-md">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[900px]">
                            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider font-extrabold border-b border-border">
                                <tr>
                                    <th className="px-6 py-4">{t.product}</th>
                                    <th className="px-6 py-4">{t.category}</th>
                                    <th className="px-6 py-4 text-center">{t.stock}</th>
                                    <th className="px-6 py-4">{t.unit}</th>
                                    <th className="px-6 py-4">{t.price}</th>
                                    <th className="px-6 py-4 text-right">{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-surface">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground font-semibold">
                                            {t.noProductsAdded}
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product.id} className="hover:bg-muted/40 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 rounded-lg bg-muted relative overflow-hidden border border-border shrink-0 shadow-sm">
                                                        {getImageUrl(product.images) ? (
                                                            <Image
                                                                src={getImageUrl(product.images)!}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-muted" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground">{product.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground text-sm font-medium">{product.category.name}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`font-bold ${product.stock < 10 ? 'text-orange-500' : 'text-foreground'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground text-sm font-medium">{product.unit}</td>
                                            <td className="px-6 py-4 font-bold text-foreground">₹{product.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <EditFarmerProductButton product={product} />
                                                    <DeleteFarmerProductButton productId={product.id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
