import type { Metadata } from "next";
import { Spline_Sans, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const splineSans = Spline_Sans({
  variable: "--font-spline",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Yogam Organic Farms | Pure & Sustainable",
  description: "Curated organic goods for a sustainable lifestyle.",
};

import Link from "next/link"; // Ensure Link is imported if needed, though removed Navbar usage might make it unused here. 
// actually Navbar and Footer imports should be removed. 

import { ThemeProvider } from "@/components/ThemeProvider";
import SessionProvider from "@/components/SessionProvider";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${splineSans.variable} antialiased min-h-screen flex flex-col bg-background text-foreground font-sans overflow-x-hidden`}
      >
        <SessionProvider>
          <CartProvider>
            <ToastProvider>
              <WishlistProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  forcedTheme="dark"
                  enableSystem={false}
                  disableTransitionOnChange
                >
                  <ClientLayoutWrapper>
                    {children}
                  </ClientLayoutWrapper>
                  <CartDrawer />
                </ThemeProvider>
              </WishlistProvider>
            </ToastProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
