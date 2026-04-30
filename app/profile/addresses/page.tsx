import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AddressForm } from "@/components/profile/AddressForm";
import { revalidatePath } from "next/cache";
import { MapPin, Phone, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { redirect } from "next/navigation";

async function deleteAddress(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (id) {
        // In a real app we'd verify ownership better here or use API route
        // For simplicity using Server Action directly on Prisma if possible, 
        // OR better: use the API route I created via Client Component or fetch.
        // Actually, Server Actions are easier.
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return;

        // Use API approach via client or just prisma here?
        // mixing prisma in server action is fine.
        await prisma.address.deleteMany({
            where: { id, user: { email: session.user.email } },
        });
        revalidatePath("/profile/addresses");
    }
}

export default async function AddressesPage() {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) redirect("/auth/signin");

    const addresses = await prisma.address.findMany({
        where: { user: { email: user.email! } },
        orderBy: { isDefault: 'desc' },
    });

    return (
        <div className="bg-[#1c2e24] rounded-3xl p-8 border border-[#2d4035] shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-white">Address Book</h2>

            {/* Address List */}
            <div className="grid gap-4 mb-8">
                {addresses.length === 0 && (
                    <p className="text-[#9db8a8] text-center py-4">No saved addresses yet.</p>
                )}
                {addresses.map((addr) => (
                    <div key={addr.id} className={`relative p-4 rounded-2xl border transition-all ${addr.isDefault ? 'border-[#30e87a] bg-[#30e87a]/5' : 'border-[#2d4035] hover:border-[#30e87a]/50'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-lg capitalize text-white">{addr.name}</span>
                                    {addr.isDefault && (
                                        <span className="text-xs bg-[#30e87a] text-[#112117] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Default
                                        </span>
                                    )}
                                </div>
                                <p className="text-[#9db8a8] text-sm leading-relaxed font-medium">
                                    {addr.street}<br />
                                    {addr.city}, {addr.state} {addr.zip}
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-sm text-[#5c6e63]">
                                    <Phone className="w-3 h-3" />
                                    {addr.phone}
                                </div>
                            </div>

                            <form action={deleteAddress}>
                                <input type="hidden" name="id" value={addr.id} />
                                <Button variant="ghost" size="sm" type="submit" className="text-red-400 hover:bg-red-500/10 hover:text-red-300">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add New Form */}
            <AddressForm />
        </div>
    );
}
