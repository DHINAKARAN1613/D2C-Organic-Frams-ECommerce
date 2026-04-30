import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/auth/signin?callbackUrl=/profile");
    }

    return (
        <div className="container mx-auto px-4 pt-32 pb-8">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>
            <div className="flex flex-col lg:flex-row gap-8">
                <ProfileSidebar />
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
