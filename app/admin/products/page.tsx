import { Plus } from 'lucide-react';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { Filter } from 'lucide-react';
import { AddProductButton } from '@/components/admin/AddProductButton';
import { EditProductButton } from '@/components/admin/EditProductButton';
import { DeleteProductButton } from '@/components/admin/DeleteProductButton';
import { getImageUrl } from '@/lib/imageUtils';
import Link from 'next/link'; // Import Link

// Force dynamic rendering to ensure fresh data
// Force dynamic removed to allow caching. Actions trigger revalidation.

async function getProducts(filter?: string) {
    try {
        const where = filter === 'low_stock' ? { stock: { lt: 10 } } : {};
        const products = await prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        });
        return products;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}

export default async function ProductsPage(props: { searchParams: Promise<{ filter?: string }> }) {
    const searchParams = await props.searchParams;
    const filter = searchParams?.filter;
    const products = await getProducts(filter);
    const isLowStockFilterActive = filter === 'low_stock';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Products</h2>
                    <p className="text-[#9db8a8]">Manage your inventory and catalog.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href={isLowStockFilterActive ? '/admin/products' : '/admin/products?filter=low_stock'}
                        className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors border ${isLowStockFilterActive
                            ? 'bg-orange-500/10 text-orange-500 border-orange-500'
                            : 'bg-[#1c2e24] text-[#9db8a8] border-[#2d4035] hover:text-white'
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        Low Stock {isLowStockFilterActive && '(Clear)'}
                    </Link>
                    <AddProductButton />
                </div>
            </div>

            <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[900px]">
                        <thead className="bg-[#112117]/50 text-[#9db8a8] text-xs uppercase tracking-wider font-semibold border-b border-[#2d4035]">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-center">Stock</th>
                                <th className="px-6 py-4">Unit</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2d4035]">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-[#9db8a8]">
                                        No products found. Start by adding one.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-[#253b30] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-lg bg-white/5 relative overflow-hidden border border-white/10 shrink-0">
                                                    {getImageUrl(product.images) ? (
                                                        <Image
                                                            src={getImageUrl(product.images)!}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-[#112117]" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{product.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[#9db8a8] text-sm">{product.category.name}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`font-bold ${product.stock < 10 ? 'text-orange-500' : 'text-white'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[#9db8a8] text-sm">{product.unit}</td>
                                        <td className="px-6 py-4 font-bold text-white">₹{product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <EditProductButton product={product} />
                                                <DeleteProductButton productId={product.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
