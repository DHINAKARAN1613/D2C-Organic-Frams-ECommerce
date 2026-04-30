import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const addresses = await prisma.address.findMany({
            where: { userId: user.id },
            orderBy: { isDefault: 'desc' }, // Show default first
        });

        return NextResponse.json(addresses);
    } catch (error) {
        console.error("[ADDRESS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, street, city, state, zip, phone, lat, lng, isDefault } = body;

        if (!name || !street || !city || !state || !zip || !phone) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Get User ID
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // If setting as default, unset others
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: user.id },
                data: { isDefault: false },
            });
        }

        const address = await prisma.address.create({
            data: {
                userId: user.id,
                name,
                street,
                city,
                state,
                zip,
                phone,
                lat,
                lng,
                isDefault: isDefault || false,
            },
        });

        return NextResponse.json(address);
    } catch (error) {
        console.error("[ADDRESS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
