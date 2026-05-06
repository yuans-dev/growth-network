"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./providers";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const router = useRouter();
  const { signedIn, signInWithPassword, isInvitedAccount } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!signedIn) return;
    const redirectBasedOnProfile = async () => {
      // invited accounts still go to accept-claim
      if (isInvitedAccount) {
        router.replace("/accept-invite");
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
      } catch (err) {
        console.error("Error checking profile for onboarding:", err);
        router.replace("/dashboard");
      }
    };

    redirectBasedOnProfile();
  }, [signedIn, isInvitedAccount, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setLoginError("Please enter your email and password");
      return;
    }

    setIsSubmitting(true);
    const normalizedEmail = loginData.email.trim().toLowerCase();
    const { error, user: signedInUser } = await signInWithPassword(
      normalizedEmail,
      loginData.password,
    );

    setIsSubmitting(false);

    if (error) {
      setLoginError(error);
      return;
    }

    const accountStatus = signedInUser?.user_metadata?.account_status;
    if (accountStatus === "invited") {
      router.push("/accept-invite");
      return;
    }

    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      const userId = data?.user?.id;

      if (!userId) {
        router.push("/dashboard");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, sector")
        .eq("id", userId)
        .single();

      const needsOnboarding = !profile || !profile.full_name || !profile.sector;
      router.push(needsOnboarding ? "/onboarding" : "/dashboard");
    } catch {
      router.push("/dashboard");
    }
  };

  const handleLoginInputChange = (field: string, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
    if (loginError) setLoginError("");
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)]">
      <main className="px-[5%] py-20">
        <div className="mx-auto max-w-[640px] text-center">
          {showLogin ? (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-4xl font-700 text-[var(--color-ink)]">
                  Welcome back
                </h1>
                <p className="mt-4 text-lg text-[var(--color-body)]">
                  Sign in to access your dashboard and matches
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {loginError && (
                  <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                    {loginError}
                  </div>
                )}

                <div className="space-y-4">
                  <input
                    className="gn-input"
                    type="email"
                    placeholder="Email address"
                    value={loginData.email}
                    onChange={(e) =>
                      handleLoginInputChange("email", e.target.value)
                    }
                    required
                  />
                  <input
                    className="gn-input"
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) =>
                      handleLoginInputChange("password", e.target.value)
                    }
                    required
                  />
                </div>

                <button
                  className="w-full gn-btn-primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign in →"}
                </button>
              </form>

              <div className="text-center">
                <p className="text-sm text-[var(--color-muted)]">
                  Need an invite?{" "}
                  <Link
                    href="/onboarding"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    View invite process
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-4xl font-700 text-[var(--color-ink)]">
                  The Growth Network
                </h1>
                <p className="mt-4 text-lg text-[var(--color-body)]">
                  AI-powered matching platform for serious entrepreneurs
                </p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Where verified introductions become real deals
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  href="/onboarding"
                  className="block w-full gn-btn-primary text-center"
                >
                  How Invitations Work →
                </Link>
                <button
                  type="button"
                  onClick={() => setShowLogin(true)}
                  className="w-full gn-btn-secondary"
                >
                  Member Login
                </button>
              </div>

              <div className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-6 text-left">
                <h3 className="font-600 text-[var(--color-ink)]">
                  Platform Access
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-[var(--color-body)]">
                  <li>• Invitation-only membership</li>
                  <li>
                    • Invited accounts must claim access before activation
                  </li>
                  <li>• Stage-based progression (1→2→3→4)</li>
                  <li>• Credit-based matching system</li>
                  <li>• Advisor-reviewed introductions</li>
                  <li>• Document verification required</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
