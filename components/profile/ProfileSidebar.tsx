"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShoppingBag, MapPin, LogOut, Heart, MessageSquare } from "lucide-react";
import { signOut } from "next-auth/react";

const items = [
    {
        title: "Overview",
        href: "/profile",
        icon: User,
    },
    {
        title: "My Orders",
        href: "/profile/orders",
        icon: ShoppingBag,
    },
    {
        title: "Messages",
        href: "/profile/messages",
        icon: MessageSquare,
    },
    {
        title: "My Wishlist",
        href: "/profile/wishlist",
        icon: Heart,
    },
    {
        title: "Address Book",
        href: "/profile/addresses",
        icon: MapPin,
    },
];

export function ProfileSidebar() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col space-y-2 lg:w-64 shrink-0">
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold
                        ${pathname === item.href
                            ? "bg-[#30e87a] text-[#112117] shadow-lg shadow-[#30e87a]/20"
                            : "text-[#9db8a8] hover:bg-[#1c2e24] hover:text-white"
                        }`}
                >
                    <item.icon className="w-5 h-5" />
                    {item.title}
                </Link>
            ))}

            <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-[#9db8a8] hover:bg-[#1c2e24] hover:text-red-400 mt-4"
            >
                <LogOut className="w-5 h-5" />
                Sign Out
            </button>
        </nav>
    );
}
