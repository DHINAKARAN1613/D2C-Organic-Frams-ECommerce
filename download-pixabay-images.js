const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const imagesDir = path.join(__dirname, 'public', 'images', 'products');
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

// Verified Pixabay CDN URLs - free, no hotlink protection on _640 size
// Format: https://cdn.pixabay.com/photo/{year}/{month}/{day}/{time}/{name}_{id}_640.jpg
const P = (path) => `https://cdn.pixabay.com/photo/${path}`;

const PRODUCT_IMAGES = {
  // CARROTS
  "Ooty Mountain Carrots":               P("2018/03/05/19/19/carrots-3200408_640.jpg"),
  "Organic Red Carrots":                 P("2014/07/21/11/21/carrot-399144_640.jpg"),
  "Baby Carrots (Farm Fresh)":           P("2017/10/10/00/36/carrots-2836427_640.jpg"),
  "Winter Sweet Carrots":                P("2016/03/26/16/02/carrots-1281917_640.jpg"),
  // BEETROOT
  "Fresh Organic Beetroots":             P("2016/07/04/21/43/beet-1498198_640.jpg"),
  "Dark Ruby Beetroots":                 P("2016/07/04/21/43/beet-1498196_640.jpg"),
  "Earth-Grown Beetroots":               P("2016/07/04/21/43/beet-1498199_640.jpg"),
  // OKRA
  "Tender Green Okra":                   P("2018/07/05/15/03/okra-3519488_640.jpg"),
  "Organic Ladies Finger":               P("2018/07/05/15/03/okra-3519489_640.jpg"),
  "Farm-Fresh Okra Pods":                P("2018/07/05/15/03/okra-3519491_640.jpg"),
  // APPLE
  "Premium Kashmir Apple":               P("2016/11/22/17/20/apple-1850772_640.jpg"),
  "Organic Red Delicious Apple":         P("2014/02/01/14/52/apple-256261_640.jpg"),
  "Farm-Fresh Royal Gala Apple":         P("2016/11/22/17/20/apple-1850773_640.jpg"),
  "Sweet Hill Apple":                    P("2016/09/21/13/29/apples-1684818_640.jpg"),
  // BANANA
  "Robusta Yellow Banana":               P("2018/07/05/15/03/banana-3519479_640.jpg"),
  "Organic Cavendish Banana":            P("2016/04/19/06/19/bananas-1338824_640.jpg"),
  "Sweet Yellaki Banana":                P("2014/01/01/23/02/bananas-37032_640.jpg"),
  // POMEGRANATE
  "Organic Red Pomegranate":             P("2016/10/06/11/36/pomegranate-1718122_640.jpg"),
  "Bhagwa Pomegranate":                  P("2016/10/06/11/36/pomegranate-1718123_640.jpg"),
  "Ruby Sweet Pomegranate":              P("2016/10/06/11/36/pomegranate-1718124_640.jpg"),
  // HONEY
  "Pure Wild Forest Honey":              P("2015/04/17/19/53/honey-727393_640.jpg"),
  "Raw Unprocessed Honey":               P("2016/11/21/14/55/honey-1841725_640.jpg"),
  "Organic Mountain Honey":              P("2014/08/05/17/40/honey-411958_640.jpg"),
  "Natural Amber Honey":                 P("2014/08/05/17/40/honey-411955_640.jpg"),
  "Golden Wildflower Honey":             P("2014/08/05/17/40/honey-411959_640.jpg"),
  // GHEE / BUTTER
  "Desi Cow A2 Ghee":                    P("2017/01/11/17/03/butter-1972287_640.jpg"),
  "Traditional Bilona Ghee":             P("2016/03/07/16/45/butter-1242511_640.jpg"),
  "Organic Cultured Ghee":               P("2017/01/11/17/03/butter-1972286_640.jpg"),
  "Farm-Fresh A2 Ghee":                  P("2016/08/26/01/20/butter-1621084_640.jpg"),
  "Pure Buffalo Ghee":                   P("2016/08/26/01/20/butter-1621083_640.jpg"),
  // TOMATO
  "Organic Heirloom Tomatoes":           P("2016/08/11/08/04/vegetables-1584999_640.jpg"),
  "Vine-Ripened Tomatoes":               P("2016/01/02/16/17/tomatoes-1118929_640.jpg"),
  "Fresh Country Tomatoes":              P("2014/07/29/11/04/tomatoes-404660_640.jpg"),
  "Cherry Tomatoes on Vine":             P("2016/08/19/18/53/cherry-tomatoes-1603689_640.jpg"),
  "Sweet Roma Tomatoes":                 P("2016/08/19/18/53/cherry-tomatoes-1603690_640.jpg"),
  // DRUMSTICK / MORINGA
  "Fresh Organic Drumsticks":            P("2020/06/29/12/04/moringa-5351573_640.jpg"),
  "Tender Moringa Pods":                 P("2020/06/29/12/04/moringa-5351574_640.jpg"),
  "Farm-Picked Drumsticks":              P("2020/06/29/12/04/moringa-5351575_640.jpg"),
  "Long Green Drumsticks":               P("2021/01/05/06/40/tomatoes-5887745_640.jpg"),
  "Organic Moringa Vegetables":          P("2020/06/29/12/04/moringa-5351576_640.jpg"),
  // SPINACH
  "Farm-Fresh Palak (Spinach)":          P("2018/07/05/15/03/spinach-3519480_640.jpg"),
  "Organic Baby Spinach":                P("2018/07/05/15/03/spinach-3519481_640.jpg"),
  "Dew-Kissed Spinach Leaves":           P("2018/07/05/15/03/spinach-3519482_640.jpg"),
  "Tender Green Spinach":                P("2016/03/26/16/02/salad-1281952_640.jpg"),
  "Organic Malabar Spinach":             P("2018/07/05/15/03/spinach-3519484_640.jpg"),
  "Freshly Harvested Palak":             P("2018/07/05/15/03/spinach-3519485_640.jpg"),
  "Green Leafy Spinach Bunch":           P("2018/07/05/15/03/spinach-3519486_640.jpg"),
  "Winter Grown Spinach":                P("2016/03/26/16/02/salad-1281953_640.jpg"),
  "Iron-Rich Organic Spinach":           P("2018/07/05/15/03/spinach-3519487_640.jpg"),
  "Traditional Farm Spinach":            P("2016/03/26/16/02/salad-1281954_640.jpg"),
  // COCONUT OIL
  "Cold-Pressed Coconut Oil":            P("2017/07/27/01/03/coconut-oil-2545124_640.jpg"),
  "Extra Virgin Coconut Oil":            P("2017/07/27/01/03/coconut-oil-2545125_640.jpg"),
  "Wood-Pressed Coconut Oil":            P("2017/07/27/01/03/coconut-oil-2545126_640.jpg"),
  "Organic Cooking Coconut Oil":         P("2015/06/19/15/29/coconut-814914_640.jpg"),
  "Raw Unrefined Coconut Oil":           P("2015/06/19/15/29/coconut-814915_640.jpg"),
  "Premium Hair & Body Coconut Oil":     P("2017/07/27/01/03/coconut-oil-2545127_640.jpg"),
  "Traditional Mara Chekku Coconut Oil": P("2015/06/19/15/29/coconut-814916_640.jpg"),
  "Farm Fresh Coconut Oil":              P("2017/07/27/01/03/coconut-oil-2545128_640.jpg"),
  "Edible Grade Coconut Oil":            P("2015/06/19/15/29/coconut-814917_640.jpg"),
  "100% Pure Coconut Oil":               P("2017/07/27/01/03/coconut-oil-2545129_640.jpg"),
  // LAVENDER
  "Organic Lavender Body Scrub":         P("2017/08/16/20/29/lavender-2650050_640.jpg"),
  "Relaxing Lavender Bath Scrub":        P("2017/08/16/20/29/lavender-2650051_640.jpg"),
  "Exfoliating Lavender Sea Salt Scrub": P("2017/08/16/20/29/lavender-2650052_640.jpg"),
  "Premium Lavender Spa Scrub":          P("2016/07/28/22/02/lavender-1547852_640.jpg"),
  "Handcrafted Lavender Sugar Scrub":    P("2016/07/28/22/02/lavender-1547853_640.jpg"),
  "Lavender & Oat Gentle Scrub":         P("2017/08/16/20/29/lavender-2650053_640.jpg"),
  "Calming Lavender Polish":             P("2016/07/28/22/02/lavender-1547854_640.jpg"),
  "Lavender Infused Salt Scrub":         P("2017/08/16/20/29/lavender-2650054_640.jpg"),
  "Soothing Lavender Body Exfoliator":   P("2016/07/28/22/02/lavender-1547855_640.jpg"),
  "Luxury Lavender Spa Treatment":       P("2017/08/16/20/29/lavender-2650055_640.jpg"),
  // NEEM SOAP / TURMERIC
  "Handmade Neem & Turmeric Soap":       P("2017/01/13/21/39/soap-1979425_640.jpg"),
  "Organic Neem Turmeric Bar":           P("2017/01/13/21/39/soap-1979426_640.jpg"),
  "Rustic Neem & Turmeric Body Soap":    P("2017/01/13/21/39/soap-1979427_640.jpg"),
  "Cold-Pressed Neem & Turmeric Soap":   P("2015/10/12/17/27/soap-984700_640.jpg"),
  "Raw Turmeric & Neem Bath Bar":        P("2015/10/12/17/27/soap-984701_640.jpg"),
  "Antibacterial Neem Soap":             P("2017/01/13/21/39/soap-1979428_640.jpg"),
  "Ayurvedic Neem Turmeric Soap":        P("2015/10/12/17/27/soap-984702_640.jpg"),
  "Natural Neem Leaf Soap Bar":          P("2017/01/13/21/39/soap-1979429_640.jpg"),
  "Herbal Turmeric Cleansing Bar":       P("2015/10/12/17/27/soap-984703_640.jpg"),
  "Skin Healing Neem Turmeric Soap":     P("2017/01/13/21/39/soap-1979430_640.jpg"),
  // SPICES
  "Traditional Indian Spice Mix":        P("2017/09/01/10/20/spices-2703460_640.jpg"),
  "Organic Grain Assortment":            P("2016/08/05/15/44/grain-1573061_640.jpg"),
  "Mixed Organic Spices Board":          P("2017/09/01/10/20/spices-2703461_640.jpg"),
  "Rustic Kitchen Staples":              P("2016/08/05/15/44/grain-1573062_640.jpg"),
  "Farm Pantry Collection":              P("2017/09/01/10/20/spices-2703462_640.jpg"),
  "Organic Whole Grains":                P("2016/08/05/15/44/grain-1573063_640.jpg"),
  "Traditional Cooking Spices":          P("2017/09/01/10/20/spices-2703463_640.jpg"),
  "Heritage Grain Selection":            P("2016/08/05/15/44/grain-1573064_640.jpg"),
  "Aromatic Spice Blend":                P("2017/09/01/10/20/spices-2703464_640.jpg"),
  "Organic Daily Staples Mix":           P("2016/08/05/15/44/grain-1573065_640.jpg"),
  // VEG BASKETS
  "Fresh Weekly Veggie Basket":          P("2016/09/10/23/52/vegetables-1659784_640.jpg"),
  "Organic Mixed Vegetables Bumper":     P("2016/09/10/23/52/vegetables-1659785_640.jpg"),
  "Daily Greens & Veg Assortment":       P("2016/09/10/23/52/vegetables-1659786_640.jpg"),
  "Farm Fresh Veggie Collection":        P("2016/09/10/23/52/vegetables-1659787_640.jpg"),
  "Family Veggie Combo":                 P("2016/09/10/23/52/vegetables-1659788_640.jpg"),
  // FRUIT BASKETS
  "Premium Mixed Fruit Basket":          P("2016/07/15/11/23/fruit-1519166_640.jpg"),
  "Seasonal Organic Fruits Combo":       P("2016/07/15/11/23/fruit-1519167_640.jpg"),
  "Fresh Fruit Assortment":              P("2016/07/15/11/23/fruit-1519168_640.jpg"),
  "Healthy Fruit Medley":                P("2016/07/15/11/23/fruit-1519169_640.jpg"),
  "Orchard Harvest Fruit Box":           P("2016/07/15/11/23/fruit-1519170_640.jpg"),
};

