const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const imagesDir = path.join(__dirname, 'public', 'images', 'products');
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

async function downloadImage(url, filepath) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
        const res = await fetch(url, { signal: controller.signal, redirect: 'follow' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length < 5000) throw new Error('Image too small, likely a placeholder');
        fs.writeFileSync(filepath, buf);
        return true;
    } catch (e) {
        return false;
    } finally {
        clearTimeout(timeout);
    }
}

// Each entry: { name, terms } — terms is a VERY specific Flickr tag search
// loremflickr.com uses real Flickr photo tags, so specific terms = correct images
const PRODUCTS = [
    // Farmer 1: Root & Pod Specialists
    { name: "Ooty Mountain Carrots",              terms: "carrot,vegetable,organic" },
    { name: "Organic Red Carrots",                terms: "red,carrot,fresh" },
    { name: "Baby Carrots (Farm Fresh)",          terms: "baby,carrot,farm" },
    { name: "Winter Sweet Carrots",               terms: "carrot,winter,harvest" },
    { name: "Fresh Organic Beetroots",            terms: "beetroot,fresh,organic" },
    { name: "Dark Ruby Beetroots",                terms: "beet,vegetable,dark" },
    { name: "Earth-Grown Beetroots",              terms: "beetroot,earth,vegetable" },
    { name: "Tender Green Okra",                  terms: "okra,green,vegetable" },
    { name: "Organic Ladies Finger",              terms: "okra,ladies,finger,vegetable" },
    { name: "Farm-Fresh Okra Pods",               terms: "okra,pod,farm" },
    // Farmer 2: Sunrise Orchards
    { name: "Premium Kashmir Apple",              terms: "apple,red,premium,fruit" },
    { name: "Organic Red Delicious Apple",        terms: "apple,red,delicious,organic" },
    { name: "Farm-Fresh Royal Gala Apple",        terms: "apple,gala,fresh,fruit" },
    { name: "Sweet Hill Apple",                   terms: "apple,orchard,hill,fruit" },
    { name: "Robusta Yellow Banana",              terms: "banana,yellow,fresh,fruit" },
    { name: "Organic Cavendish Banana",           terms: "banana,bunch,organic" },
    { name: "Sweet Yellaki Banana",               terms: "banana,ripe,tropical,fruit" },
    { name: "Organic Red Pomegranate",            terms: "pomegranate,red,fruit,organic" },
    { name: "Bhagwa Pomegranate",                 terms: "pomegranate,seeds,open,fruit" },
    { name: "Ruby Sweet Pomegranate",             terms: "pomegranate,ruby,sweet,fruit" },
    // Farmer 3: Heritage Dairy Farms
    { name: "Pure Wild Forest Honey",             terms: "honey,jar,wild,forest" },
    { name: "Raw Unprocessed Honey",              terms: "honey,raw,natural,jar" },
    { name: "Organic Mountain Honey",             terms: "honey,amber,mountain,organic" },
    { name: "Natural Amber Honey",                terms: "honey,amber,golden,drizzle" },
    { name: "Golden Wildflower Honey",            terms: "honey,wildflower,golden,spoon" },
    { name: "Desi Cow A2 Ghee",                   terms: "ghee,butter,jar,golden" },
    { name: "Traditional Bilona Ghee",            terms: "ghee,clarified,butter,indian" },
    { name: "Organic Cultured Ghee",              terms: "ghee,organic,jar,dairy" },
    { name: "Farm-Fresh A2 Ghee",                 terms: "ghee,cow,fresh,dairy" },
    { name: "Pure Buffalo Ghee",                  terms: "butter,ghee,pure,golden" },
    // Farmer 4: Valley Vine Farms
    { name: "Organic Heirloom Tomatoes",          terms: "tomato,heirloom,organic,vegetable" },
    { name: "Vine-Ripened Tomatoes",              terms: "tomato,vine,ripened,red" },
    { name: "Fresh Country Tomatoes",             terms: "tomato,fresh,country,farm" },
    { name: "Cherry Tomatoes on Vine",            terms: "cherry,tomato,vine,red" },
    { name: "Sweet Roma Tomatoes",                terms: "tomato,roma,sweet,red" },
    { name: "Fresh Organic Drumsticks",           terms: "drumstick,moringa,pods,green" },
    { name: "Tender Moringa Pods",                terms: "moringa,pods,green,organic" },
    { name: "Farm-Picked Drumsticks",             terms: "drumstick,vegetable,farm,green" },
    { name: "Long Green Drumsticks",              terms: "drumstick,long,green,pods" },
    { name: "Organic Moringa Vegetables",         terms: "moringa,vegetable,organic,health" },
    // Farmer 5: The Green Leaf Estate
    { name: "Farm-Fresh Palak (Spinach)",         terms: "spinach,fresh,leaves,farm" },
    { name: "Organic Baby Spinach",               terms: "baby,spinach,organic,green" },
    { name: "Dew-Kissed Spinach Leaves",          terms: "spinach,leaves,dew,water" },
    { name: "Tender Green Spinach",               terms: "spinach,tender,green,vegetable" },
    { name: "Organic Malabar Spinach",            terms: "spinach,malabar,organic,leaf" },
    { name: "Freshly Harvested Palak",            terms: "spinach,palak,harvest,green" },
    { name: "Green Leafy Spinach Bunch",          terms: "spinach,bunch,leafy,green" },
    { name: "Winter Grown Spinach",               terms: "spinach,winter,vegetable,leaf" },
    { name: "Iron-Rich Organic Spinach",          terms: "spinach,iron,organic,healthy" },
    { name: "Traditional Farm Spinach",           terms: "spinach,farm,traditional,fresh" },
    // Farmer 6: Pure Essence Naturals
    { name: "Cold-Pressed Coconut Oil",           terms: "coconut,oil,cold,pressed,bottle" },
    { name: "Extra Virgin Coconut Oil",           terms: "coconut,oil,virgin,glass,jar" },
    { name: "Wood-Pressed Coconut Oil",           terms: "coconut,oil,wood,pressed,organic" },
    { name: "Organic Cooking Coconut Oil",        terms: "coconut,oil,cooking,organic" },
    { name: "Raw Unrefined Coconut Oil",          terms: "coconut,oil,raw,unrefined" },
    { name: "Premium Hair & Body Coconut Oil",    terms: "coconut,oil,hair,beauty,bottle" },
    { name: "Traditional Mara Chekku Coconut Oil",terms: "coconut,oil,traditional,wooden" },
    { name: "Farm Fresh Coconut Oil",             terms: "coconut,oil,fresh,farm" },
    { name: "Edible Grade Coconut Oil",           terms: "coconut,oil,edible,grade" },
    { name: "100% Pure Coconut Oil",              terms: "coconut,oil,pure,premium" },
    // Farmer 7: Glow Apothecary
    { name: "Organic Lavender Body Scrub",        terms: "lavender,scrub,organic,spa,jar" },
    { name: "Relaxing Lavender Bath Scrub",       terms: "lavender,bath,scrub,relax" },
    { name: "Exfoliating Lavender Sea Salt Scrub",terms: "lavender,salt,scrub,exfoliate" },
    { name: "Premium Lavender Spa Scrub",         terms: "lavender,spa,premium,jar" },
    { name: "Handcrafted Lavender Sugar Scrub",   terms: "lavender,sugar,scrub,jar" },
    { name: "Lavender & Oat Gentle Scrub",        terms: "lavender,oat,gentle,scrub" },
    { name: "Calming Lavender Polish",            terms: "lavender,polish,calming,spa" },
    { name: "Lavender Infused Salt Scrub",        terms: "lavender,salt,infused,scrub" },
    { name: "Soothing Lavender Body Exfoliator",  terms: "lavender,body,exfoliator,spa" },
    { name: "Luxury Lavender Spa Treatment",      terms: "lavender,luxury,spa,flower" },
    // Farmer 8: Herbals & Naturals
    { name: "Handmade Neem & Turmeric Soap",      terms: "neem,turmeric,soap,handmade,bar" },
    { name: "Organic Neem Turmeric Bar",          terms: "neem,turmeric,soap,bar,organic" },
    { name: "Rustic Neem & Turmeric Body Soap",   terms: "neem,soap,rustic,herbal,bar" },
    { name: "Cold-Pressed Neem & Turmeric Soap",  terms: "turmeric,soap,herbal,yellow,bar" },
    { name: "Raw Turmeric & Neem Bath Bar",       terms: "turmeric,bath,soap,raw,bar" },
    { name: "Antibacterial Neem Soap",            terms: "neem,soap,antibacterial,herbal" },
    { name: "Ayurvedic Neem Turmeric Soap",       terms: "ayurvedic,soap,neem,herbal" },
    { name: "Natural Neem Leaf Soap Bar",         terms: "neem,leaf,soap,natural,bar" },
    { name: "Herbal Turmeric Cleansing Bar",      terms: "turmeric,herbal,cleansing,soap" },
    { name: "Skin Healing Neem Turmeric Soap",    terms: "herbal,soap,skin,healing,bar" },
    // Farmer 9: Golden Fields Spices
    { name: "Traditional Indian Spice Mix",       terms: "spice,indian,mix,colorful,bowl" },
    { name: "Organic Grain Assortment",           terms: "grain,organic,bowl,assortment" },
    { name: "Mixed Organic Spices Board",         terms: "spices,board,organic,colorful" },
    { name: "Rustic Kitchen Staples",             terms: "kitchen,staples,rustic,organic" },
    { name: "Farm Pantry Collection",             terms: "pantry,farm,collection,organic" },
    { name: "Organic Whole Grains",               terms: "whole,grain,organic,cereal,bowl" },
    { name: "Traditional Cooking Spices",         terms: "cooking,spices,traditional,indian" },
    { name: "Heritage Grain Selection",           terms: "heritage,grain,rice,organic,bowl" },
    { name: "Aromatic Spice Blend",               terms: "spice,blend,aromatic,colorful" },
    { name: "Organic Daily Staples Mix",          terms: "daily,staples,organic,food,bowl" },
    // Farmer 10: Organic Assortments
    { name: "Fresh Weekly Veggie Basket",         terms: "vegetable,basket,fresh,organic" },
    { name: "Organic Mixed Vegetables Bumper",    terms: "mixed,vegetables,organic,colorful" },
    { name: "Daily Greens & Veg Assortment",      terms: "greens,vegetable,assortment,fresh" },
    { name: "Farm Fresh Veggie Collection",       terms: "vegetable,collection,farm,fresh" },
    { name: "Family Veggie Combo",                terms: "vegetable,family,combo,colorful" },
    { name: "Premium Mixed Fruit Basket",         terms: "fruit,basket,mixed,colorful" },
    { name: "Seasonal Organic Fruits Combo",      terms: "seasonal,fruit,organic,combo" },
    { name: "Fresh Fruit Assortment",             terms: "fruit,assortment,fresh,colorful" },
    { name: "Healthy Fruit Medley",               terms: "fruit,medley,healthy,organic" },
    { name: "Orchard Harvest Fruit Box",          terms: "orchard,harvest,fruit,box,fresh" },
];

