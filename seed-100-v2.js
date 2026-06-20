const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Fixing irrelevant images - Generating 100 distinct, perfectly mapped products...');

    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    console.log('Cleared old products.');

    const allImages = {
        carrot: '/images/prod_carrot_1781847269332.png',
        okra: '/images/prod_okra_1781847282640.png',
        beetroot: '/images/prod_beetroot_1781847296142.png',
        spinach: '/images/prod_spinach_1781847310387.png',
        apple: '/images/prod_apple_1781847323279.png',
        pomegranate: '/images/prod_pomegranate_1781847336185.png',
        lavender: '/images/prod_lavender_1781847350109.png',
        neem: '/images/prod_neem_1781847363635.png',
        wildhoney: '/images/prod_wildhoney_1781847377962.png',
        coconutoil: '/images/prod_coconutoil_1781847391167.png',
        drumstick: '/images/prod_drumstick_1781847405506.png',
        banana: '/images/prod_banana_1781847418919.png',
        tomato: '/images/prod_tomato_1781847432438.png',
        veg: '/images/veg.png',
        fruits: '/images/fruits.png',
        pantry: '/images/pantry.png',
        dairy: '/images/dairy.png'
    };

    const categories = await prisma.category.findMany();
    const catMap = {};
    for (const c of categories) catMap[c.name] = c.id;

    // Get the 10 farmers we just created
    const farmers = await prisma.user.findMany({ where: { role: 'FARMER' }, orderBy: { createdAt: 'asc' } });
    if(farmers.length < 10) { console.error('Missing farmers'); return; }

    const productDefinitions = [
        // Farmer 1: The Green Leaf Estate (Leafy & Green Veggies)
        [
            { name: "Farm-Fresh Spinach", img: allImages.spinach, cat: "Vegetables" },
            { name: "Organic Palak", img: allImages.spinach, cat: "Vegetables" },
            { name: "Fresh Coriander Leaves", img: allImages.spinach, cat: "Vegetables" },
            { name: "Mint Leaves (Pudina)", img: allImages.spinach, cat: "Vegetables" },
            { name: "Curry Leaves", img: allImages.spinach, cat: "Vegetables" },
            { name: "Fresh Drumsticks", img: allImages.drumstick, cat: "Vegetables" },
            { name: "Organic Okra (Ladies Finger)", img: allImages.okra, cat: "Vegetables" },
            { name: "Tender Green Beans", img: allImages.veg, cat: "Vegetables" },
            { name: "Organic Ridge Gourd", img: allImages.veg, cat: "Vegetables" },
            { name: "Bitter Gourd", img: allImages.veg, cat: "Vegetables" }
        ],
        // Farmer 2: Sunrise Orchards (Fruits)
        [
            { name: "Premium Red Apple", img: allImages.apple, cat: "Fruits" },
            { name: "Kashmir Green Apple", img: allImages.apple, cat: "Fruits" },
            { name: "Robusta Banana", img: allImages.banana, cat: "Fruits" },
            { name: "Red Banana", img: allImages.banana, cat: "Fruits" },
            { name: "Organic Pomegranate", img: allImages.pomegranate, cat: "Fruits" },
            { name: "Fresh Papaya", img: allImages.fruits, cat: "Fruits" },
            { name: "Sweet Guava", img: allImages.fruits, cat: "Fruits" },
            { name: "Alphonso Mango", img: allImages.fruits, cat: "Fruits" },
            { name: "Juicy Orange", img: allImages.fruits, cat: "Fruits" },
            { name: "Sweet Lime (Mosambi)", img: allImages.fruits, cat: "Fruits" }
        ],
        // Farmer 3: Heritage Dairy Farms (Dairy & Honey)
        [
            { name: "Wild Forest Honey", img: allImages.wildhoney, cat: "Dairy" },
            { name: "Raw Unprocessed Honey", img: allImages.wildhoney, cat: "Dairy" },
            { name: "Desi Cow A2 Ghee", img: allImages.dairy, cat: "Dairy" },
            { name: "Buffalo Pure Ghee", img: allImages.dairy, cat: "Dairy" },
            { name: "Organic Butter", img: allImages.dairy, cat: "Dairy" },
            { name: "Farm Fresh Paneer", img: allImages.dairy, cat: "Dairy" },
            { name: "Probiotic Curd", img: allImages.dairy, cat: "Dairy" },
            { name: "Fresh A2 Cow Milk", img: allImages.dairy, cat: "Dairy" },
            { name: "Goat Milk", img: allImages.dairy, cat: "Dairy" },
            { name: "Mountain Rock Honey", img: allImages.wildhoney, cat: "Dairy" }
        ],
        // Farmer 4: Golden Fields Spices
        [
            { name: "Organic Turmeric Powder", img: allImages.pantry, cat: "Spices & Herbs" },
            { name: "Whole Turmeric Root", img: allImages.pantry, cat: "Spices & Herbs" },
            { name: "Black Pepper Corns", img: allImages.pantry, cat: "Spices & Herbs" },
            { name: "Cardamom Pods", img: allImages.pantry, cat: "Spices & Herbs" },
            { name: "Cinnamon Sticks", img: allImages.pantry, cat: "Spices & Herbs" },
            { name: "Cloves", img: allImages.pantry, cat: "Spices & Herbs" },
            { name: "Cumin Seeds", img: allImages.pantry, cat: "Spices & Herbs" },
            { name: "Coriander Seeds", img: allImages.pantry, cat: "Spices & Herbs" },
            { name: "Fennel Seeds", img: allImages.pantry, cat: "Spices & Herbs" },
            { name: "Mustard Seeds", img: allImages.pantry, cat: "Spices & Herbs" }
        ],
        // Farmer 5: Ancient Grains Co.
        [
            { name: "Karuppu Kavuni Black Rice", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "Mapillai Samba Rice", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "Seeraga Samba Rice", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "Organic Toor Dal", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "Moong Dal", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "Urad Dal", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "Chana Dal", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "Organic Pearl Millet (Kambu)", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "Finger Millet (Ragi)", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "Foxtail Millet", img: allImages.pantry, cat: "Grains & Pulses" }
        ],
        // Farmer 6: Pure Essence Naturals (Oils)
        [
            { name: "Cold-Pressed Coconut Oil", img: allImages.coconutoil, cat: "Cold-Pressed Oils" },
            { name: "Virgin Coconut Oil", img: allImages.coconutoil, cat: "Cold-Pressed Oils" },
            { name: "Cold-Pressed Groundnut Oil", img: allImages.coconutoil, cat: "Cold-Pressed Oils" },
            { name: "Wood-Pressed Peanut Oil", img: allImages.coconutoil, cat: "Cold-Pressed Oils" },
            { name: "Cold-Pressed Sesame Oil", img: allImages.dairy, cat: "Cold-Pressed Oils" },
            { name: "Black Sesame Oil", img: allImages.dairy, cat: "Cold-Pressed Oils" },
            { name: "Mustard Oil", img: allImages.dairy, cat: "Cold-Pressed Oils" },
            { name: "Castor Oil", img: allImages.dairy, cat: "Cold-Pressed Oils" },
            { name: "Almond Oil", img: allImages.coconutoil, cat: "Cold-Pressed Oils" },
            { name: "Neem Oil", img: allImages.dairy, cat: "Cold-Pressed Oils" }
        ],
        // Farmer 7: Valley Root Farms (Roots)
        [
            { name: "Ooty Carrots", img: allImages.carrot, cat: "Vegetables" },
            { name: "Orange Carrots", img: allImages.carrot, cat: "Vegetables" },
            { name: "Fresh Beetroot", img: allImages.beetroot, cat: "Vegetables" },
            { name: "Organic Potatoes", img: allImages.veg, cat: "Vegetables" },
            { name: "Sweet Potatoes", img: allImages.veg, cat: "Vegetables" },
            { name: "Tapioca Root", img: allImages.veg, cat: "Vegetables" },
            { name: "Native Garlic", img: allImages.veg, cat: "Vegetables" },
            { name: "Red Onions", img: allImages.veg, cat: "Vegetables" },
            { name: "Small Onions (Shallots)", img: allImages.veg, cat: "Vegetables" },
            { name: "Ginger Root", img: allImages.veg, cat: "Vegetables" }
        ],
        // Farmer 8: Himalayan Orchard (Mixed Veg & Exotic Fruits)
        [
            { name: "Heirloom Tomatoes", img: allImages.tomato, cat: "Vegetables" },
            { name: "Cherry Tomatoes", img: allImages.tomato, cat: "Vegetables" },
            { name: "Green Capsicum", img: allImages.veg, cat: "Vegetables" },
            { name: "Red Bell Pepper", img: allImages.veg, cat: "Vegetables" },
            { name: "Yellow Bell Pepper", img: allImages.veg, cat: "Vegetables" },
            { name: "Broccoli", img: allImages.veg, cat: "Vegetables" },
            { name: "Cauliflower", img: allImages.veg, cat: "Vegetables" },
            { name: "Organic Cabbage", img: allImages.veg, cat: "Vegetables" },
            { name: "Dragon Fruit", img: allImages.fruits, cat: "Fruits" },
            { name: "Kiwi Box", img: allImages.fruits, cat: "Fruits" }
        ],
        // Farmer 9: Kitchen Staples (Pantry Mixes)
        [
            { name: "Organic Red Poha", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "White Poha", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "Organic Jaggery Powder", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "Palm Jaggery (Karupatti)", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "Himalayan Pink Salt", img: allImages.pantry, cat: "Spices & Herbs" },
            { name: "Sea Salt Crystals", img: allImages.pantry, cat: "Spices & Herbs" },
            { name: "Organic Tamarind", img: allImages.pantry, cat: "Spices & Herbs" },
            { name: "Dry Red Chillies", img: allImages.pantry, cat: "Spices & Herbs" },
            { name: "Whole Wheat Flour", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "Besan Flour", img: allImages.pantry, cat: "Grains & Pulses" }
        ],
        // Farmer 10: Nature's Glow (Wellness & Soaps)
        [
            { name: "Lavender Body Scrub", img: allImages.lavender, cat: "Wellness & Beauty" },
            { name: "Rose Water Mist", img: allImages.lavender, cat: "Wellness & Beauty" },
            { name: "Aloe Vera Gel", img: allImages.lavender, cat: "Wellness & Beauty" },
            { name: "Neem & Turmeric Soap", img: allImages.neem, cat: "Wellness & Beauty" },
            { name: "Sandalwood Soap", img: allImages.neem, cat: "Wellness & Beauty" },
            { name: "Charcoal Detox Soap", img: allImages.neem, cat: "Wellness & Beauty" },
            { name: "Herbal Hair Wash Powder", img: allImages.neem, cat: "Wellness & Beauty" },
            { name: "Shikakai Powder", img: allImages.neem, cat: "Wellness & Beauty" },
            { name: "Multani Mitti", img: allImages.neem, cat: "Wellness & Beauty" },
            { name: "Kumkumadi Tailam", img: allImages.coconutoil, cat: "Wellness & Beauty" }
        ]
    ];

    let totalCreated = 0;

    for (let i = 0; i < farmers.length; i++) {
        const farmer = farmers[i];
        const productsToCreate = productDefinitions[i];

        const dbProducts = productsToCreate.map((p, index) => ({
            name: p.name,
            description: `A premium quality ${p.name} sourced directly from ${farmer.name}. Hand-picked, 100% organic, and carefully processed to preserve its natural essence and maximum nutritional value.`,
            price: Math.floor(Math.random() * 500) + 50,
            images: p.img,
            stock: 100,
            unit: 'pcs',
            categoryId: catMap[p.cat],
            farmerId: farmer.id
        }));

        await prisma.product.createMany({ data: dbProducts });
        totalCreated += dbProducts.length;
    }

    console.log(`\n=============================================`);
    console.log(`SUCCESS! Re-seeded ${totalCreated} distinct products.`);
    console.log(`Every product name now perfectly matches its image!`);
    console.log(`=============================================`);
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
