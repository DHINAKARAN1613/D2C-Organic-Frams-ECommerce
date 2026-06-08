import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        if (!process.env.RAZORPAY_KEY_SECRET) {
            // Mock verification for development
            if (razorpay_order_id.startsWith('order_mock_')) {
                return NextResponse.json({ success: true, verified: true });
            }
            return NextResponse.json({ error: "Keys missing and not mock" }, { status: 400 });
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return NextResponse.json({ success: true, verified: true });
        } else {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }
    } catch (error) {
        console.error('Razorpay Verification Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
