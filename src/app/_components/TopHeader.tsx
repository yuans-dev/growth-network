"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../providers";
import { getHomePathForRole } from "@/lib/auth/access";

export default function TopHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { signedIn, signOut, isInvitedAccount, role } = useAuth();

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
          {signedIn && pathname !== getHomePathForRole(role) && (
            <Link
              href={getHomePathForRole(role)}
              className="text-sm text-(--color-muted) hover:underline"
            >
              Back to dashboard
            </Link>
          )}
          {signedIn ? (
            <>
              {/** Advisor tools quick link for elevated roles */}
              {isInvitedAccount === false &&
                role &&
                ["advisor", "staff", "admin"].includes(role) && (
                  <Link
                    href="/advisor/manual-match"
                    className="text-sm text-(--color-primary) hover:underline"
                  >
                    Advisor tools
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
