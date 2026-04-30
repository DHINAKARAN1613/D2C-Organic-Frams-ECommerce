import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProfileFormUpgraded } from "@/components/profile/ProfileFormUpgraded";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/auth/signin");

    const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
            bio: true,
            role: true,
            isVerifiedFarmer: true,
            createdAt: true,
            _count: { select: { orders: true, products: true } }
        }
    });

    if (!dbUser) redirect("/auth/signin");

    return <ProfileFormUpgraded user={dbUser} />;
}
