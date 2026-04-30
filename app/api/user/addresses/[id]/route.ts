import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
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

        // Verify ownership
        const address = await prisma.address.findUnique({
            where: { id },
        });

        if (!address || address.userId !== user.id) {
            return new NextResponse("Address not found or unauthorized", { status: 404 });
        }

        await prisma.address.delete({
            where: { id },
        });

        return new NextResponse("Deleted", { status: 200 });
    } catch (error) {
        console.error("[ADDRESS_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
