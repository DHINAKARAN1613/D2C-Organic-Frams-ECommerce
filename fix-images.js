const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Fixing product images...');
    
    const products = await prisma.product.findMany();
    let updatedCount = 0;

    for (const p of products) {
        // If image is a fake Unsplash URL that we seeded, replace it
        if (p.images && p.images.includes('images.unsplash.com') && !p.images.includes('source.unsplash.com')) {
            const shortName = p.name.split(' ').slice(0, 2).join('+');
            const newUrl = `https://placehold.co/800x800/1c2e24/30e87a?text=${shortName}`;
            
            await prisma.product.update({
                where: { id: p.id },
                data: { images: newUrl }
            });
            updatedCount++;
        }
    }

    console.log(`Successfully fixed images for ${updatedCount} products!`);
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
