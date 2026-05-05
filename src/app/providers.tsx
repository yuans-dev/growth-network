"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
  email: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  signedIn: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
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
        setUser(JSON.parse(stored));
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
      signIn: (nextUser: User) => {
        setUser(nextUser);
        localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser));
      },
      signOut: () => {
        setUser(null);
        localStorage.removeItem(AUTH_KEY);
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
