import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, image, phone, bio } = body;

        const data: any = {};
        if (name !== undefined) data.name = name;
        if (image !== undefined) data.image = image;
        if (phone !== undefined) data.phone = phone;
        if (bio !== undefined) data.bio = bio;

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data,
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[PROFILE_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
