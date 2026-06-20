const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function main() {
    console.log('Assigning highly specific, unique generated images to products...');
    
    const products = await prisma.product.findMany();
    let updatedCount = 0;

    const imagesDir = path.join(__dirname, 'public', 'images');
    const allImages = fs.readdirSync(imagesDir);

    const findImage = (prefix) => {
        const file = allImages.find(img => img.startsWith(prefix));
        return file ? `/images/${file}` : null;
    };

    for (const p of products) {
        const name = p.name.toLowerCase();
        let newImage = '/images/pantry.png'; // ultimate fallback

        // 1. Try to find an exact match from the 13 unique generated images
        if (name.includes('carrot')) newImage = findImage('prod_carrot_') || '/images/veg.png';
        else if (name.includes('okra') || name.includes('ladies finger') || name.includes('lady finger')) newImage = findImage('prod_okra_') || '/images/veg.png';
        else if (name.includes('beetroot')) newImage = findImage('prod_beetroot_') || '/images/veg.png';
        else if (name.includes('palak')) newImage = findImage('prod_spinach_') || '/images/veg.png'; // Re-use the spinach one if palak failed
        else if (name.includes('spinach')) newImage = findImage('prod_spinach_') || '/images/veg.png';
        else if (name.includes('apple')) newImage = findImage('prod_apple_') || '/images/fruits.png';
        else if (name.includes('pomegranate')) newImage = findImage('prod_pomegranate_') || '/images/fruits.png';
        else if (name.includes('lavender') || name.includes('scrub')) newImage = findImage('prod_lavender_') || '/images/pantry.png';
        else if (name.includes('neem') || name.includes('soap')) newImage = findImage('prod_neem_') || '/images/pantry.png';
        else if (name.includes('forest honey') || name.includes('wild honey')) newImage = findImage('prod_wildhoney_') || '/images/dairy.png';
        else if (name.includes('honey')) newImage = findImage('prod_wildhoney_') || '/images/dairy.png'; // Re-use wildhoney for raw honey
        else if (name.includes('coconut oil')) newImage = findImage('prod_coconutoil_') || '/images/dairy.png';
        else if (name.includes('groundnut oil')) newImage = findImage('prod_coconutoil_') || '/images/dairy.png'; // Fallback coconut oil picture for groundnut if needed
        else if (name.includes('murungai') || name.includes('drumstick')) newImage = findImage('prod_drumstick_') || '/images/veg.png';
        else if (name.includes('banana')) newImage = findImage('prod_banana_') || '/images/fruits.png';
        else if (name.includes('tomato')) newImage = findImage('prod_tomato_') || '/images/veg.png';
        else if (name.includes('mango')) newImage = findImage('prod_apple_') || '/images/fruits.png'; // Apple fallback for mango
        else if (name.includes('ghee')) newImage = findImage('prod_coconutoil_') || '/images/dairy.png'; // Oil fallback for ghee
        else if (name.includes('turmeric')) newImage = findImage('prod_neem_') || '/images/pantry.png'; // neem/turmeric fallback
        else if (name.includes('rice') || name.includes('poha')) newImage = '/images/pantry.png';
        else if (name.includes('garlic')) newImage = '/images/veg.png';

        // 2. Generic fallbacks for any unhandled
        if (!newImage) {
             if (name.includes('mango') || name.includes('apple') || name.includes('banana') || name.includes('pomegranate')) {
                newImage = '/images/fruits.png';
            } else if (name.includes('ghee') || name.includes('honey') || name.includes('oil')) {
                newImage = '/images/dairy.png';
            } else if (name.includes('rice') || name.includes('turmeric') || name.includes('poha') || name.includes('spice')) {
                newImage = '/images/pantry.png';
            } else {
                 newImage = '/images/veg.png';
            }
        }

        await prisma.product.update({
            where: { id: p.id },
            data: { images: newImage }
        });
        updatedCount++;
    }

    console.log(`Successfully mapped unique images to ${updatedCount} products!`);
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
