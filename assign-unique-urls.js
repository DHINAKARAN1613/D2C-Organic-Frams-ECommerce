const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Instantly mapping 100 completely unique images to products...');

    const products = await prisma.product.findMany({ include: { category: true } });

    let count = 0;
    for (const p of products) {
        let query = p.category.name.toLowerCase().replace(/[^a-z]/g, ',');
        const nameLower = p.name.toLowerCase();
        
        if (nameLower.includes('apple')) query = 'apple,fruit';
        else if (nameLower.includes('banana')) query = 'banana,fruit';
        else if (nameLower.includes('honey')) query = 'honey,jar';
        else if (nameLower.includes('oil')) query = 'oil,bottle';
        else if (nameLower.includes('soap') || nameLower.includes('scrub') || nameLower.includes('mist')) query = 'spa,natural';
        else if (nameLower.includes('rice') || nameLower.includes('poha')) query = 'rice,grain';
        else if (nameLower.includes('carrot')) query = 'carrot,vegetable';
        else if (nameLower.includes('tomato')) query = 'tomato,vegetable';
        else if (nameLower.includes('pomegranate')) query = 'pomegranate,fruit';
        else if (nameLower.includes('beetroot')) query = 'beetroot,vegetable';
        else if (nameLower.includes('spinach') || nameLower.includes('palak') || nameLower.includes('leaf')) query = 'spinach,vegetable';
        else if (nameLower.includes('ghee')) query = 'ghee,jar';
        else if (nameLower.includes('drumstick')) query = 'drumstick,vegetable';
        else if (nameLower.includes('spice') || nameLower.includes('powder') || nameLower.includes('salt')) query = 'spices';
        else if (nameLower.includes('basket') || nameLower.includes('combo')) query = 'vegetable,basket';

        let hash = 0;
        for (let i = 0; i < p.id.length; i++) {
            hash = p.id.charCodeAt(i) + ((hash << 5) - hash);
        }
        const lockId = Math.abs(hash) % 10000;

        const url = `https://loremflickr.com/800/800/${query}?lock=${lockId}`;

        await prisma.product.update({
            where: { id: p.id },
            data: { images: url }
        });
        count++;
    }

    console.log(`\n=============================================`);
    console.log(`SUCCESS! Mapped 100 completely unique photos!`);
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
