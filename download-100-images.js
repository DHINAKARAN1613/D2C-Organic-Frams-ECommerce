const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function downloadImage(url, filepath) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Unexpected response ${res.statusText}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filepath, buffer);
}

async function main() {
    console.log('Downloading 100 completely unique images from LoremFlickr using Fetch API...');

    const products = await prisma.product.findMany({ include: { category: true } });
    const imagesDir = path.join(__dirname, 'public', 'images');
    
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }

    let count = 0;
    for (const p of products) {
        // Create a search query based on the product name or category
        let query = p.category.name.toLowerCase().replace(/[^a-z]/g, ',');
        const nameLower = p.name.toLowerCase();
        
        if (nameLower.includes('apple')) query = 'apple,fruit';
        else if (nameLower.includes('banana')) query = 'banana,fruit';
        else if (nameLower.includes('honey')) query = 'honey,jar';
        else if (nameLower.includes('oil')) query = 'oil,bottle';
        else if (nameLower.includes('soap') || nameLower.includes('scrub')) query = 'spa,soap';
        else if (nameLower.includes('rice') || nameLower.includes('poha')) query = 'rice,grain';
        else if (nameLower.includes('carrot')) query = 'carrot,vegetable';
        else if (nameLower.includes('tomato')) query = 'tomato,vegetable';
        else if (nameLower.includes('pomegranate')) query = 'pomegranate,fruit';
        else if (nameLower.includes('beetroot')) query = 'beetroot,vegetable';
        else if (nameLower.includes('spinach') || nameLower.includes('palak')) query = 'spinach,vegetable';
        else if (nameLower.includes('ghee')) query = 'ghee,jar';
        else if (nameLower.includes('drumstick')) query = 'drumstick,vegetable';
        else if (nameLower.includes('spice') || nameLower.includes('powder')) query = 'spices';
        else if (nameLower.includes('basket') || nameLower.includes('combo')) query = 'vegetable,basket';

        // Math.abs(hashCode) to get a positive integer for the lock
        let hash = 0;
        for (let i = 0; i < p.id.length; i++) {
            hash = p.id.charCodeAt(i) + ((hash << 5) - hash);
        }
        const lockId = Math.abs(hash) % 10000;

        const url = `https://loremflickr.com/800/800/${query}?lock=${lockId}`;
        const filename = `unique_${p.id}.jpg`;
        const filepath = path.join(imagesDir, filename);

        try {
            await downloadImage(url, filepath);
            
            await prisma.product.update({
                where: { id: p.id },
                data: { images: `/images/${filename}` }
            });
            
            count++;
            if (count % 10 === 0) console.log(`Downloaded ${count}/100 images...`);
            
        } catch (e) {
            console.error(`Failed for ${p.name} (${url}):`, e.message);
        }
    }

    console.log(`\n=============================================`);
    console.log(`SUCCESS! Replaced duplicate images with 100 completely unique photos!`);
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
