import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, TOKEN_KEY, UNAUTHORIZED_EVENT } from "@/api/client";
import type { LoginFormValues, RegisterFormValues } from "@/schemas/forms";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "donor" | "collector";
  organization: string;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (values: LoginFormValues) => Promise<User>;
  register: (values: RegisterFormValues) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  // On page load, if a token exists, ask the server who it belongs to
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    api
      .get<User>("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem(TOKEN_KEY)) // expired or invalid token
      .finally(() => setLoading(false));
  }, []);

  // Any protected request that comes back 401 signs the user out
  useEffect(() => {
    const onUnauthorized = () => setUser(null);
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  const save = useCallback((data: { token: string; user: User }) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      login: async (values) => save((await api.post("/auth/login", values)).data),
      register: async (values) => save((await api.post("/auth/register", values)).data),
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      },
    }),
    [user, loading, save],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
