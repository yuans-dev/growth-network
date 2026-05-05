"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
  email: string;
  name?: string;
  role?: "Explorer" | "Growth Partner" | "Community Builder" | "Growth Advisor";
  accountStatus: "invited" | "active";
};

type AuthContextType = {
  user: User | null;
  signedIn: boolean;
  isInvitedAccount: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
  completeInviteClaim: (details: { name: string }) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_KEY = "gn_mock_user";

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<User>;
        if (parsed.email) {
          setUser({
            email: parsed.email,
            name: parsed.name,
            role: parsed.role,
            accountStatus: parsed.accountStatus ?? "active",
          });
        } else {
          localStorage.removeItem(AUTH_KEY);
        }
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setIsHydrated(true);
  }, []);

  const value = useMemo(
    () => ({
      user,
      signedIn: !!user,
      isInvitedAccount: user?.accountStatus === "invited",
      signIn: (nextUser: User) => {
        setUser(nextUser);
        localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser));
      },
      signOut: () => {
        setUser(null);
        localStorage.removeItem(AUTH_KEY);
      },
      completeInviteClaim: ({ name }: { name: string }) => {
        if (!user) return;
        const updatedUser: User = {
          ...user,
          name,
          accountStatus: "active",
        };
        setUser(updatedUser);
        localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
      },
    }),
    [user]
  );

  // Don't render children until hydration is complete to avoid mismatch
  if (!isHydrated) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within Providers");
  }
  return context;
}
