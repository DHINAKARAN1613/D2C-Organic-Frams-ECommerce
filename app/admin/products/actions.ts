'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
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
        // Find or create category
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
                description: '', // Optional or default
                price,
                originalPrice,
                stock,
                unit,
                images: image || '',
                categoryId: category.id
            }
        });

        revalidatePath('/admin/products');
        return { success: true };
    } catch (error) {
        console.error('Failed to create product:', error);
        return { success: false, error: 'Failed to create product' };
    }
}

export async function updateProduct(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const originalPriceRaw = formData.get('originalPrice') as string;
    const originalPrice = originalPriceRaw ? parseFloat(originalPriceRaw) : null;
    const stock = parseInt(formData.get('stock') as string);
    const unit = formData.get('unit') as string;

    // Image handling: allow multiple, comma or newline separated
    const image = formData.get('image') as string; // Will improve this in UI first

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
        revalidatePath('/admin/products');
        return { success: true };
    } catch (error) {
        console.error('Failed to update product:', error);
        return { success: false, error: 'Failed to update' };
    }
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({ where: { id } });
        revalidatePath('/admin/products');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete product:', error);
        return { success: false, error: 'Failed to delete' };
    }
}
