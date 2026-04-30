"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");
    const isFarmer = pathname?.startsWith("/farmer");
    const hideHeaderFooter = isAdmin || isFarmer;
    const isShopPage = pathname?.startsWith('/shop');

    useEffect(() => {
        // Dynamically set body background to match the theme
        if (isShopPage) {
            document.body.style.backgroundColor = '#112117'; // Shop Theme
        } else {
            document.body.style.backgroundColor = '#051109'; // Default Theme
        }

        // Cleanup
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, [isShopPage]);

    return (
        <>
            {!hideHeaderFooter && <Navbar />}
            <main className={`flex-1 flex flex-col w-full min-h-screen relative ${isShopPage ? 'bg-[#112117]' : ''}`}>{children}</main>
            {!hideHeaderFooter && <Footer />}
        </>
    );
}
