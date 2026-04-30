// @ts-nocheck
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    // Strict Admin Check
    if (!session?.user || session.user.email !== 'admin@example.com') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const products = await prisma.product.findMany({
        orderBy: { name: 'asc' },
        include: { category: true }
    });

    return NextResponse.json(products);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.email !== 'admin@example.com') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, originalPrice, stock, categoryId, image, isNewCategory, newCategoryName, unit } = body;

    try {
        let finalCategoryId = categoryId;

        // If new category requested, create it first
        if (isNewCategory && newCategoryName) {
            // Generate simple slug
            const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            const newCategory = await prisma.category.create({
                data: {
                    name: newCategoryName,
                    slug: slug + '-' + Date.now(), // Ensure uniqueness
                    description: 'Custom category created by admin',
                }
            });
            finalCategoryId = newCategory.id;
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                originalPrice: originalPrice ? parseFloat(originalPrice) : null,
                stock: parseInt(stock),
                unit: unit || 'pcs',
                categoryId: finalCategoryId,
                images: JSON.stringify([image]),
            },
        });
        return NextResponse.json(product);
    } catch (error) {
        console.error('CREATE_PRODUCT_ERROR', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.email !== 'admin@example.com') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { id, name, description, price, originalPrice, stock, categoryId, image, unit } = body;

    try {
        const data: any = {};
        if (name) data.name = name;
        if (description) data.description = description;
        if (price !== undefined && price !== '') data.price = parseFloat(price);
        if (originalPrice !== undefined) data.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
        if (stock !== undefined && stock !== '') data.stock = parseInt(stock);
        if (unit) data.unit = unit;
        if (categoryId) data.categoryId = categoryId;
        if (image) data.images = JSON.stringify([image]);

        const product = await prisma.product.update({
            where: { id },
            data,
        });

        return NextResponse.json(product);
    } catch (error: any) {
        return new NextResponse(error.message || 'Internal Error', { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.email !== 'admin@example.com') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return new NextResponse('Missing ID', { status: 400 });

    try {
        await prisma.product.delete({
            where: { id },
        });
        return new NextResponse('Deleted', { status: 200 });
    } catch (error) {
        console.error('DELETE_PRODUCT_ERROR', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
