"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./providers";

export default function Home() {
  const router = useRouter();
  const { signedIn, signIn, user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login check
    if (loginData.email && loginData.password) {
      // In real app, this would authenticate against backend
      signIn({ email: loginData.email });
      router.push("/dashboard");
    } else {
      setLoginError("Please enter your email and password");
    }
  };

  const handleLoginInputChange = (field: string, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
    if (loginError) setLoginError("");
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)]">
      <main className="px-[5%] py-20">
        <div className="mx-auto max-w-[640px] text-center">
          {signedIn && !showLogin ? (
            <div className="space-y-8 rounded-[20px] border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-8">
              <h1 className="font-display text-4xl font-700 text-[var(--color-ink)]">
                Welcome back{user?.email ? `, ${user.email}` : ""}
              </h1>
              <p className="mt-4 text-lg text-[var(--color-body)]">
                You're already signed in for testing. Use the header links to navigate to dashboard and other pages.
              </p>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="gn-btn-primary"
              >
                Go to Dashboard
              </button>
              <div className="mt-8 rounded-[20px] border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-6 text-left">
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--color-muted)]">
                  Quick access
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Link href="/dashboard" className="gn-btn-secondary w-full text-center">
                    Dashboard
                  </Link>
                  <Link href="/matches" className="gn-btn-secondary w-full text-center">
                    Matches
                  </Link>
                  <Link href="/deal-board" className="gn-btn-secondary w-full text-center">
                    Deal Board
                  </Link>
                  <Link href="/events" className="gn-btn-secondary w-full text-center">
                    Events
                  </Link>
                  <Link href="/documents" className="gn-btn-secondary w-full text-center">
                    Documents
                  </Link>
                  <Link href="/profile" className="gn-btn-secondary w-full text-center">
                    Profile
                  </Link>
                </div>
              </div>
            </div>
          ) : showLogin ? (
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
                    onChange={(e) => handleLoginInputChange("email", e.target.value)}
                    required
                  />
                  <input
                    className="gn-input"
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => handleLoginInputChange("password", e.target.value)}
                    required
                  />
                </div>

                <button className="w-full gn-btn-primary" type="submit">
                  Sign in →
                </button>
              </form>

              <div className="text-center">
                <p className="text-sm text-[var(--color-muted)]">
                  New to the platform?{" "}
                  <Link
                    href="/onboarding"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    Start onboarding
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
                  Start Onboarding →
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