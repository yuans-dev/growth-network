"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../providers";
import { createClient } from "@/lib/supabase/client";

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

    if (signedIn && pathname === "/accept-invite") {
      const routeToPostInvitePage = async () => {
        if (isInvitedAccount) {
          return;
        }

        try {
          const supabase = createClient();
          const { data } = await supabase.auth.getUser();
          const userId = data?.user?.id;

          if (!userId) {
            router.replace("/dashboard");
            return;
          }

          const { data: profile } = await supabase
            .from("profiles")
            .select("id, full_name, sector")
            .eq("id", userId)
            .single();

          const needsOnboarding =
            !profile || !profile.full_name || !profile.sector;
          router.replace(needsOnboarding ? "/onboarding" : "/dashboard");
        } catch {
          router.replace("/dashboard");
        }
      };

      routeToPostInvitePage();
      return;
    }

    if (!signedIn && !isPublicPath) {
      router.replace("/");
    }
  }, [signedIn, isInvitedAccount, pathname, router, isLoading]);

  return <>{children}</>;
}