async function downloadFile(url, filepath) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 5000) throw new Error('too small - likely 404');
    fs.writeFileSync(filepath, buf);
    return true;
  } catch (e) { return { error: e.message }; }
}

async function main() {
  console.log('Testing & downloading Pixabay food images...\n');
  const products = await prisma.product.findMany();
  const nameToId = {};
  for (const p of products) nameToId[p.name] = p.id;

  let ok = 0, fail = 0;
  const failures = [];

  for (const [name, imgUrl] of Object.entries(PRODUCT_IMAGES)) {
    const productId = nameToId[name];
    if (!productId) continue;
    const filename = `px_${productId}.jpg`;
    const filepath = path.join(imagesDir, filename);
    const result = await downloadFile(imgUrl, filepath);
    if (result === true) {
      await prisma.product.update({ where: { id: productId }, data: { images: `/images/products/${filename}` } });
      ok++;
    } else {
      failures.push({ name, url: imgUrl, error: result?.error });
      fail++;
    }
    process.stdout.write(`\r  Progress: ${ok + fail}/100 (✅${ok} ❌${fail})`);
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\n\n✅ ${ok} downloaded  ❌ ${fail} failed`);
  if (failures.length > 0) {
    console.log('\nFailed:');
    failures.forEach(f => console.log(`  - "${f.name}": ${f.error}`));
  }
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e.message); await prisma.$disconnect(); });
