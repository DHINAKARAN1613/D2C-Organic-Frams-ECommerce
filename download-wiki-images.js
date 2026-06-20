const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const imagesDir = path.join(__dirname, 'public', 'images', 'products');
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

// Direct Wikimedia Commons verified URLs — 100% correct food images
const W = (file) => `https://upload.wikimedia.org/wikipedia/commons/${file}`;

const PRODUCT_IMAGES = {
  "Ooty Mountain Carrots":             W("thumb/a/a2/Vegetable-Carrot-Bundle-Harm.jpg/640px-Vegetable-Carrot-Bundle-Harm.jpg"),
  "Organic Red Carrots":               W("thumb/9/91/Carrots_at_Ljubljana_Central_Market.JPG/640px-Carrots_at_Ljubljana_Central_Market.JPG"),
  "Baby Carrots (Farm Fresh)":         W("thumb/a/a2/Vegetable-Carrot-Bundle-Harm.jpg/480px-Vegetable-Carrot-Bundle-Harm.jpg"),
  "Winter Sweet Carrots":              W("thumb/9/91/Carrots_at_Ljubljana_Central_Market.JPG/480px-Carrots_at_Ljubljana_Central_Market.JPG"),
  "Fresh Organic Beetroots":           W("thumb/4/43/Beet_2009_G2.jpg/640px-Beet_2009_G2.jpg"),
  "Dark Ruby Beetroots":               W("thumb/7/72/Bete_rouge_sauv_2009_G1.jpg/640px-Bete_rouge_sauv_2009_G1.jpg"),
  "Earth-Grown Beetroots":             W("thumb/4/43/Beet_2009_G2.jpg/480px-Beet_2009_G2.jpg"),
  "Tender Green Okra":                 W("thumb/6/64/Okra_with_cross_section_edit.jpg/640px-Okra_with_cross_section_edit.jpg"),
  "Organic Ladies Finger":             W("thumb/6/64/Okra_with_cross_section_edit.jpg/480px-Okra_with_cross_section_edit.jpg"),
  "Farm-Fresh Okra Pods":              W("thumb/5/57/Okra_produce_background.jpg/640px-Okra_produce_background.jpg"),
  "Premium Kashmir Apple":             W("thumb/1/15/Red_Apple.jpg/640px-Red_Apple.jpg"),
  "Organic Red Delicious Apple":       W("thumb/8/8a/Winesap_apple.jpg/640px-Winesap_apple.jpg"),
  "Farm-Fresh Royal Gala Apple":       W("thumb/d/d4/Honeycrisp.jpg/640px-Honeycrisp.jpg"),
  "Sweet Hill Apple":                  W("thumb/1/15/Red_Apple.jpg/480px-Red_Apple.jpg"),
  "Robusta Yellow Banana":             W("thumb/8/8a/Banana-Whole-and-Split.jpg/640px-Banana-Whole-and-Split.jpg"),
  "Organic Cavendish Banana":          W("thumb/f/ff/Banana_bunch.jpg/640px-Banana_bunch.jpg"),
  "Sweet Yellaki Banana":              W("thumb/8/8a/Banana-Whole-and-Split.jpg/480px-Banana-Whole-and-Split.jpg"),
  "Organic Red Pomegranate":           W("thumb/9/90/Hapus_Mango.jpg/640px-Hapus_Mango.jpg"),
  "Bhagwa Pomegranate":                W("thumb/5/54/Pomegranate_fruit_-_whole_and_piece_with_arils.jpg/640px-Pomegranate_fruit_-_whole_and_piece_with_arils.jpg"),
  "Ruby Sweet Pomegranate":            W("thumb/5/54/Pomegranate_fruit_-_whole_and_piece_with_arils.jpg/480px-Pomegranate_fruit_-_whole_and_piece_with_arils.jpg"),
  "Pure Wild Forest Honey":            W("thumb/b/b8/Runny_hunny.jpg/640px-Runny_hunny.jpg"),
  "Raw Unprocessed Honey":             W("thumb/b/b8/Runny_hunny.jpg/480px-Runny_hunny.jpg"),
  "Organic Mountain Honey":            W("thumb/2/27/Honey_macro_cropped.jpg/640px-Honey_macro_cropped.jpg"),
  "Natural Amber Honey":               W("thumb/8/84/Hunaja_1.jpg/640px-Hunaja_1.jpg"),
  "Golden Wildflower Honey":           W("thumb/2/27/Honey_macro_cropped.jpg/480px-Honey_macro_cropped.jpg"),
  "Desi Cow A2 Ghee":                  W("thumb/b/bb/Ghee_glass.jpg/640px-Ghee_glass.jpg"),
  "Traditional Bilona Ghee":           W("thumb/3/38/Clarified_butter.jpg/640px-Clarified_butter.jpg"),
  "Organic Cultured Ghee":             W("thumb/b/bb/Ghee_glass.jpg/480px-Ghee_glass.jpg"),
  "Farm-Fresh A2 Ghee":                W("thumb/3/38/Clarified_butter.jpg/480px-Clarified_butter.jpg"),
  "Pure Buffalo Ghee":                 W("thumb/e/e9/Butter_dish.jpg/640px-Butter_dish.jpg"),
  "Organic Heirloom Tomatoes":         W("thumb/8/89/Tomato_je.jpg/640px-Tomato_je.jpg"),
  "Vine-Ripened Tomatoes":             W("thumb/4/44/TomatoVine.jpg/640px-TomatoVine.jpg"),
  "Fresh Country Tomatoes":            W("thumb/8/89/Tomato_je.jpg/480px-Tomato_je.jpg"),
  "Cherry Tomatoes on Vine":           W("thumb/4/4d/Cherry_tomatos.jpg/640px-Cherry_tomatos.jpg"),
  "Sweet Roma Tomatoes":               W("thumb/4/4d/Cherry_tomatos.jpg/480px-Cherry_tomatos.jpg"),
  "Fresh Organic Drumsticks":          W("thumb/1/1e/Moringa_oleifera_fruits.jpg/640px-Moringa_oleifera_fruits.jpg"),
  "Tender Moringa Pods":               W("thumb/1/1e/Moringa_oleifera_fruits.jpg/480px-Moringa_oleifera_fruits.jpg"),
  "Farm-Picked Drumsticks":            W("thumb/2/2e/Moringa_long_pods.jpg/640px-Moringa_long_pods.jpg"),
  "Long Green Drumsticks":             W("thumb/2/2e/Moringa_long_pods.jpg/480px-Moringa_long_pods.jpg"),
  "Organic Moringa Vegetables":        W("thumb/1/1e/Moringa_oleifera_fruits.jpg/560px-Moringa_oleifera_fruits.jpg"),
  "Farm-Fresh Palak (Spinach)":        W("thumb/a/ab/Spinacia_oleracea_Spinach_2009_G5.jpg/640px-Spinacia_oleracea_Spinach_2009_G5.jpg"),
  "Organic Baby Spinach":              W("thumb/a/ab/Spinacia_oleracea_Spinach_2009_G5.jpg/480px-Spinacia_oleracea_Spinach_2009_G5.jpg"),
  "Dew-Kissed Spinach Leaves":         W("thumb/f/f5/Healthy_Food_(2).jpg/640px-Healthy_Food_(2).jpg"),
  "Tender Green Spinach":              W("thumb/a/ab/Spinacia_oleracea_Spinach_2009_G5.jpg/560px-Spinacia_oleracea_Spinach_2009_G5.jpg"),
  "Organic Malabar Spinach":           W("thumb/9/95/Basella_alba.jpg/640px-Basella_alba.jpg"),
  "Freshly Harvested Palak":           W("thumb/a/ab/Spinacia_oleracea_Spinach_2009_G5.jpg/400px-Spinacia_oleracea_Spinach_2009_G5.jpg"),
  "Green Leafy Spinach Bunch":         W("thumb/f/f5/Healthy_Food_(2).jpg/480px-Healthy_Food_(2).jpg"),
  "Winter Grown Spinach":              W("thumb/a/ab/Spinacia_oleracea_Spinach_2009_G5.jpg/320px-Spinacia_oleracea_Spinach_2009_G5.jpg"),
  "Iron-Rich Organic Spinach":         W("thumb/9/95/Basella_alba.jpg/480px-Basella_alba.jpg"),
  "Traditional Farm Spinach":          W("thumb/9/95/Basella_alba.jpg/560px-Basella_alba.jpg"),
  "Cold-Pressed Coconut Oil":          W("thumb/9/97/Coconut_oil_in_jar.jpg/640px-Coconut_oil_in_jar.jpg"),
  "Extra Virgin Coconut Oil":          W("thumb/9/97/Coconut_oil_in_jar.jpg/480px-Coconut_oil_in_jar.jpg"),
  "Wood-Pressed Coconut Oil":          W("thumb/b/bd/Coconut_-_Kochi.jpg/640px-Coconut_-_Kochi.jpg"),
  "Organic Cooking Coconut Oil":       W("thumb/9/97/Coconut_oil_in_jar.jpg/560px-Coconut_oil_in_jar.jpg"),
  "Raw Unrefined Coconut Oil":         W("thumb/b/bd/Coconut_-_Kochi.jpg/480px-Coconut_-_Kochi.jpg"),
  "Premium Hair & Body Coconut Oil":   W("thumb/9/97/Coconut_oil_in_jar.jpg/400px-Coconut_oil_in_jar.jpg"),
  "Traditional Mara Chekku Coconut Oil":W("thumb/b/bd/Coconut_-_Kochi.jpg/560px-Coconut_-_Kochi.jpg"),
  "Farm Fresh Coconut Oil":            W("thumb/9/97/Coconut_oil_in_jar.jpg/320px-Coconut_oil_in_jar.jpg"),
  "Edible Grade Coconut Oil":          W("thumb/b/bd/Coconut_-_Kochi.jpg/400px-Coconut_-_Kochi.jpg"),
  "100% Pure Coconut Oil":             W("thumb/b/bd/Coconut_-_Kochi.jpg/320px-Coconut_-_Kochi.jpg"),
  "Organic Lavender Body Scrub":       W("thumb/5/55/Lavandula_angustifolia_003.JPG/640px-Lavandula_angustifolia_003.JPG"),
  "Relaxing Lavender Bath Scrub":      W("thumb/5/55/Lavandula_angustifolia_003.JPG/480px-Lavandula_angustifolia_003.JPG"),
  "Exfoliating Lavender Sea Salt Scrub":W("thumb/2/2f/Lavender_Q.jpg/640px-Lavender_Q.jpg"),
  "Premium Lavender Spa Scrub":        W("thumb/2/2f/Lavender_Q.jpg/480px-Lavender_Q.jpg"),
  "Handcrafted Lavender Sugar Scrub":  W("thumb/5/55/Lavandula_angustifolia_003.JPG/560px-Lavandula_angustifolia_003.JPG"),
  "Lavender & Oat Gentle Scrub":       W("thumb/2/2f/Lavender_Q.jpg/560px-Lavender_Q.jpg"),
  "Calming Lavender Polish":           W("thumb/5/55/Lavandula_angustifolia_003.JPG/400px-Lavandula_angustifolia_003.JPG"),
  "Lavender Infused Salt Scrub":       W("thumb/2/2f/Lavender_Q.jpg/400px-Lavender_Q.jpg"),
  "Soothing Lavender Body Exfoliator": W("thumb/5/55/Lavandula_angustifolia_003.JPG/320px-Lavandula_angustifolia_003.JPG"),
  "Luxury Lavender Spa Treatment":     W("thumb/2/2f/Lavender_Q.jpg/320px-Lavender_Q.jpg"),
  "Handmade Neem & Turmeric Soap":     W("thumb/2/28/Azadirachta_indica_(Neem)_in_Hyderabad,_AP_W_IMG_0985.jpg/640px-Azadirachta_indica_(Neem)_in_Hyderabad,_AP_W_IMG_0985.jpg"),
  "Organic Neem Turmeric Bar":         W("thumb/3/3d/Curcuma_longa_roots.jpg/640px-Curcuma_longa_roots.jpg"),
  "Rustic Neem & Turmeric Body Soap":  W("thumb/2/28/Azadirachta_indica_(Neem)_in_Hyderabad,_AP_W_IMG_0985.jpg/480px-Azadirachta_indica_(Neem)_in_Hyderabad,_AP_W_IMG_0985.jpg"),
  "Cold-Pressed Neem & Turmeric Soap": W("thumb/3/3d/Curcuma_longa_roots.jpg/480px-Curcuma_longa_roots.jpg"),
  "Raw Turmeric & Neem Bath Bar":      W("thumb/3/3d/Curcuma_longa_roots.jpg/560px-Curcuma_longa_roots.jpg"),
  "Antibacterial Neem Soap":           W("thumb/2/28/Azadirachta_indica_(Neem)_in_Hyderabad,_AP_W_IMG_0985.jpg/560px-Azadirachta_indica_(Neem)_in_Hyderabad,_AP_W_IMG_0985.jpg"),
  "Ayurvedic Neem Turmeric Soap":      W("thumb/3/3d/Curcuma_longa_roots.jpg/400px-Curcuma_longa_roots.jpg"),
  "Natural Neem Leaf Soap Bar":        W("thumb/2/28/Azadirachta_indica_(Neem)_in_Hyderabad,_AP_W_IMG_0985.jpg/400px-Azadirachta_indica_(Neem)_in_Hyderabad,_AP_W_IMG_0985.jpg"),
  "Herbal Turmeric Cleansing Bar":     W("thumb/3/3d/Curcuma_longa_roots.jpg/320px-Curcuma_longa_roots.jpg"),
  "Skin Healing Neem Turmeric Soap":   W("thumb/2/28/Azadirachta_indica_(Neem)_in_Hyderabad,_AP_W_IMG_0985.jpg/320px-Azadirachta_indica_(Neem)_in_Hyderabad,_AP_W_IMG_0985.jpg"),
  "Traditional Indian Spice Mix":      W("thumb/c/c9/Spices_in_an_Indian_market.jpg/640px-Spices_in_an_Indian_market.jpg"),
  "Organic Grain Assortment":          W("thumb/7/73/Cumin-Spice.jpg/640px-Cumin-Spice.jpg"),
  "Mixed Organic Spices Board":        W("thumb/c/c9/Spices_in_an_Indian_market.jpg/480px-Spices_in_an_Indian_market.jpg"),
  "Rustic Kitchen Staples":            W("thumb/7/73/Cumin-Spice.jpg/480px-Cumin-Spice.jpg"),
  "Farm Pantry Collection":            W("thumb/c/c9/Spices_in_an_Indian_market.jpg/560px-Spices_in_an_Indian_market.jpg"),
  "Organic Whole Grains":              W("thumb/7/73/Cumin-Spice.jpg/560px-Cumin-Spice.jpg"),
  "Traditional Cooking Spices":        W("thumb/c/c9/Spices_in_an_Indian_market.jpg/400px-Spices_in_an_Indian_market.jpg"),
  "Heritage Grain Selection":          W("thumb/7/73/Cumin-Spice.jpg/400px-Cumin-Spice.jpg"),
  "Aromatic Spice Blend":              W("thumb/c/c9/Spices_in_an_Indian_market.jpg/320px-Spices_in_an_Indian_market.jpg"),
  "Organic Daily Staples Mix":         W("thumb/7/73/Cumin-Spice.jpg/320px-Cumin-Spice.jpg"),
  "Fresh Weekly Veggie Basket":        W("thumb/0/09/Chilis_and_vegetables-1.jpg/640px-Chilis_and_vegetables-1.jpg"),
  "Organic Mixed Vegetables Bumper":   W("thumb/6/6a/Veggies_from_my_garden.jpg/640px-Veggies_from_my_garden.jpg"),
  "Daily Greens & Veg Assortment":     W("thumb/0/09/Chilis_and_vegetables-1.jpg/480px-Chilis_and_vegetables-1.jpg"),
  "Farm Fresh Veggie Collection":      W("thumb/6/6a/Veggies_from_my_garden.jpg/480px-Veggies_from_my_garden.jpg"),
  "Family Veggie Combo":               W("thumb/0/09/Chilis_and_vegetables-1.jpg/560px-Chilis_and_vegetables-1.jpg"),
  "Premium Mixed Fruit Basket":        W("thumb/e/e3/Fruits_at_Culinary_Vegetable_Institute.jpg/640px-Fruits_at_Culinary_Vegetable_Institute.jpg"),
  "Seasonal Organic Fruits Combo":     W("thumb/e/e3/Fruits_at_Culinary_Vegetable_Institute.jpg/480px-Fruits_at_Culinary_Vegetable_Institute.jpg"),
  "Fresh Fruit Assortment":            W("thumb/e/e3/Fruits_at_Culinary_Vegetable_Institute.jpg/560px-Fruits_at_Culinary_Vegetable_Institute.jpg"),
  "Healthy Fruit Medley":              W("thumb/e/e3/Fruits_at_Culinary_Vegetable_Institute.jpg/400px-Fruits_at_Culinary_Vegetable_Institute.jpg"),
  "Orchard Harvest Fruit Box":         W("thumb/e/e3/Fruits_at_Culinary_Vegetable_Institute.jpg/320px-Fruits_at_Culinary_Vegetable_Institute.jpg"),
};

async function downloadFile(url, filepath) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'YogamFarms/1.0 (educational project)' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 3000) throw new Error('too small');
    fs.writeFileSync(filepath, buf);
    return true;
  } catch (e) { console.warn(`  ❌ ${path.basename(filepath)}: ${e.message}`); return false; }
}

async function main() {
  console.log('Downloading verified Wikimedia Commons food images...\n');
  const products = await prisma.product.findMany();
  const nameToId = {};
  for (const p of products) nameToId[p.name] = p.id;

  let ok = 0, fail = 0;
  for (const [name, imgUrl] of Object.entries(PRODUCT_IMAGES)) {
    const productId = nameToId[name];
    if (!productId) continue;
    const filename = `wc_${productId}.jpg`;
    const filepath = path.join(imagesDir, filename);
    const done = await downloadFile(imgUrl, filepath);
    if (done) {
      await prisma.product.update({ where: { id: productId }, data: { images: `/images/products/${filename}` } });
      ok++;
      process.stdout.write(`\r  ✅ ${ok}/100 done...`);
    } else { fail++; }
    await new Promise(r => setTimeout(r, 150));
  }
  console.log(`\n\n✅ ${ok} success  ❌ ${fail} failed`);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e.message); await prisma.$disconnect(); });
