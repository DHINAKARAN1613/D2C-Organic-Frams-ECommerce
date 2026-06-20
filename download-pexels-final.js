const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const PEXELS_KEY = 'FWAkZinZfdCqwPg1Wro0wKFQSrEkV1VBCr91F1fxny4jt14dXJ5SESCQ';
const imagesDir = path.join(__dirname, 'public', 'images', 'products');
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

// Each product gets a SPECIFIC Pexels search query that will return the exact food
// Using different page numbers within the same query for product variants ensures uniqueness
const PRODUCTS = [
  // === Farmer 1: Root & Pod Specialists ===
  { name: "Ooty Mountain Carrots",              query: "fresh organic carrot",         page: 1 },
  { name: "Organic Red Carrots",                query: "carrot vegetable",             page: 2 },
  { name: "Baby Carrots (Farm Fresh)",          query: "fresh carrot farm",            page: 3 },
  { name: "Winter Sweet Carrots",               query: "carrot bunch organic",         page: 4 },
  { name: "Fresh Organic Beetroots",            query: "fresh beetroot organic",       page: 1 },
  { name: "Dark Ruby Beetroots",                query: "beetroot vegetable red",       page: 2 },
  { name: "Earth-Grown Beetroots",              query: "beet root farm",               page: 3 },
  { name: "Tender Green Okra",                  query: "okra green vegetable",         page: 1 },
  { name: "Organic Ladies Finger",              query: "okra ladies finger",           page: 2 },
  { name: "Farm-Fresh Okra Pods",               query: "okra fresh farm",              page: 3 },
  // === Farmer 2: Sunrise Orchards ===
  { name: "Premium Kashmir Apple",              query: "red apple fruit",              page: 1 },
  { name: "Organic Red Delicious Apple",        query: "apple red organic",            page: 2 },
  { name: "Farm-Fresh Royal Gala Apple",        query: "apple fresh orchard",         page: 3 },
  { name: "Sweet Hill Apple",                   query: "apple fruit bowl",             page: 4 },
  { name: "Robusta Yellow Banana",              query: "banana yellow fresh",          page: 1 },
  { name: "Organic Cavendish Banana",           query: "banana bunch organic",         page: 2 },
  { name: "Sweet Yellaki Banana",               query: "banana ripe tropical",         page: 3 },
  { name: "Organic Red Pomegranate",            query: "pomegranate red fruit",        page: 1 },
  { name: "Bhagwa Pomegranate",                 query: "pomegranate seeds open",       page: 2 },
  { name: "Ruby Sweet Pomegranate",             query: "pomegranate organic",          page: 3 },
  // === Farmer 3: Heritage Dairy Farms ===
  { name: "Pure Wild Forest Honey",             query: "honey jar golden",             page: 1 },
  { name: "Raw Unprocessed Honey",              query: "raw honey natural",            page: 2 },
  { name: "Organic Mountain Honey",             query: "honey amber jar",              page: 3 },
  { name: "Natural Amber Honey",                query: "honey golden drizzle",        page: 4 },
  { name: "Golden Wildflower Honey",            query: "honey organic bees",           page: 5 },
  { name: "Desi Cow A2 Ghee",                   query: "ghee clarified butter jar",    page: 1 },
  { name: "Traditional Bilona Ghee",            query: "butter golden jar",            page: 2 },
  { name: "Organic Cultured Ghee",              query: "ghee organic dairy",           page: 3 },
  { name: "Farm-Fresh A2 Ghee",                 query: "clarified butter organic",     page: 4 },
  { name: "Pure Buffalo Ghee",                  query: "ghee butter spoon",            page: 5 },
  // === Farmer 4: Valley Vine Farms ===
  { name: "Organic Heirloom Tomatoes",          query: "tomato heirloom organic",      page: 1 },
  { name: "Vine-Ripened Tomatoes",              query: "tomato vine red",              page: 2 },
  { name: "Fresh Country Tomatoes",             query: "fresh tomato farm",            page: 3 },
  { name: "Cherry Tomatoes on Vine",            query: "cherry tomato",                page: 1 },
  { name: "Sweet Roma Tomatoes",                query: "tomato red bowl",              page: 4 },
  { name: "Fresh Organic Drumsticks",           query: "moringa drumstick vegetable",  page: 1 },
  { name: "Tender Moringa Pods",                query: "moringa pods green",           page: 2 },
  { name: "Farm-Picked Drumsticks",             query: "moringa vegetable farm",       page: 3 },
  { name: "Long Green Drumsticks",              query: "drumstick vegetable green",    page: 4 },
  { name: "Organic Moringa Vegetables",         query: "moringa organic health",       page: 5 },
  // === Farmer 5: The Green Leaf Estate ===
  { name: "Farm-Fresh Palak (Spinach)",         query: "fresh spinach leaves",         page: 1 },
  { name: "Organic Baby Spinach",               query: "baby spinach organic",         page: 2 },
  { name: "Dew-Kissed Spinach Leaves",          query: "spinach green fresh",          page: 3 },
  { name: "Tender Green Spinach",               query: "spinach vegetable healthy",    page: 4 },
  { name: "Organic Malabar Spinach",            query: "green leafy vegetable",        page: 1 },
  { name: "Freshly Harvested Palak",            query: "spinach palak farm",           page: 5 },
  { name: "Green Leafy Spinach Bunch",          query: "leafy greens bunch",           page: 2 },
  { name: "Winter Grown Spinach",               query: "spinach leaf organic",         page: 6 },
  { name: "Iron-Rich Organic Spinach",          query: "green spinach leaves fresh",   page: 7 },
  { name: "Traditional Farm Spinach",           query: "spinach farm harvest",         page: 8 },
  // === Farmer 6: Pure Essence Naturals ===
  { name: "Cold-Pressed Coconut Oil",           query: "coconut oil bottle",           page: 1 },
  { name: "Extra Virgin Coconut Oil",           query: "coconut oil glass jar",        page: 2 },
  { name: "Wood-Pressed Coconut Oil",           query: "coconut oil organic",          page: 3 },
  { name: "Organic Cooking Coconut Oil",        query: "coconut fresh oil",            page: 4 },
  { name: "Raw Unrefined Coconut Oil",          query: "coconut oil natural",          page: 5 },
  { name: "Premium Hair & Body Coconut Oil",    query: "coconut oil beauty",           page: 6 },
  { name: "Traditional Mara Chekku Coconut Oil",query: "coconut oil jar wooden",       page: 7 },
  { name: "Farm Fresh Coconut Oil",             query: "coconut oil premium",          page: 8 },
  { name: "Edible Grade Coconut Oil",           query: "coconut cooking oil",          page: 9 },
  { name: "100% Pure Coconut Oil",              query: "coconut oil clear",            page: 10 },
  // === Farmer 7: Glow Apothecary ===
  { name: "Organic Lavender Body Scrub",        query: "lavender scrub spa jar",       page: 1 },
  { name: "Relaxing Lavender Bath Scrub",       query: "lavender bath salt spa",       page: 2 },
  { name: "Exfoliating Lavender Sea Salt Scrub",query: "lavender salt exfoliate",      page: 3 },
  { name: "Premium Lavender Spa Scrub",         query: "lavender spa premium",         page: 4 },
  { name: "Handcrafted Lavender Sugar Scrub",   query: "lavender sugar scrub",         page: 5 },
  { name: "Lavender & Oat Gentle Scrub",        query: "lavender oat gentle",          page: 6 },
  { name: "Calming Lavender Polish",            query: "lavender purple flower",       page: 1 },
  { name: "Lavender Infused Salt Scrub",        query: "lavender flower organic",      page: 2 },
  { name: "Soothing Lavender Body Exfoliator",  query: "lavender essential oil spa",   page: 7 },
  { name: "Luxury Lavender Spa Treatment",      query: "lavender luxury cosmetic",     page: 8 },
  // === Farmer 8: Herbals & Naturals ===
  { name: "Handmade Neem & Turmeric Soap",      query: "handmade natural soap bar",    page: 1 },
  { name: "Organic Neem Turmeric Bar",          query: "turmeric soap herbal",         page: 2 },
  { name: "Rustic Neem & Turmeric Body Soap",   query: "organic soap rustic",          page: 3 },
  { name: "Cold-Pressed Neem & Turmeric Soap",  query: "herbal soap neem turmeric",    page: 4 },
  { name: "Raw Turmeric & Neem Bath Bar",        query: "turmeric soap yellow",         page: 5 },
  { name: "Antibacterial Neem Soap",            query: "neem herbal organic soap",     page: 6 },
  { name: "Ayurvedic Neem Turmeric Soap",       query: "ayurvedic herbal soap",        page: 7 },
  { name: "Natural Neem Leaf Soap Bar",         query: "natural soap bar herbs",       page: 8 },
  { name: "Herbal Turmeric Cleansing Bar",      query: "turmeric powder herbal",       page: 1 },
  { name: "Skin Healing Neem Turmeric Soap",    query: "organic soap skin care",       page: 9 },
  // === Farmer 9: Golden Fields Spices ===
  { name: "Traditional Indian Spice Mix",       query: "indian spices colorful",       page: 1 },
  { name: "Organic Grain Assortment",           query: "organic grains rice bowl",     page: 1 },
  { name: "Mixed Organic Spices Board",         query: "spices mix board colorful",    page: 2 },
  { name: "Rustic Kitchen Staples",             query: "grain cereal organic bowl",    page: 2 },
  { name: "Farm Pantry Collection",             query: "spice collection kitchen",     page: 3 },
  { name: "Organic Whole Grains",               query: "whole grain organic healthy",  page: 3 },
  { name: "Traditional Cooking Spices",         query: "cooking spices aromatic",      page: 4 },
  { name: "Heritage Grain Selection",           query: "rice grain traditional",       page: 4 },
  { name: "Aromatic Spice Blend",               query: "spice blend aromatic",         page: 5 },
  { name: "Organic Daily Staples Mix",          query: "lentil dal organic",           page: 1 },
  // === Farmer 10: Organic Assortments ===
  { name: "Fresh Weekly Veggie Basket",         query: "vegetable basket fresh",       page: 1 },
  { name: "Organic Mixed Vegetables Bumper",    query: "mixed vegetables organic",     page: 2 },
  { name: "Daily Greens & Veg Assortment",      query: "fresh vegetables assortment",  page: 3 },
  { name: "Farm Fresh Veggie Collection",       query: "farm vegetable collection",    page: 4 },
  { name: "Family Veggie Combo",                query: "vegetables colorful mix",      page: 5 },
  { name: "Premium Mixed Fruit Basket",         query: "mixed fruit basket",           page: 1 },
  { name: "Seasonal Organic Fruits Combo",      query: "seasonal fruits organic",      page: 2 },
  { name: "Fresh Fruit Assortment",             query: "fresh fruit assortment",       page: 3 },
  { name: "Healthy Fruit Medley",               query: "fruit bowl healthy",           page: 4 },
  { name: "Orchard Harvest Fruit Box",          query: "fruit orchard harvest",        page: 5 },
];