async function main() {
    console.log(`Downloading ${PRODUCTS.length} unique food photos from Flickr via loremflickr...`);
    console.log('This will take about 1-2 minutes. Please wait...\n');

    const products = await prisma.product.findMany();
    const nameToId = {};
    for (const p of products) nameToId[p.name] = p.id;

    let success = 0;
    let failed = 0;

    for (let i = 0; i < PRODUCTS.length; i++) {
        const { name, terms } = PRODUCTS[i];
        const productId = nameToId[name];
        if (!productId) { console.warn(`  ⚠ Product not found in DB: "${name}"`); continue; }

        const filename = `prod_${productId}.jpg`;
        const filepath = path.join(imagesDir, filename);
        const localPath = `/images/products/${filename}`;

        // Try up to 3 different seeds to ensure we get a real food photo
        let downloaded = false;
        for (let seed = i + 1; seed <= i + 3; seed++) {
            const url = `https://loremflickr.com/800/800/${terms}?lock=${seed * 37}`;
            downloaded = await downloadImage(url, filepath);
            if (downloaded) break;
            await new Promise(r => setTimeout(r, 500));
        }

        if (downloaded) {
            await prisma.product.update({ where: { id: productId }, data: { images: localPath } });
            success++;
            process.stdout.write(`\r  ✅ ${success}/${PRODUCTS.length} downloaded...`);
        } else {
            console.warn(`\n  ❌ Failed: "${name}"`);
            failed++;
        }

        // Polite delay between requests
        await new Promise(r => setTimeout(r, 300));
    }

    console.log(`\n\n====================================================`);
    console.log(`✅ Downloaded: ${success} | ❌ Failed: ${failed}`);
    console.log(`All images saved to /public/images/products/ and mapped in database.`);
    console.log(`====================================================`);
    console.log('Refresh http://localhost:3000/shop to see the new images!');
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error('\nScript error:', e.message); await prisma.$disconnect(); process.exit(1); });
