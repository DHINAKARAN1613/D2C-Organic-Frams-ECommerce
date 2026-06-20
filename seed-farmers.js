const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding farmers...');

    const mockFarmers = [
        {
            name: 'Karpagam Organics',
            email: 'karpagam@example.com',
            phone: '9876543001',
            farmAddress: 'Plot 45, Cauvery Delta Region, Thanjavur, Tamil Nadu',
            kycStatus: 'VERIFIED',
            isVerifiedFarmer: true,
            role: 'FARMER',
            bio: '3rd generation organic farming collective specializing in heritage rice and grains.'
        },
        {
            name: 'Ravi Kumar',
            email: 'ravi@example.com',
            phone: '9876543002',
            farmAddress: '12 Green Valley Slopes, Ooty, Tamil Nadu',
            kycStatus: 'VERIFIED',
            isVerifiedFarmer: true,
            role: 'FARMER',
            bio: 'Passionate about pesticide-free hill vegetables and exotic fruits.'
        },
        {
            name: 'Annamalai Farms',
            email: 'annamalai@example.com',
            phone: '9876543003',
            farmAddress: '78 Sun City Road, Coimbatore, Tamil Nadu',
            kycStatus: 'PENDING',
            isVerifiedFarmer: false,
            role: 'FARMER',
            bio: 'Transitioning to 100% organic. Currently practicing zero-budget natural farming.'
        },
        {
            name: 'Lakshmi Narayan',
            email: 'lakshmi@example.com',
            phone: '9876543004',
            farmAddress: 'East Coast Road, Mahabalipuram, Tamil Nadu',
            kycStatus: 'VERIFIED',
            isVerifiedFarmer: true,
            role: 'FARMER',
            bio: 'Coastal farming utilizing natural compost and traditional Indian techniques.'
        }
    ];

    const createdFarmers = [];
    for (const f of mockFarmers) {
        let user = await prisma.user.findUnique({ where: { email: f.email } });
        if (!user) {
            user = await prisma.user.create({ data: f });
        } else {
            // Update them just in case
            user = await prisma.user.update({
                where: { email: f.email },
                data: f
            });
        }
        createdFarmers.push(user);
    }

    console.log(`Created/Updated ${createdFarmers.length} mock farmers.`);

    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products. Assigning farmers...`);
    
    let updateCount = 0;
    for (let i = 0; i < products.length; i++) {
        // Randomly assign a farmer, but keep it deterministic based on index
        const farmer = createdFarmers[i % createdFarmers.length];
        await prisma.product.update({
            where: { id: products[i].id },
            data: { farmerId: farmer.id }
        });
        updateCount++;
    }

    console.log(`Successfully assigned farmers to ${updateCount} products.`);
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
