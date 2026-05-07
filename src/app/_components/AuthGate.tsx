"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../providers";
import { createClient } from "@/lib/supabase/client";
import {
  canAccessPath,
  getHomePathForRole,
  isPublicPath,
} from "@/lib/auth/access";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { signedIn, isInvitedAccount, isLoading, role } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!signedIn && !isPublicPath(pathname)) {
      router.replace("/sign-in");
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
          const nextPath = needsOnboarding ? "/onboarding" : "/dashboard";
          router.replace(nextPath);
        } catch {
          router.replace("/dashboard");
        }
      };

      routeToPostInvitePage();
      return;
    }

    if (signedIn && !canAccessPath(pathname, role)) {
      router.replace(getHomePathForRole(role));
    }
  }, [signedIn, isInvitedAccount, pathname, router, isLoading, role]);

  return <>{children}</>;
}
