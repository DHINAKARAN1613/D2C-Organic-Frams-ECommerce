import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { amount } = body;

        if (!amount || typeof amount !== 'number') {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error("Razorpay keys are missing");
            // Return a mock order for development if keys are missing
            return NextResponse.json({
                id: `order_mock_${Date.now()}`,
                amount: amount * 100,
                currency: "INR",
                receipt: `receipt_${Date.now()}`
            });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        return NextResponse.json(order);

    } catch (error) {
        console.error('Razorpay Order Creation Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
