import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageUtils';
import { AddFarmerProductButton } from '@/components/farmer/AddFarmerProductButton';
import { EditFarmerProductButton } from '@/components/farmer/EditFarmerProductButton';
import { DeleteFarmerProductButton } from '@/components/farmer/DeleteFarmerProductButton';
import { ShieldAlert } from 'lucide-react';

async function getFarmerProducts(farmerId: string) {
    try {
        const products = await prisma.product.findMany({
            where: { farmerId },
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        });
        return products;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}

export default async function FarmerProductsPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        redirect('/auth/signin');
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isVerifiedFarmer: true }
    });

    if (!user) {
        redirect('/auth/signin');
    }

    const isVerified = user.isVerifiedFarmer;

    const products = isVerified ? await getFarmerProducts(userId) : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">My Products</h2>
                    <p className="text-[#9db8a8]">Manage the produce you are selling.</p>
                </div>
                <div className="flex items-center gap-4">
                    {isVerified && <AddFarmerProductButton />}
                </div>
            </div>

            {!isVerified ? (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-12 text-center max-w-2xl mx-auto mt-12">
                    <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-3">Pending Verification</h3>
                    <p className="text-[#9db8a8] text-lg mb-6 leading-relaxed">
                        Your farmer account is currently under review by our administration team. 
                        To ensure quality and authenticity on our platform, you cannot list products until your account is verified.
                    </p>
                    <p className="text-amber-500/80 text-sm font-bold uppercase tracking-widest">
                        We will notify you once approved
                    </p>
                </div>
            ) : (
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
                                            You haven't added any products yet.
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
