import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import TopHeader from "./_components/TopHeader";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "The Growth Network",
  description: "Private deal environment for verified members.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-bg-base)] text-[var(--color-text-primary)] font-sans">
        <TopHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
