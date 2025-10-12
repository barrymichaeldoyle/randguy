import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PropsWithChildren } from "react";

import "./globals.css";
import { assistant, excali } from "../fonts";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Rand Guy | South African Personal Finance",
    template: "%s | Rand Guy",
  },
  description:
    "Making Cents of SA Finance. Practical personal finance advice for everyday South Africans.",
  keywords: [
    "South African personal finance",
    "investing in South Africa",
    "TFSA",
    "tax-free savings account",
    "ETFs South Africa",
    "wealth building",
  ],
  authors: [{ name: "Rand Guy" }],
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "Rand Guy",
  },
  twitter: {
    card: "summary",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body
        className={`${excali.variable} ${assistant.variable} ${assistant.className} antialiased min-h-screen flex flex-col`}
      >
        <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/RandGuyLogo.png"
              alt="Rand Guy logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <h1
              className={`${excali.className} text-2xl text-gray-900 hover:text-yellow-600 transition-colors`}
            >
              Rand Guy
            </h1>
          </Link>
          <nav className="flex items-center gap-2">
            <Button href="/calculators" size="sm">
              Calculators
            </Button>
            <Button href="/blog" size="sm">
              Blog
            </Button>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
