const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Fetching farmers and categories...');
    
    // Get farmers
    const farmers = await prisma.user.findMany({
        where: { role: 'FARMER' }
    });
    
    if (farmers.length === 0) {
        console.error('No farmers found. Please run seed-farmers.js first.');
        process.exit(1);
    }

    // Get existing categories to avoid slug unique constraint issues
    const categories = await prisma.category.findMany();
    if (categories.length === 0) {
        console.error('No categories found.');
        process.exit(1);
    }

    const getRandomCategory = () => categories[Math.floor(Math.random() * categories.length)].id;
    const getRandomFarmer = () => farmers[Math.floor(Math.random() * farmers.length)].id;

    const newProducts = [
        {
            name: "Organic Heirloom Tomatoes",
            description: "Juicy, vine-ripened heirloom tomatoes grown without synthetic pesticides. Perfect for salads, sauces, and sandwiches.",
            price: 85.00,
            originalPrice: 100.00,
            stock: 50,
            unit: "kg",
            images: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80",
            categoryId: getRandomCategory(),
            farmerId: getRandomFarmer()
        },
        {
            name: "Farm-Fresh Spinach (Palak)",
            description: "Crisp, iron-rich spinach leaves harvested at dawn to preserve maximum freshness and nutrients.",
            price: 45.00,
            originalPrice: null,
            stock: 30,
            unit: "bunch",
            images: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80",
            categoryId: getRandomCategory(),
            farmerId: getRandomFarmer()
        },
        {
            name: "Organic Alphonso Mangoes",
            description: "The king of fruits! Handpicked, naturally ripened Alphonso mangoes from Konkan/Ratnagiri farms.",
            price: 450.00,
            originalPrice: 550.00,
            stock: 20,
            unit: "dozen",
            images: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80",
            categoryId: getRandomCategory(),
            farmerId: getRandomFarmer()
        },
        {
            name: "Cold-Pressed Groundnut Oil",
            description: "Traditional wood-pressed (mara chekku) groundnut oil, retaining its natural aroma, flavor, and nutrients.",
            price: 280.00,
            originalPrice: 320.00,
            stock: 40,
            unit: "liter",
            images: "https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=800&q=80",
            categoryId: getRandomCategory(),
            farmerId: getRandomFarmer()
        },
        {
            name: "Desi Cow A2 Ghee",
            description: "Pure, aromatic Bilona ghee made from the milk of grass-fed native Indian cows. Rich in omega-3 and vitamins.",
            price: 890.00,
            originalPrice: 1100.00,
            stock: 15,
            unit: "500g",
            images: "https://images.unsplash.com/photo-1647413498877-ab094627ef67?w=800&q=80",
            categoryId: getRandomCategory(),
            farmerId: getRandomFarmer()
        },
        {
            name: "Organic Turmeric Powder (High Curcumin)",
            description: "Sun-dried and traditionally ground Salem turmeric. High curcumin content for maximum immunity benefits.",
            price: 150.00,
            originalPrice: null,
            stock: 100,
            unit: "250g",
            images: "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=800&q=80",
            categoryId: getRandomCategory(),
            farmerId: getRandomFarmer()
        },
        {
            name: "Traditional Black Rice (Karuppu Kavuni)",
            description: "Ancient heritage rice known as 'Forbidden Rice'. Packed with antioxidants, fiber, and protein. Great for diabetic management.",
            price: 180.00,
            originalPrice: 220.00,
            stock: 60,
            unit: "kg",
            images: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
            categoryId: getRandomCategory(),
            farmerId: getRandomFarmer()
        },
        {
            name: "Organic Raw Honey",
            description: "Unprocessed, unfiltered honey sourced directly from forest apiaries. Contains natural pollen and enzymes.",
            price: 350.00,
            originalPrice: 400.00,
            stock: 25,
            unit: "500g",
            images: "https://images.unsplash.com/photo-1587049352847-4d4b126a61b5?w=800&q=80",
            categoryId: getRandomCategory(), // Or a new category
            farmerId: getRandomFarmer()
        },
        {
            name: "Native Garlic (Malai Poondu)",
            description: "Small, highly potent mountain garlic with intense flavor and medicinal properties.",
            price: 250.00,
            originalPrice: null,
            stock: 35,
            unit: "kg",
            images: "https://images.unsplash.com/photo-1540148426941-8ce2ab7bd8e4?w=800&q=80",
            categoryId: getRandomCategory(),
            farmerId: getRandomFarmer()
        },
        {
            name: "Organic Red Poha (Beaten Rice)",
            description: "Made from organic red rice. A healthy, fiber-rich option for quick traditional breakfasts.",
            price: 85.00,
            originalPrice: 100.00,
            stock: 80,
            unit: "500g",
            images: "https://images.unsplash.com/photo-1579705745173-45ab89d38c11?w=800&q=80",
            categoryId: getRandomCategory(),
            farmerId: getRandomFarmer()
        }
    ];

    console.log('Seeding products...');
    let count = 0;
    for (const p of newProducts) {
        // Just create them directly
        await prisma.product.create({
            data: p
        });
        count++;
    }

    console.log(`Successfully added ${count} new organic products!`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
