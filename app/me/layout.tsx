import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import '../globals.css'
import { ThemeScript } from "@/components/theme-script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Geist Pixel Square - using Geist Mono as fallback (per bryl-minimal spec)
// If you have the Geist Pixel Square woff2, add it here via local()
const geistPixel = Geist_Mono({
  variable: "--font-geist-pixel",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Arandelle",
  description:
    "Arandelle Paguinto is a software engineer and fullstack web developer in the Philippines building fast, accessible products for the web.",
  icons: {
    icon: "/profile.svg",
  },
};

export default function MeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${geistPixel.variable} ${sourceSerif.variable} min-h-full flex flex-col antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
