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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "Yogam Organic Farms | Pure & Sustainable",
    template: "%s | Yogam Organic Farms",
  },
  description: "Curated organic goods for a sustainable lifestyle. Connect directly with farmers for pure, 100% organic produce and essentials.",
  keywords: ["organic", "farm", "fresh produce", "sustainable", "farmers market", "direct to consumer", "health", "Yogam"],
  authors: [{ name: "Yogam Farms" }],
  creator: "Yogam Farms",
  publisher: "Yogam Farms",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Yogam Organic Farms",
    description: "Curated organic goods for a sustainable lifestyle.",
    url: "/",
    siteName: "Yogam Organic Farms",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yogam Organic Farms",
    description: "Curated organic goods for a sustainable lifestyle.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import Link from "next/link"; // Ensure Link is imported if needed, though removed Navbar usage might make it unused here. 
// actually Navbar and Footer imports should be removed. 

import { ThemeProvider } from "@/components/ThemeProvider";
import SessionProvider from "@/components/SessionProvider";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { CustomerChatWidget } from "@/components/chat/CustomerChatWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${splineSans.variable} antialiased min-h-screen flex flex-col bg-background text-foreground font-sans overflow-x-hidden transition-colors duration-300`}
      >
        <SessionProvider>
          <LanguageProvider>
            <CartProvider>
              <ToastProvider>
                <WishlistProvider>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={true}
                    disableTransitionOnChange={false}
                  >
                    <ClientLayoutWrapper>
                      {children}
                    </ClientLayoutWrapper>
                    <CartDrawer />
                    <CustomerChatWidget />
                  </ThemeProvider>
                </WishlistProvider>
              </ToastProvider>
            </CartProvider>
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
