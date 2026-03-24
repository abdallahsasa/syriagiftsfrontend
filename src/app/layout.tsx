"use client";

import { Inter, Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/lib/CurrencyContext";
import { LanguageProvider, useLanguage } from "@/lib/LanguageContext";
import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

import Footer from "@/components/Footer";
import CartToast from "@/components/CartToast";

function InnerLayout({ children }: { children: React.ReactNode }) {
    const { lang, dir } = useLanguage();
    return (
        <html lang={lang} dir={dir}>
            <head>
                <title>Gifts Syria | Premium Gifting in Damascus</title>
                <meta
                    name="description"
                    content="Send flowers, cakes, and gifts to your loved ones in Damascus with 60-minute express delivery. Gifts Syria - Your premium gifting partner."
                />
            </head>
            <body className={`${inter.variable} ${playfair.variable} ${montserrat.variable} font-sans`}>
                <div className="min-h-screen flex flex-col">
                    <main className="flex-grow">
                        {children}
                    </main>
                    <Footer />
                </div>
                <CartToast />
            </body>
        </html>
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <LanguageProvider>
            <CurrencyProvider>
                <AuthProvider>
                    <CartProvider>
                        <InnerLayout>{children}</InnerLayout>
                    </CartProvider>
                </AuthProvider>
            </CurrencyProvider>
        </LanguageProvider>
    );
}
