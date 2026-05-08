import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import TopHeader from "./_components/TopHeader";
import AuthGate from "./_components/AuthGate";

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
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[var(--color-canvas)] text-[var(--color-ink)] font-sans" suppressHydrationWarning>
        <Providers>
          <TopHeader />
          <AuthGate>
            <main>{children}</main>
          </AuthGate>
        </Providers>
      </body>
    </html>
  );
}