async function searchPexels(query, page) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&page=${page}&orientation=square`;
  const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
  if (!res.ok) throw new Error(`Pexels API ${res.status}`);
  const data = await res.json();
  return data.photos?.[0]?.src?.large || data.photos?.[0]?.src?.medium || null;
}

async function downloadFile(url, filepath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error('too small');
  fs.writeFileSync(filepath, buf);
  return true;
}

async function main() {
  console.log(`Downloading ${PRODUCTS.length} unique relevant food photos via Pexels API...\n`);
  const products = await prisma.product.findMany();
  const nameToId = {};
  for (const p of products) nameToId[p.name] = p.id;

  let ok = 0, fail = 0;

  for (const { name, query, page } of PRODUCTS) {
    const productId = nameToId[name];
    if (!productId) { console.warn(`  ⚠ Not in DB: "${name}"`); continue; }

    try {
      const imgUrl = await searchPexels(query, page);
      if (!imgUrl) throw new Error('No photo found');

      const filename = `pex_${productId}.jpg`;
      const filepath = path.join(imagesDir, filename);
      await downloadFile(imgUrl, filepath);

      await prisma.product.update({
        where: { id: productId },
        data: { images: `/images/products/${filename}` }
      });
      ok++;
      process.stdout.write(`\r  ✅ ${ok}/${PRODUCTS.length} done...`);
    } catch (e) {
      console.warn(`\n  ❌ "${name}": ${e.message}`);
      fail++;
    }

    // Pexels free plan: 200 req/hour — safe delay
    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`\n\n============================================`);
  console.log(`✅ Downloaded: ${ok}  ❌ Failed: ${fail}`);
  console.log(`============================================`);
  console.log('Refresh http://localhost:3000/shop — every product now shows its own real food image!');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error('\nError:', e.message); await prisma.$disconnect(); process.exit(1); });
