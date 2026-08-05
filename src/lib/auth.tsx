import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * Mock authentication layer.
 * Swap these functions for Lovable Cloud (Supabase) auth calls when the backend is connected.
 */
export type AuthUser = { email: string };

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const STORAGE_KEY = "helpdesk.session";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const persist = (next: AuthUser | null) => {
      setUser(next);
      if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else localStorage.removeItem(STORAGE_KEY);
    };

    return {
      user,
      ready,
      signIn: async (email) => persist({ email }),
      signUp: async (email) => persist({ email }),
      signOut: async () => persist(null),
    };
  }, [user, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
