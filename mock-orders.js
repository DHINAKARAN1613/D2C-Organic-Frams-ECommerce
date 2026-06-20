const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Creating mock orders to demonstrate dynamic farmer success rate...');

    // 1. Find a product that has a farmer
    const product = await prisma.product.findFirst({
        where: { farmerId: { not: null } },
        include: { farmer: true }
    });

    if (!product) {
        console.log('No products with farmers found!');
        return;
    }

    console.log(`Target Product: ${product.name}`);
    console.log(`Target Farmer: ${product.farmer.name}`);

    // 2. Create a dummy user to place the orders
    let user = await prisma.user.findFirst({ where: { email: 'buyer@test.com' } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                name: 'Test Buyer',
                email: 'buyer@test.com',
                password: 'password123',
                role: 'USER'
            }
        });
    }

    // 3. Delete any existing orders for this product to ensure clean testing
    await prisma.orderItem.deleteMany({
        where: { productId: product.id }
    });
    console.log('Cleared existing orders for this product.');

    // 4. Create 10 orders. 7 Delivered, 3 Cancelled. (Success rate should become 70%)
    for (let i = 0; i < 7; i++) {
        await prisma.order.create({
            data: {
                userId: user.id,
                total: product.price,
                status: 'DELIVERED',
                items: {
                    create: [
                        {
                            productId: product.id,
                            quantity: 1,
                            price: product.price
                        }
                    ]
                }
            }
        });
    }

    for (let i = 0; i < 3; i++) {
        await prisma.order.create({
            data: {
                userId: user.id,
                total: product.price,
                status: 'CANCELLED',
                items: {
                    create: [
                        {
                            productId: product.id,
                            quantity: 1,
                            price: product.price
                        }
                    ]
                }
            }
        });
    }

    console.log('Successfully created 7 DELIVERED orders and 3 CANCELLED orders.');
    console.log(`The Farmer's success rate for this product should now automatically display as 70% on the product page.`);
    console.log(`Check URL: http://localhost:3000/product/${product.id}`);
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
