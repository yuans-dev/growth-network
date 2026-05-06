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
  const { signedIn, signOut, isInvitedAccount } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-(--color-hairline) bg-(--color-nav-bg) backdrop-blur-sm">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-[5%]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="text-2xl font-bold text-(--color-primary)">♥</div>
          <div>
            <p className="text-sm font-semibold text-(--color-ink)">
              Growth Network
            </p>
            <p className="text-xs text-(--color-muted)">by Exoasia</p>
          </div>
        </Link>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          {signedIn ? (
            <>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  router.push("/");
                }}
                className="rounded-full bg-(--color-ink) px-6 py-2 text-sm font-600 text-white hover:bg-(--color-body)"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-base font-500 text-(--color-ink) hover:text-(--color-muted)"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
