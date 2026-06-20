const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Maps each product name to a precise Unsplash search term.
// Using source.unsplash.com - no API key needed, each combination is a real photo.
// ?sig=N ensures each product gets a DIFFERENT photo even with the same search term.
const buildUrl = (query, sig) =>
    `https://source.unsplash.com/800x800/?${encodeURIComponent(query)}&sig=${sig}`;

// We assign a unique sig (1-99) per product so no two share the same image.
const PRODUCTS = [
    // === Farmer 1: Root & Pod Specialists ===
    { name: "Ooty Mountain Carrots",             query: "fresh carrot organic",       sig: 1  },
    { name: "Organic Red Carrots",               query: "red carrot vegetable",        sig: 2  },
    { name: "Baby Carrots (Farm Fresh)",         query: "baby carrot farm",            sig: 3  },
    { name: "Winter Sweet Carrots",              query: "carrot harvest winter",        sig: 4  },
    { name: "Fresh Organic Beetroots",           query: "fresh beetroot organic",       sig: 5  },
    { name: "Dark Ruby Beetroots",               query: "beet root dark ruby",          sig: 6  },
    { name: "Earth-Grown Beetroots",             query: "beetroot earth soil farm",     sig: 7  },
    { name: "Tender Green Okra",                 query: "okra ladies finger green",     sig: 8  },
    { name: "Organic Ladies Finger",             query: "okra organic fresh",           sig: 9  },
    { name: "Farm-Fresh Okra Pods",              query: "okra pods farm green",         sig: 10 },

    // === Farmer 2: Sunrise Orchards ===
    { name: "Premium Kashmir Apple",             query: "red apple organic premium",    sig: 11 },
    { name: "Organic Red Delicious Apple",       query: "red apple delicious fruit",    sig: 12 },
    { name: "Farm-Fresh Royal Gala Apple",       query: "gala apple fresh orchard",     sig: 13 },
    { name: "Sweet Hill Apple",                  query: "apple orchard hill fresh",     sig: 14 },
    { name: "Robusta Yellow Banana",             query: "yellow banana fresh organic",  sig: 15 },
    { name: "Organic Cavendish Banana",          query: "banana fruit tropical",        sig: 16 },
    { name: "Sweet Yellaki Banana",              query: "banana bunch market",          sig: 17 },
    { name: "Organic Red Pomegranate",           query: "pomegranate red fruit",        sig: 18 },
    { name: "Bhagwa Pomegranate",                query: "pomegranate seeds open",       sig: 19 },
    { name: "Ruby Sweet Pomegranate",            query: "pomegranate ruby organic",     sig: 20 },

    // === Farmer 3: Heritage Dairy Farms ===
    { name: "Pure Wild Forest Honey",            query: "honey jar wild forest",        sig: 21 },
    { name: "Raw Unprocessed Honey",             query: "honey raw natural jar",        sig: 22 },
    { name: "Organic Mountain Honey",            query: "honey mountain organic amber", sig: 23 },
    { name: "Natural Amber Honey",               query: "honey amber golden glass",     sig: 24 },
    { name: "Golden Wildflower Honey",           query: "honey wildflower golden",      sig: 25 },
    { name: "Desi Cow A2 Ghee",                  query: "ghee butter jar golden",       sig: 26 },
    { name: "Traditional Bilona Ghee",           query: "clarified butter ghee indian", sig: 27 },
    { name: "Organic Cultured Ghee",             query: "ghee organic jar farm",        sig: 28 },
    { name: "Farm-Fresh A2 Ghee",                query: "ghee a2 cow organic",          sig: 29 },
    { name: "Pure Buffalo Ghee",                 query: "butter ghee pure golden",      sig: 30 },

    // === Farmer 4: Valley Vine Farms ===
    { name: "Organic Heirloom Tomatoes",         query: "heirloom tomato organic",      sig: 31 },
    { name: "Vine-Ripened Tomatoes",             query: "tomato vine ripened red",       sig: 32 },
    { name: "Fresh Country Tomatoes",            query: "tomato fresh country farm",     sig: 33 },
    { name: "Cherry Tomatoes on Vine",           query: "cherry tomato vine red",        sig: 34 },
    { name: "Sweet Roma Tomatoes",               query: "roma tomato sweet red",         sig: 35 },
    { name: "Fresh Organic Drumsticks",          query: "drumstick moringa vegetable",   sig: 36 },
    { name: "Tender Moringa Pods",               query: "moringa pods green organic",    sig: 37 },
    { name: "Farm-Picked Drumsticks",            query: "drumstick green long farm",     sig: 38 },
    { name: "Long Green Drumsticks",             query: "moringa long green pods",       sig: 39 },
    { name: "Organic Moringa Vegetables",        query: "moringa organic health",        sig: 40 },

    // === Farmer 5: The Green Leaf Estate ===
    { name: "Farm-Fresh Palak (Spinach)",        query: "spinach fresh leaves farm",    sig: 41 },
    { name: "Organic Baby Spinach",              query: "baby spinach organic green",    sig: 42 },
    { name: "Dew-Kissed Spinach Leaves",         query: "spinach leaves dew water",     sig: 43 },
    { name: "Tender Green Spinach",              query: "spinach tender green leafy",    sig: 44 },
    { name: "Organic Malabar Spinach",           query: "spinach malabar organic",       sig: 45 },
    { name: "Freshly Harvested Palak",           query: "palak spinach harvest green",  sig: 46 },
    { name: "Green Leafy Spinach Bunch",         query: "spinach bunch leafy green",    sig: 47 },
    { name: "Winter Grown Spinach",              query: "spinach winter vegetable",      sig: 48 },
    { name: "Iron-Rich Organic Spinach",         query: "spinach iron rich organic",    sig: 49 },
    { name: "Traditional Farm Spinach",          query: "spinach farm traditional",      sig: 50 },

    // === Farmer 6: Pure Essence Naturals ===
    { name: "Cold-Pressed Coconut Oil",          query: "coconut oil cold pressed bottle", sig: 51 },
    { name: "Extra Virgin Coconut Oil",          query: "coconut oil virgin glass jar",    sig: 52 },
    { name: "Wood-Pressed Coconut Oil",          query: "coconut oil wood pressed",        sig: 53 },
    { name: "Organic Cooking Coconut Oil",       query: "coconut oil cooking organic",     sig: 54 },
    { name: "Raw Unrefined Coconut Oil",         query: "coconut oil raw unrefined",       sig: 55 },
    { name: "Premium Hair & Body Coconut Oil",   query: "coconut oil hair beauty",         sig: 56 },
    { name: "Traditional Mara Chekku Coconut Oil", query: "coconut oil traditional wooden", sig: 57 },
    { name: "Farm Fresh Coconut Oil",            query: "coconut fresh oil jar",           sig: 58 },
    { name: "Edible Grade Coconut Oil",          query: "coconut oil edible grade",        sig: 59 },
    { name: "100% Pure Coconut Oil",             query: "pure coconut oil premium",        sig: 60 },

    // === Farmer 7: Glow Apothecary ===
    { name: "Organic Lavender Body Scrub",       query: "lavender scrub organic spa",     sig: 61 },
    { name: "Relaxing Lavender Bath Scrub",      query: "lavender bath spa relax",        sig: 62 },
    { name: "Exfoliating Lavender Sea Salt Scrub", query: "lavender salt scrub spa",      sig: 63 },
    { name: "Premium Lavender Spa Scrub",        query: "lavender premium spa",           sig: 64 },
    { name: "Handcrafted Lavender Sugar Scrub",  query: "lavender sugar scrub jar",       sig: 65 },
    { name: "Lavender & Oat Gentle Scrub",       query: "lavender oat gentle scrub",      sig: 66 },
    { name: "Calming Lavender Polish",           query: "lavender polish calming",        sig: 67 },
    { name: "Lavender Infused Salt Scrub",       query: "lavender salt infused jar",      sig: 68 },
    { name: "Soothing Lavender Body Exfoliator", query: "lavender body exfoliator spa",   sig: 69 },
    { name: "Luxury Lavender Spa Treatment",     query: "lavender luxury spa",            sig: 70 },

    // === Farmer 8: Herbals & Naturals ===
    { name: "Handmade Neem & Turmeric Soap",     query: "neem turmeric soap handmade",   sig: 71 },
    { name: "Organic Neem Turmeric Bar",         query: "neem turmeric soap bar",         sig: 72 },
    { name: "Rustic Neem & Turmeric Body Soap",  query: "natural soap rustic herbs",      sig: 73 },
    { name: "Cold-Pressed Neem & Turmeric Soap", query: "herbal soap neem yellow",        sig: 74 },
    { name: "Raw Turmeric & Neem Bath Bar",      query: "turmeric soap bath bar",         sig: 75 },
    { name: "Antibacterial Neem Soap",           query: "neem soap antibacterial",        sig: 76 },
    { name: "Ayurvedic Neem Turmeric Soap",      query: "ayurvedic soap neem",            sig: 77 },
    { name: "Natural Neem Leaf Soap Bar",        query: "neem leaf soap natural",         sig: 78 },
    { name: "Herbal Turmeric Cleansing Bar",     query: "turmeric herbal cleansing soap", sig: 79 },
    { name: "Skin Healing Neem Turmeric Soap",   query: "herbal soap skin healing",       sig: 80 },

    // === Farmer 9: Golden Fields Spices ===
    { name: "Traditional Indian Spice Mix",      query: "indian spices colorful mix",    sig: 81 },
    { name: "Organic Grain Assortment",          query: "grain organic assortment bowl", sig: 82 },
    { name: "Mixed Organic Spices Board",        query: "spices board organic mix",      sig: 83 },
    { name: "Rustic Kitchen Staples",            query: "kitchen staples rustic organic", sig: 84 },
    { name: "Farm Pantry Collection",            query: "pantry collection farm organic", sig: 85 },
    { name: "Organic Whole Grains",              query: "whole grains organic cereal",   sig: 86 },
    { name: "Traditional Cooking Spices",        query: "cooking spices traditional",    sig: 87 },
    { name: "Heritage Grain Selection",          query: "heritage grain rice organic",   sig: 88 },
    { name: "Aromatic Spice Blend",              query: "spice blend aromatic kitchen",  sig: 89 },
    { name: "Organic Daily Staples Mix",         query: "daily staples organic food",    sig: 90 },

    // === Farmer 10: Organic Assortments ===
    { name: "Fresh Weekly Veggie Basket",        query: "vegetable basket fresh organic", sig: 91 },
    { name: "Organic Mixed Vegetables Bumper",   query: "mixed vegetables organic",       sig: 92 },
    { name: "Daily Greens & Veg Assortment",     query: "greens vegetable assortment",    sig: 93 },
    { name: "Farm Fresh Veggie Collection",      query: "farm fresh vegetable collection",sig: 94 },
    { name: "Family Veggie Combo",               query: "vegetable family combo",         sig: 95 },
    { name: "Premium Mixed Fruit Basket",        query: "fruit basket mixed premium",     sig: 96 },
    { name: "Seasonal Organic Fruits Combo",     query: "seasonal fruit organic combo",   sig: 97 },
    { name: "Fresh Fruit Assortment",            query: "fruit assortment fresh colorful",sig: 98 },
    { name: "Healthy Fruit Medley",              query: "fruit medley healthy organic",   sig: 99 },
    { name: "Orchard Harvest Fruit Box",         query: "orchard harvest fruit box",      sig: 100},
];

async function main() {
    console.log('Assigning 100 unique, product-relevant Unsplash images...');

    const lookup = {};
    for (const p of PRODUCTS) {
        lookup[p.name] = buildUrl(p.query, p.sig);
    }

    const products = await prisma.product.findMany();
    let matched = 0;
    let unmatched = [];

    for (const p of products) {
        const url = lookup[p.name];
        if (url) {
            await prisma.product.update({ where: { id: p.id }, data: { images: url } });
            matched++;
        } else {
            unmatched.push(p.name);
        }
    }

    if (unmatched.length > 0) {
        console.warn('\nUnmatched products (need manual mapping):');
        unmatched.forEach(n => console.warn(` - "${n}"`));
    }

    console.log(`\n====================================================`);
    console.log(`✅ SUCCESS! Assigned unique images to ${matched} products.`);
    if (unmatched.length > 0) console.log(`⚠️  ${unmatched.length} products had no match.`);
    console.log(`====================================================`);
    console.log('\nRefresh http://localhost:3000/shop to see 100 unique product images!');
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
