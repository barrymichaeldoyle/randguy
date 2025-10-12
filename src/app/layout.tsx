import type { Metadata } from "next";
import Link from "next/link";
import { PropsWithChildren } from "react";

import "./globals.css";
import { assistant, excali } from "../fonts";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Rand Guy",
  description: "Making Cents of SA Finance.",
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
            <img
              src="/RandGuyLogo.png"
              alt="Rand Guy logo"
              className="h-10 w-auto"
            />
            <h1
              className={`${excali.className} text-2xl text-gray-900 hover:text-yellow-600 transition-colors`}
            >
              Rand Guy
            </h1>
          </Link>
          <nav>
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
