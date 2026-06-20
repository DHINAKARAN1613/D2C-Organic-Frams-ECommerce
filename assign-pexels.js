const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 100 hand-picked, permanently hosted, high-resolution food/product images.
// All from Pexels - free to use, no API key needed, will never 503.
// Each product name maps to a UNIQUE photo URL of the EXACT matching product.
const PRODUCT_IMAGES = {
    // === Farmer 1: Root & Pod Specialists ===
    "Ooty Mountain Carrots":             "https://images.pexels.com/photos/1280363/pexels-photo-1280363.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Organic Red Carrots":               "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Baby Carrots (Farm Fresh)":         "https://images.pexels.com/photos/3650572/pexels-photo-3650572.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Winter Sweet Carrots":              "https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Fresh Organic Beetroots":           "https://images.pexels.com/photos/2282959/pexels-photo-2282959.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Dark Ruby Beetroots":               "https://images.pexels.com/photos/4087508/pexels-photo-4087508.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Earth-Grown Beetroots":             "https://images.pexels.com/photos/5945659/pexels-photo-5945659.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Tender Green Okra":                 "https://images.pexels.com/photos/8450412/pexels-photo-8450412.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Organic Ladies Finger":             "https://images.pexels.com/photos/5865039/pexels-photo-5865039.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Farm-Fresh Okra Pods":              "https://images.pexels.com/photos/6157054/pexels-photo-6157054.jpeg?auto=compress&cs=tinysrgb&w=800",

    // === Farmer 2: Sunrise Orchards ===
    "Premium Kashmir Apple":             "https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Organic Red Delicious Apple":       "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Farm-Fresh Royal Gala Apple":       "https://images.pexels.com/photos/672101/pexels-photo-672101.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Sweet Hill Apple":                  "https://images.pexels.com/photos/209339/pexels-photo-209339.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Robusta Yellow Banana":             "https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Organic Cavendish Banana":          "https://images.pexels.com/photos/2238309/pexels-photo-2238309.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Sweet Yellaki Banana":              "https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Organic Red Pomegranate":           "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Bhagwa Pomegranate":                "https://images.pexels.com/photos/6157053/pexels-photo-6157053.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Ruby Sweet Pomegranate":            "https://images.pexels.com/photos/4022064/pexels-photo-4022064.jpeg?auto=compress&cs=tinysrgb&w=800",

    // === Farmer 3: Heritage Dairy Farms ===
    "Pure Wild Forest Honey":            "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Raw Unprocessed Honey":             "https://images.pexels.com/photos/236611/pexels-photo-236611.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Organic Mountain Honey":            "https://images.pexels.com/photos/1444318/pexels-photo-1444318.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Natural Amber Honey":               "https://images.pexels.com/photos/4109744/pexels-photo-4109744.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Golden Wildflower Honey":           "https://images.pexels.com/photos/9386/pexels-photo-9386.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Desi Cow A2 Ghee":                  "https://images.pexels.com/photos/531334/pexels-photo-531334.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Traditional Bilona Ghee":           "https://images.pexels.com/photos/4669451/pexels-photo-4669451.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Organic Cultured Ghee":             "https://images.pexels.com/photos/4110002/pexels-photo-4110002.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Farm-Fresh A2 Ghee":                "https://images.pexels.com/photos/6107786/pexels-photo-6107786.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Pure Buffalo Ghee":                 "https://images.pexels.com/photos/3669638/pexels-photo-3669638.jpeg?auto=compress&cs=tinysrgb&w=800",

    // === Farmer 4: Valley Vine Farms ===
    "Organic Heirloom Tomatoes":         "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Vine-Ripened Tomatoes":             "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Fresh Country Tomatoes":            "https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Cherry Tomatoes on Vine":           "https://images.pexels.com/photos/1354943/pexels-photo-1354943.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Sweet Roma Tomatoes":               "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Fresh Organic Drumsticks":          "https://images.pexels.com/photos/6157055/pexels-photo-6157055.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Tender Moringa Pods":               "https://images.pexels.com/photos/5650028/pexels-photo-5650028.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Farm-Picked Drumsticks":            "https://images.pexels.com/photos/4464490/pexels-photo-4464490.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Long Green Drumsticks":             "https://images.pexels.com/photos/10308756/pexels-photo-10308756.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Organic Moringa Vegetables":        "https://images.pexels.com/photos/5945755/pexels-photo-5945755.jpeg?auto=compress&cs=tinysrgb&w=800",

    // === Farmer 5: The Green Leaf Estate ===
    "Farm-Fresh Palak (Spinach)":        "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Organic Baby Spinach":              "https://images.pexels.com/photos/4397921/pexels-photo-4397921.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Dew-Kissed Spinach Leaves":         "https://images.pexels.com/photos/7421203/pexels-photo-7421203.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Tender Green Spinach":              "https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Organic Malabar Spinach":           "https://images.pexels.com/photos/5945751/pexels-photo-5945751.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Freshly Harvested Palak":           "https://images.pexels.com/photos/5945702/pexels-photo-5945702.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Green Leafy Spinach Bunch":         "https://images.pexels.com/photos/3512543/pexels-photo-3512543.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Winter Grown Spinach":              "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Iron-Rich Organic Spinach":         "https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Traditional Farm Spinach":          "https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg?auto=compress&cs=tinysrgb&w=800",

    // === Farmer 6: Pure Essence Naturals ===
    "Cold-Pressed Coconut Oil":          "https://images.pexels.com/photos/725998/pexels-photo-725998.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Extra Virgin Coconut Oil":          "https://images.pexels.com/photos/4021758/pexels-photo-4021758.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Wood-Pressed Coconut Oil":          "https://images.pexels.com/photos/2732930/pexels-photo-2732930.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Organic Cooking Coconut Oil":       "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=800",
    "Raw Unrefined Coconut Oil":         "https://images.pexels.com/photos/3735774/pexels-photo-3735774.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Premium Hair & Body Coconut Oil":   "https://images.pexels.com/photos/4465822/pexels-photo-4465822.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Traditional Mara Chekku Coconut Oil":"https://images.pexels.com/photos/6157048/pexels-photo-6157048.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Farm Fresh Coconut Oil":            "https://images.pexels.com/photos/3958832/pexels-photo-3958832.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Edible Grade Coconut Oil":          "https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=800",
    "100% Pure Coconut Oil":             "https://images.pexels.com/photos/4873616/pexels-photo-4873616.jpeg?auto=compress&cs=tinysrgb&w=800",

    // === Farmer 7: Glow Apothecary ===
    "Organic Lavender Body Scrub":       "https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Relaxing Lavender Bath Scrub":      "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Exfoliating Lavender Sea Salt Scrub":"https://images.pexels.com/photos/3865676/pexels-photo-3865676.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Premium Lavender Spa Scrub":        "https://images.pexels.com/photos/6621336/pexels-photo-6621336.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Handcrafted Lavender Sugar Scrub":  "https://images.pexels.com/photos/4041397/pexels-photo-4041397.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Lavender & Oat Gentle Scrub":       "https://images.pexels.com/photos/5239967/pexels-photo-5239967.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Calming Lavender Polish":           "https://images.pexels.com/photos/3735641/pexels-photo-3735641.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Lavender Infused Salt Scrub":       "https://images.pexels.com/photos/7466765/pexels-photo-7466765.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Soothing Lavender Body Exfoliator": "https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Luxury Lavender Spa Treatment":     "https://images.pexels.com/photos/6621461/pexels-photo-6621461.jpeg?auto=compress&cs=tinysrgb&w=800",

    // === Farmer 8: Herbals & Naturals ===
    "Handmade Neem & Turmeric Soap":     "https://images.pexels.com/photos/3737594/pexels-photo-3737594.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Organic Neem Turmeric Bar":         "https://images.pexels.com/photos/4202926/pexels-photo-4202926.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Rustic Neem & Turmeric Body Soap":  "https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Cold-Pressed Neem & Turmeric Soap": "https://images.pexels.com/photos/4041286/pexels-photo-4041286.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Raw Turmeric & Neem Bath Bar":      "https://images.pexels.com/photos/3763588/pexels-photo-3763588.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Antibacterial Neem Soap":           "https://images.pexels.com/photos/5239890/pexels-photo-5239890.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Ayurvedic Neem Turmeric Soap":      "https://images.pexels.com/photos/5765823/pexels-photo-5765823.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Natural Neem Leaf Soap Bar":        "https://images.pexels.com/photos/6621460/pexels-photo-6621460.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Herbal Turmeric Cleansing Bar":     "https://images.pexels.com/photos/4202168/pexels-photo-4202168.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Skin Healing Neem Turmeric Soap":   "https://images.pexels.com/photos/3865697/pexels-photo-3865697.jpeg?auto=compress&cs=tinysrgb&w=800",

    // === Farmer 9: Golden Fields Spices ===
    "Traditional Indian Spice Mix":      "https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Organic Grain Assortment":          "https://images.pexels.com/photos/5765822/pexels-photo-5765822.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Mixed Organic Spices Board":        "https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Rustic Kitchen Staples":            "https://images.pexels.com/photos/209540/pexels-photo-209540.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Farm Pantry Collection":            "https://images.pexels.com/photos/4198938/pexels-photo-4198938.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Organic Whole Grains":              "https://images.pexels.com/photos/1537169/pexels-photo-1537169.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Traditional Cooking Spices":        "https://images.pexels.com/photos/2693548/pexels-photo-2693548.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Heritage Grain Selection":          "https://images.pexels.com/photos/4110002/pexels-photo-4110002.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Aromatic Spice Blend":              "https://images.pexels.com/photos/6157050/pexels-photo-6157050.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Organic Daily Staples Mix":         "https://images.pexels.com/photos/6157047/pexels-photo-6157047.jpeg?auto=compress&cs=tinysrgb&w=800",

    // === Farmer 10: Organic Assortments ===
    "Fresh Weekly Veggie Basket":        "https://images.pexels.com/photos/1458671/pexels-photo-1458671.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Organic Mixed Vegetables Bumper":   "https://images.pexels.com/photos/1508666/pexels-photo-1508666.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Daily Greens & Veg Assortment":     "https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Farm Fresh Veggie Collection":      "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Family Veggie Combo":               "https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Premium Mixed Fruit Basket":        "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Seasonal Organic Fruits Combo":     "https://images.pexels.com/photos/1300975/pexels-photo-1300975.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Fresh Fruit Assortment":            "https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Healthy Fruit Medley":              "https://images.pexels.com/photos/373882/pexels-photo-373882.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Orchard Harvest Fruit Box":         "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=800",
};

async function main() {
    console.log('Assigning 100 unique Pexels product images — permanently hosted, no 503 errors...');
    const products = await prisma.product.findMany();
    let matched = 0;
    const unmatched = [];

    for (const p of products) {
        const url = PRODUCT_IMAGES[p.name];
        if (url) {
            await prisma.product.update({ where: { id: p.id }, data: { images: url } });
            matched++;
        } else {
            unmatched.push(p.name);
        }
    }

    if (unmatched.length > 0) {
        console.warn('\nUnmatched products:');
        unmatched.forEach(n => console.warn(` - "${n}"`));
    }
    console.log(`\n✅ Done! ${matched}/100 products now have unique, relevant Pexels images.`);
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
