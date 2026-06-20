const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Generating 100 products with hyper-specific variations to flawlessly match our 17 ultra-premium AI images...');

    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});

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

    const farmers = await prisma.user.findMany({ where: { role: 'FARMER' }, orderBy: { createdAt: 'asc' } });
    
    const productDefinitions = [
        // Farmer 1: Root & Pod Specialists (Carrots, Beetroots, Okra)
        [
            { name: "Ooty Mountain Carrots", img: allImages.carrot, cat: "Vegetables" },
            { name: "Organic Red Carrots", img: allImages.carrot, cat: "Vegetables" },
            { name: "Baby Carrots (Farm Fresh)", img: allImages.carrot, cat: "Vegetables" },
            { name: "Winter Sweet Carrots", img: allImages.carrot, cat: "Vegetables" },
            { name: "Fresh Organic Beetroots", img: allImages.beetroot, cat: "Vegetables" },
            { name: "Dark Ruby Beetroots", img: allImages.beetroot, cat: "Vegetables" },
            { name: "Earth-Grown Beetroots", img: allImages.beetroot, cat: "Vegetables" },
            { name: "Tender Green Okra", img: allImages.okra, cat: "Vegetables" },
            { name: "Organic Ladies Finger", img: allImages.okra, cat: "Vegetables" },
            { name: "Farm-Fresh Okra Pods", img: allImages.okra, cat: "Vegetables" }
        ],
        // Farmer 2: Sunrise Orchards (Apple, Banana, Pomegranate)
        [
            { name: "Premium Kashmir Apple", img: allImages.apple, cat: "Fruits" },
            { name: "Organic Red Delicious Apple", img: allImages.apple, cat: "Fruits" },
            { name: "Farm-Fresh Royal Gala Apple", img: allImages.apple, cat: "Fruits" },
            { name: "Sweet Hill Apple", img: allImages.apple, cat: "Fruits" },
            { name: "Robusta Yellow Banana", img: allImages.banana, cat: "Fruits" },
            { name: "Organic Cavendish Banana", img: allImages.banana, cat: "Fruits" },
            { name: "Sweet Yellaki Banana", img: allImages.banana, cat: "Fruits" },
            { name: "Organic Red Pomegranate", img: allImages.pomegranate, cat: "Fruits" },
            { name: "Bhagwa Pomegranate", img: allImages.pomegranate, cat: "Fruits" },
            { name: "Ruby Sweet Pomegranate", img: allImages.pomegranate, cat: "Fruits" }
        ],
        // Farmer 3: Heritage Dairy Farms (Honey & Ghee)
        [
            { name: "Pure Wild Forest Honey", img: allImages.wildhoney, cat: "Dairy" },
            { name: "Raw Unprocessed Honey", img: allImages.wildhoney, cat: "Dairy" },
            { name: "Organic Mountain Honey", img: allImages.wildhoney, cat: "Dairy" },
            { name: "Natural Amber Honey", img: allImages.wildhoney, cat: "Dairy" },
            { name: "Golden Wildflower Honey", img: allImages.wildhoney, cat: "Dairy" },
            { name: "Desi Cow A2 Ghee", img: allImages.dairy, cat: "Dairy" },
            { name: "Traditional Bilona Ghee", img: allImages.dairy, cat: "Dairy" },
            { name: "Organic Cultured Ghee", img: allImages.dairy, cat: "Dairy" },
            { name: "Farm-Fresh A2 Ghee", img: allImages.dairy, cat: "Dairy" },
            { name: "Pure Buffalo Ghee", img: allImages.dairy, cat: "Dairy" }
        ],
        // Farmer 4: Valley Vine Farms (Tomatoes & Drumsticks)
        [
            { name: "Organic Heirloom Tomatoes", img: allImages.tomato, cat: "Vegetables" },
            { name: "Vine-Ripened Tomatoes", img: allImages.tomato, cat: "Vegetables" },
            { name: "Fresh Country Tomatoes", img: allImages.tomato, cat: "Vegetables" },
            { name: "Cherry Tomatoes on Vine", img: allImages.tomato, cat: "Vegetables" },
            { name: "Sweet Roma Tomatoes", img: allImages.tomato, cat: "Vegetables" },
            { name: "Fresh Organic Drumsticks", img: allImages.drumstick, cat: "Vegetables" },
            { name: "Tender Moringa Pods", img: allImages.drumstick, cat: "Vegetables" },
            { name: "Farm-Picked Drumsticks", img: allImages.drumstick, cat: "Vegetables" },
            { name: "Long Green Drumsticks", img: allImages.drumstick, cat: "Vegetables" },
            { name: "Organic Moringa Vegetables", img: allImages.drumstick, cat: "Vegetables" }
        ],
        // Farmer 5: The Green Leaf Estate (Spinach Focus)
        [
            { name: "Farm-Fresh Palak (Spinach)", img: allImages.spinach, cat: "Vegetables" },
            { name: "Organic Baby Spinach", img: allImages.spinach, cat: "Vegetables" },
            { name: "Dew-Kissed Spinach Leaves", img: allImages.spinach, cat: "Vegetables" },
            { name: "Tender Green Spinach", img: allImages.spinach, cat: "Vegetables" },
            { name: "Organic Malabar Spinach", img: allImages.spinach, cat: "Vegetables" },
            { name: "Freshly Harvested Palak", img: allImages.spinach, cat: "Vegetables" },
            { name: "Green Leafy Spinach Bunch", img: allImages.spinach, cat: "Vegetables" },
            { name: "Winter Grown Spinach", img: allImages.spinach, cat: "Vegetables" },
            { name: "Iron-Rich Organic Spinach", img: allImages.spinach, cat: "Vegetables" },
            { name: "Traditional Farm Spinach", img: allImages.spinach, cat: "Vegetables" }
        ],
        // Farmer 6: Pure Essence Naturals (Coconut Oil Focus)
        [
            { name: "Cold-Pressed Coconut Oil", img: allImages.coconutoil, cat: "Cold-Pressed Oils" },
            { name: "Extra Virgin Coconut Oil", img: allImages.coconutoil, cat: "Cold-Pressed Oils" },
            { name: "Wood-Pressed Coconut Oil", img: allImages.coconutoil, cat: "Cold-Pressed Oils" },
            { name: "Organic Cooking Coconut Oil", img: allImages.coconutoil, cat: "Cold-Pressed Oils" },
            { name: "Raw Unrefined Coconut Oil", img: allImages.coconutoil, cat: "Cold-Pressed Oils" },
            { name: "Premium Hair & Body Coconut Oil", img: allImages.coconutoil, cat: "Cold-Pressed Oils" },
            { name: "Traditional Mara Chekku Coconut Oil", img: allImages.coconutoil, cat: "Cold-Pressed Oils" },
            { name: "Farm Fresh Coconut Oil", img: allImages.coconutoil, cat: "Cold-Pressed Oils" },
            { name: "Edible Grade Coconut Oil", img: allImages.coconutoil, cat: "Cold-Pressed Oils" },
            { name: "100% Pure Coconut Oil", img: allImages.coconutoil, cat: "Cold-Pressed Oils" }
        ],
        // Farmer 7: Glow Apothecary (Lavender Spa Scrubs)
        [
            { name: "Organic Lavender Body Scrub", img: allImages.lavender, cat: "Wellness & Beauty" },
            { name: "Relaxing Lavender Bath Scrub", img: allImages.lavender, cat: "Wellness & Beauty" },
            { name: "Exfoliating Lavender Sea Salt Scrub", img: allImages.lavender, cat: "Wellness & Beauty" },
            { name: "Premium Lavender Spa Scrub", img: allImages.lavender, cat: "Wellness & Beauty" },
            { name: "Handcrafted Lavender Sugar Scrub", img: allImages.lavender, cat: "Wellness & Beauty" },
            { name: "Lavender & Oat Gentle Scrub", img: allImages.lavender, cat: "Wellness & Beauty" },
            { name: "Calming Lavender Polish", img: allImages.lavender, cat: "Wellness & Beauty" },
            { name: "Lavender Infused Salt Scrub", img: allImages.lavender, cat: "Wellness & Beauty" },
            { name: "Soothing Lavender Body Exfoliator", img: allImages.lavender, cat: "Wellness & Beauty" },
            { name: "Luxury Lavender Spa Treatment", img: allImages.lavender, cat: "Wellness & Beauty" }
        ],
        // Farmer 8: Herbals & Naturals (Neem & Turmeric Soaps)
        [
            { name: "Handmade Neem & Turmeric Soap", img: allImages.neem, cat: "Wellness & Beauty" },
            { name: "Organic Neem Turmeric Bar", img: allImages.neem, cat: "Wellness & Beauty" },
            { name: "Rustic Neem & Turmeric Body Soap", img: allImages.neem, cat: "Wellness & Beauty" },
            { name: "Cold-Pressed Neem & Turmeric Soap", img: allImages.neem, cat: "Wellness & Beauty" },
            { name: "Raw Turmeric & Neem Bath Bar", img: allImages.neem, cat: "Wellness & Beauty" },
            { name: "Antibacterial Neem Soap", img: allImages.neem, cat: "Wellness & Beauty" },
            { name: "Ayurvedic Neem Turmeric Soap", img: allImages.neem, cat: "Wellness & Beauty" },
            { name: "Natural Neem Leaf Soap Bar", img: allImages.neem, cat: "Wellness & Beauty" },
            { name: "Herbal Turmeric Cleansing Bar", img: allImages.neem, cat: "Wellness & Beauty" },
            { name: "Skin Healing Neem Turmeric Soap", img: allImages.neem, cat: "Wellness & Beauty" }
        ],
        // Farmer 9: Golden Fields Spices (Pantry Assortments)
        [
            { name: "Traditional Indian Spice Mix", img: allImages.pantry, cat: "Spices & Herbs" },
            { name: "Organic Grain Assortment", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "Mixed Organic Spices Board", img: allImages.pantry, cat: "Spices & Herbs" },
            { name: "Rustic Kitchen Staples", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "Farm Pantry Collection", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "Organic Whole Grains", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "Traditional Cooking Spices", img: allImages.pantry, cat: "Spices & Herbs" },
            { name: "Heritage Grain Selection", img: allImages.pantry, cat: "Grains & Pulses" },
            { name: "Aromatic Spice Blend", img: allImages.pantry, cat: "Spices & Herbs" },
            { name: "Organic Daily Staples Mix", img: allImages.pantry, cat: "Grains & Pulses" }
        ],
        // Farmer 10: Organic Assortments (Mixed Veg / Mixed Fruits Baskets)
        [
            { name: "Fresh Weekly Veggie Basket", img: allImages.veg, cat: "Vegetables" },
            { name: "Organic Mixed Vegetables Bumper", img: allImages.veg, cat: "Vegetables" },
            { name: "Daily Greens & Veg Assortment", img: allImages.veg, cat: "Vegetables" },
            { name: "Farm Fresh Veggie Collection", img: allImages.veg, cat: "Vegetables" },
            { name: "Family Veggie Combo", img: allImages.veg, cat: "Vegetables" },
            { name: "Premium Mixed Fruit Basket", img: allImages.fruits, cat: "Fruits" },
            { name: "Seasonal Organic Fruits Combo", img: allImages.fruits, cat: "Fruits" },
            { name: "Fresh Fruit Assortment", img: allImages.fruits, cat: "Fruits" },
            { name: "Healthy Fruit Medley", img: allImages.fruits, cat: "Fruits" },
            { name: "Orchard Harvest Fruit Box", img: allImages.fruits, cat: "Fruits" }
        ]
    ];

    for (let i = 0; i < farmers.length; i++) {
        const farmer = farmers[i];
        const productsToCreate = productDefinitions[i];

        const dbProducts = productsToCreate.map((p) => ({
            name: p.name,
            description: `A premium quality ${p.name}. Hand-picked, 100% organic, and carefully processed to preserve its natural essence.`,
            price: Math.floor(Math.random() * 500) + 50,
            images: p.img,
            stock: 100,
            unit: 'pcs',
            categoryId: catMap[p.cat],
            farmerId: farmer.id
        }));

        await prisma.product.createMany({ data: dbProducts });
    }

    console.log(`SUCCESS! 100 Products recreated. Every single product name is now an exact, hyper-relevant description of its image!`);
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
