import type { Metadata } from "next";
import { Inter } from "next/font/google";
import TopHeader from "./_components/TopHeader";
import "./globals.css";

const inter = Inter({
  variable: "--font-cereal",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "The Growth Network - Marketplace",
  description: "Discover verified homes, experiences, and services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-[var(--color-canvas)] text-[var(--color-ink)] font-sans">
        <TopHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
