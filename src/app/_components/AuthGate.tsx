"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../providers";

const PUBLIC_PATHS = ["/", "/onboarding", "/accept-invite"];
const PROTECTED_PATH_PREFIXES = [
  "/dashboard",
  "/profile",
  "/matches",
  "/deal-board",
  "/documents",
  "/events",
  "/payments",
  "/stage-1",
  "/stage-2",
  "/stage-3",
  "/stage-4",
];

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { signedIn, isInvitedAccount, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    const isPublicPath = PUBLIC_PATHS.includes(pathname);
    const isProtectedPath = PROTECTED_PATH_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix),
    );

    if (!signedIn && isProtectedPath) {
      router.replace("/");
      return;
    }

    if (signedIn && isInvitedAccount && pathname !== "/accept-invite") {
      router.replace("/accept-invite");
      return;
    }

    if (signedIn && !isInvitedAccount && pathname === "/accept-invite") {
      router.replace("/dashboard");
      return;
    }

    if (!signedIn && !isPublicPath) {
      router.replace("/");
    }
  }, [signedIn, isInvitedAccount, pathname, router, isLoading]);

  return <>{children}</>;
}
