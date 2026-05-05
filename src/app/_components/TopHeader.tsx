"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers";

const signedInNavLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/matches", label: "Matches" },
  { href: "/deal-board", label: "Deal Board" },
  { href: "/documents", label: "Documents" },
  { href: "/events", label: "Events" },
  { href: "/payments", label: "Payments" },
  { href: "/profile", label: "Profile" },
];

export default function TopHeader() {
  const router = useRouter();
  const { signedIn, signOut } = useAuth();

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

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          {signedIn ? (
            <>
              <nav className="hidden items-center gap-4 lg:flex">
                {signedInNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-500 text-[var(--color-ink)] hover:text-[var(--color-muted)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <Link
                href="/dashboard"
                className="text-base font-500 text-[var(--color-ink)] hover:text-[var(--color-muted)] lg:hidden"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
                className="rounded-full bg-[var(--color-ink)] px-6 py-2 text-sm font-600 text-white hover:bg-[var(--color-body)]"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/"
                className="text-base font-500 text-[var(--color-ink)] hover:text-[var(--color-muted)]"
              >
                Sign in
              </Link>
              <Link
                href="/onboarding"
                className="rounded-full bg-[var(--color-ink)] px-6 py-2 text-sm font-600 text-white hover:bg-[var(--color-body)]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
