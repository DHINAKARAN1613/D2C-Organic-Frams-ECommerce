"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { Loader2, Save, User as UserIcon, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

const AVATARS = [
    { id: 'female', src: 'https://avatar.iran.liara.run/public/girl' },
    { id: 'male', src: 'https://avatar.iran.liara.run/public/boy' },
];

interface ProfileFormProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string;
    }
}

export function ProfileForm({ user }: ProfileFormProps) {
    const { success, error } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(user.name || "");
    const [selectedAvatar, setSelectedAvatar] = useState(user.image || AVATARS[0].src);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, image: selectedAvatar }),
            });

            if (!res.ok) throw new Error("Failed to update");

            success("Profile updated successfully!");
            router.refresh();
        } catch (err) {
            error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Selection */}
            <div className="flex flex-col items-center gap-6 mb-10">
                <label className="text-sm font-extrabold text-[#5c6e63] tracking-[0.2em] uppercase">Choose Your Avatar</label>
                <div className="flex justify-center gap-8">
                    {AVATARS.map((avatar) => (
                        <div key={avatar.id} className="relative group">
                            <motion.button
                                type="button"
                                onClick={() => setSelectedAvatar(avatar.src)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                animate={{
                                    scale: selectedAvatar === avatar.src ? 1.1 : 1,
                                    borderColor: selectedAvatar === avatar.src ? "#22c55e" : "transparent"
                                }}
                                className={`relative w-28 h-28 rounded-full overflow-hidden border-4 bg-[#1c2e24] shadow-xl transition-colors duration-300 ${selectedAvatar === avatar.src
                                    ? "border-green-500 shadow-green-500/20"
                                    : "border-[#2d4035] grayscale hover:grayscale-0"
                                    }`}
                            >
                                <Image
                                    src={avatar.src}
                                    alt={avatar.id}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                {selectedAvatar === avatar.src && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 bg-green-500/10 z-10"
                                    />
                                )}
                            </motion.button>
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-[#9db8a8] capitalize bg-[#1c2e24] px-2 py-1 rounded-full shadow-sm border border-[#2d4035]">
                                {avatar.id}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 rounded-2xl bg-[#1c2e24] border border-[#2d4035] shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-[#9db8a8]">
                        <UserIcon className="w-4 h-4" />
                        <label className="text-xs font-bold uppercase tracking-wider">
                            Full Name
                        </label>
                    </div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-transparent text-lg font-bold text-white outline-none border-b border-transparent focus:border-[#30e87a] transition-colors placeholder:text-[#5c6e63]"
                        placeholder="Set your name..."
                    />
                </div>

                <div className="p-6 rounded-2xl bg-[#112117] border border-[#2d4035]">
                    <div className="flex items-center gap-2 mb-3 text-[#9db8a8]">
                        <Mail className="w-4 h-4" />
                        <label className="text-xs font-bold uppercase tracking-wider">
                            Email Address
                        </label>
                    </div>
                    <div className="w-full bg-transparent text-lg font-bold text-[#9db8a8] cursor-not-allowed">
                        {user.email}
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading || name === user.name}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </Button>
            </div>
        </form>
    );
}
