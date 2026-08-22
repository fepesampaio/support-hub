import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AuthUser = { email: string; id: string };

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const MOCK_STORAGE_KEY = "helpdesk_mock_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Carregar usuário mockado do localStorage
    const saved = localStorage.getItem(MOCK_STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem(MOCK_STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      ready,
      signIn: async (email, _password) => {
        // Mock login: qualquer e-mail/senha funciona
        const mockUser = { email, id: "mock-id-" + Date.now() };
        setUser(mockUser);
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockUser));
      },
      signUp: async (email, _password) => {
        // Mock signup
        const mockUser = { email, id: "mock-id-" + Date.now() };
        setUser(mockUser);
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockUser));
      },
      signOut: async () => {
        setUser(null);
        localStorage.removeItem(MOCK_STORAGE_KEY);
      },
    };
  }, [user, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
