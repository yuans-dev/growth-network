"use client";

import Link from "next/link";
import { useState } from "react";

export default function TopHeader() {
  const [activeTab, setActiveTab] = useState("homes");

  const products = [
    { id: "homes", label: "Homes", icon: "🏠" },
    { id: "experiences", label: "Experiences", icon: "✨", badge: "NEW" },
    { id: "services", label: "Services", icon: "🔧", badge: "NEW" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-hairline)] bg-[var(--color-nav-bg)] backdrop-blur-sm">
      <div className="mx-auto flex h-[80px] w-full max-w-[1280px] items-center justify-between px-[5%]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="text-2xl font-bold text-[var(--color-primary)]">
            ♥
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-ink)]">
              Growth Network
            </p>
            <p className="text-xs text-[var(--color-muted)]">
              by Exoasia
            </p>
          </div>
        </Link>

        {/* Product Tabs */}
        <nav className="flex gap-8">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => setActiveTab(product.id)}
              className={`relative flex items-center gap-2 text-base font-600 transition-colors ${
                activeTab === product.id
                  ? "text-[var(--color-ink)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-body)]"
              }`}
            >
              <span>{product.icon}</span>
              <span>{product.label}</span>
              {product.badge && (
                <span className="ml-1 inline-block rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-xs font-700 text-white">
                  {product.badge}
                </span>
              )}
              {activeTab === product.id && (
                <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[var(--color-ink)]" />
              )}
            </button>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <button className="text-base font-500 text-[var(--color-ink)] hover:text-[var(--color-muted)]">
            Sign in
          </button>
          <button className="rounded-full bg-[var(--color-ink)] px-6 py-2 text-sm font-600 text-white hover:bg-[var(--color-body)]">
            Sign up
          </button>
        </div>
      </div>
    </header>
  );
}
