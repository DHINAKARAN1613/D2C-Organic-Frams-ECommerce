'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function createFarmerProduct(formData: FormData) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) throw new Error('Not authenticated');

    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const originalPriceRaw = formData.get('originalPrice') as string;
    const originalPrice = originalPriceRaw ? parseFloat(originalPriceRaw) : null;
    const stock = parseInt(formData.get('stock') as string);
    const unit = formData.get('unit') as string;
    const categoryName = formData.get('category') as string;
    const image = formData.get('image') as string;

    if (!name || !price || !categoryName) {
        throw new Error('Missing required fields');
    }

    try {
        let category = await prisma.category.findUnique({
            where: { name: categoryName }
        });

        if (!category) {
            category = await prisma.category.create({
                data: {
                    name: categoryName,
                    slug: categoryName.toLowerCase().replace(/\s+/g, '-')
                }
            });
        }

        await prisma.product.create({
            data: {
                name,
                description: '', 
                price,
                originalPrice,
                stock,
                unit,
                images: image || '',
                categoryId: category.id,
                farmerId: userId
            }
        });

        revalidatePath('/farmer/products');
        return { success: true };
    } catch (error) {
        console.error('Failed to create product:', error);
        return { success: false, error: 'Failed to create product' };
    }
}

export async function updateFarmerProduct(id: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) throw new Error('Not authenticated');

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product || product.farmerId !== userId) {
        throw new Error('Not authorized');
    }

    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const originalPriceRaw = formData.get('originalPrice') as string;
    const originalPrice = originalPriceRaw ? parseFloat(originalPriceRaw) : null;
    const stock = parseInt(formData.get('stock') as string);
    const unit = formData.get('unit') as string;
    const image = formData.get('image') as string;

    try {
        await prisma.product.update({
            where: { id },
            data: {
                name,
                price,
                originalPrice,
                stock,
                unit,
                images: image
            }
        });
        revalidatePath('/farmer/products');
        return { success: true };
    } catch (error) {
        console.error('Failed to update product:', error);
        return { success: false, error: 'Failed to update' };
    }
}

export async function deleteFarmerProduct(id: string) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) throw new Error('Not authenticated');

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product || product.farmerId !== userId) {
        throw new Error('Not authorized');
    }

    try {
        await prisma.product.delete({ where: { id } });
        revalidatePath('/farmer/products');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete product:', error);
        return { success: false, error: 'Failed to delete' };
    }
}
