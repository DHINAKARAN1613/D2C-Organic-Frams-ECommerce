const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();
const KEY = 'FWAkZinZfdCqwPg1Wro0wKFQSrEkV1VBCr91F1fxny4jt14dXJ5SESCQ';
const dir = path.join(__dirname, 'public', 'images', 'products');

const fixes = [
  { name: 'Relaxing Lavender Bath Scrub', query: 'lavender spa bath', page: 1 },
  { name: 'Farm Fresh Veggie Collection', query: 'fresh vegetables farm', page: 1 },
];

async function run() {
  const products = await prisma.product.findMany();
  const nameToId = {};
  for (const p of products) nameToId[p.name] = p.id;
  for (const { name, query, page } of fixes) {
    const id = nameToId[name];
    const res = await fetch('https://api.pexels.com/v1/search?query=' + encodeURIComponent(query) + '&per_page=1&page=' + page, { headers: { Authorization: KEY } });
    const data = await res.json();
    const imgUrl = data.photos?.[0]?.src?.large;
    if (!imgUrl) { console.log('No photo for', name); continue; }
    const fn = 'pex_' + id + '.jpg';
    const r2 = await fetch(imgUrl);
    fs.writeFileSync(path.join(dir, fn), Buffer.from(await r2.arrayBuffer()));
    await prisma.product.update({ where: { id }, data: { images: '/images/products/' + fn } });
    console.log('Fixed:', name);
  }
  await prisma.$disconnect();
}
run().catch(e => { console.error(e.message); process.exit(1); });
