"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../providers";
import { getHomePathForRole } from "@/lib/auth/access";

export default function TopHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { signedIn, signOut, isInvitedAccount, role } = useAuth();
  const isMemberView =
    signedIn && role && !["advisor", "staff", "admin"].includes(role);

  return (
    <header className="sticky top-0 z-40 border-b border-(--color-hairline) bg-(--color-nav-bg) backdrop-blur-sm">
      <div className="mx-auto flex h-auto min-h-[5rem] w-full max-w-7xl flex-col justify-between px-[5%] py-3">
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
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

          <div className="flex flex-wrap items-center gap-3">
            {isMemberView && (
              <nav className="flex flex-wrap items-center gap-2">
                <Link
                  href="/matches"
                  className={
                    pathname.startsWith("/matches")
                      ? "gn-nav-link gn-nav-link-active"
                      : "gn-nav-link"
                  }
                >
                  Matches
                </Link>
                <Link
                  href="/deal-board"
                  className={
                    pathname.startsWith("/deal-board")
                      ? "gn-nav-link gn-nav-link-active"
                      : "gn-nav-link"
                  }
                >
                  Deal board
                </Link>
                <Link
                  href="/documents"
                  className={
                    pathname.startsWith("/documents")
                      ? "gn-nav-link gn-nav-link-active"
                      : "gn-nav-link"
                  }
                >
                  Documents
                </Link>
                <Link
                  href="/events"
                  className={
                    pathname.startsWith("/events")
                      ? "gn-nav-link gn-nav-link-active"
                      : "gn-nav-link"
                  }
                >
                  Events
                </Link>
                <Link
                  href="/profile"
                  className={
                    pathname.startsWith("/profile")
                      ? "gn-nav-link gn-nav-link-active"
                      : "gn-nav-link"
                  }
                >
                  Profile
                </Link>
              </nav>
            )}

            <div className="flex items-center gap-4">
              {signedIn ? (
                <>
                  {signedIn && pathname !== getHomePathForRole(role) && (
                    <Link
                      href={getHomePathForRole(role)}
                      className="text-sm text-(--color-muted) hover:underline"
                    >
                      Back to dashboard
                    </Link>
                  )}

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
                <Link
                  href="/sign-in"
                  className="text-base font-500 text-(--color-ink) hover:text-(--color-muted)"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
