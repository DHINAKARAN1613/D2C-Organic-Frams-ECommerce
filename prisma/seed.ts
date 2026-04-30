
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Ensure Demo User exists
    await prisma.user.upsert({
        where: { email: 'demo@example.com' },
        update: {},
        create: {
            id: 'demo-user-id',
            email: 'demo@example.com',
            name: 'Demo User',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            role: 'USER', // Ensure this is USER
        },
    })

    // Ensure Admin User exists (Fix for FK Order error)
    await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            id: 'admin-user-id',
            email: 'admin@example.com',
            name: 'Admin User',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
            role: 'ADMIN',
        },
    })

    // Categories
    const vegetables = await prisma.category.upsert({
        where: { slug: 'vegetables' },
        update: {
            image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=80',
        },
        create: {
            name: 'Fresh Vegetables',
            slug: 'vegetables',
            description: 'Organic farm-fresh vegetables',
            image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=80',
        },
    })

    const fruits = await prisma.category.upsert({
        where: { slug: 'fruits' },
        update: {
            image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
        },
        create: {
            name: 'Organic Fruits',
            slug: 'fruits',
            description: 'Seasonal organic fruits',
            image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
        },
    })

    const soaps = await prisma.category.upsert({
        where: { slug: 'organic-soaps' },
        update: {
            image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80',
        },
        create: {
            name: 'Organic Soaps',
            slug: 'organic-soaps',
            description: 'Handmade natural soaps',
            image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80',
        },
    })

    const essentials = await prisma.category.upsert({
        where: { slug: 'essentials' },
        update: {
            image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=800&q=80',
        },
        create: {
            name: 'Essentials',
            slug: 'essentials',
            description: 'Daily organic essentials',
            image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=800&q=80',
        },
    })

    // Products
    const productsData = [
        // Veggies
        { name: 'Ooty Carrot', description: 'Sweet and crunchy organic carrots.', price: 50.0, stock: 100, catId: vegetables.id, img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80', unit: 'kg' },
        { name: 'Ladies Finger', description: 'Fresh organic ladies finger.', price: 33.0, stock: 50, catId: vegetables.id, img: 'https://images.unsplash.com/photo-1629156365942-0fda8696c21a?auto=format&fit=crop&w=800&q=80', unit: 'kg' },
        { name: 'Beetroot', description: 'Earthy and rich organic beetroot.', price: 37.0, stock: 80, catId: vegetables.id, img: 'https://images.unsplash.com/photo-1626315570220-4354ee2cb051?auto=format&fit=crop&w=800&q=80', unit: 'kg' },
        { name: 'Spinach', description: 'Fresh green organic spinach.', price: 25.0, stock: 0, catId: vegetables.id, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80', unit: 'bunch' }, // Out of stock

        // Fruits
        { name: 'Kashmir Apple', description: 'Crisp and sweet apples.', price: 180.0, stock: 60, catId: fruits.id, img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80', unit: 'kg' },
        { name: 'Robusta Banana', description: 'Organic Robusta bananas.', price: 40.0, stock: 120, catId: fruits.id, img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80', unit: 'kg' },
        { name: 'Pomegranate', description: 'Ruby red organic pomegranate.', price: 150.0, stock: 45, catId: fruits.id, img: 'https://images.unsplash.com/photo-1615485925763-867862f8027a?auto=format&fit=crop&w=800&q=80', unit: 'kg' },

        // Soaps
        { name: 'Lavender Scrub', description: 'Exfoliating lavender soap.', price: 120.0, stock: 50, catId: soaps.id, img: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=800&q=80', unit: 'pcs' },
        { name: 'Neem & Turmeric', description: 'Antibacterial herbal soap.', price: 95.0, stock: 0, catId: soaps.id, img: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80', unit: 'pcs' }, // Out of stock
        { name: 'Goat Milk Soap', description: 'Moisturizing gentle soap.', price: 150.0, stock: 30, catId: soaps.id, img: 'https://images.unsplash.com/photo-1600857062241-98e5b4f40072?auto=format&fit=crop&w=800&q=80', unit: 'pcs' },

        // Essentials
        { name: 'Wild Forest Honey', description: 'Pure raw honey.', price: 350.0, stock: 20, catId: essentials.id, img: 'https://images.unsplash.com/photo-1563729768-6af584667824?auto=format&fit=crop&w=800&q=80', unit: 'kg' },
        { name: 'Cold Pressed Coconut Oil', description: 'Organic virgin oil.', price: 220.0, stock: 40, catId: essentials.id, img: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=800&q=80', unit: 'l' },
    ]

    for (const p of productsData) {
        // Check if product exists
        const existing = await prisma.product.findFirst({ where: { name: p.name } });
        if (existing) {
            // Update existing product with new image
            await prisma.product.update({
                where: { id: existing.id },
                data: {
                    images: JSON.stringify([p.img]),
                    description: p.description, // also keep desc updated
                    price: p.price,
                }
            });
        } else {
            // Create new product
            await prisma.product.create({
                data: {
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    stock: p.stock,
                    unit: p.unit,
                    images: JSON.stringify([p.img]),
                    categoryId: p.catId,
                },
            })
        }
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
