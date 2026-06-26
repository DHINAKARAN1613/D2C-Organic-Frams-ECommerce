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
    return (
        <>
            {!hideHeaderFooter && <Navbar />}
            <main className="flex-1 flex flex-col w-full min-h-screen relative bg-background text-foreground transition-colors duration-300">{children}</main>
            {!hideHeaderFooter && <Footer />}
        </>
    );
}
