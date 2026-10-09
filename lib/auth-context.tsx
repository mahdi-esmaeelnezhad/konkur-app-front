"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, clearTokens, setTokens } from "@/lib/api";
import type { MeUser, UserRole } from "@/types";

interface AuthContextValue {
  user: MeUser | null;
  role: UserRole;
  loading: boolean;
  setRole: (role: UserRole) => void;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MeUser | null>(null);
  const [role, setRole] = useState<UserRole>("student");
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    const me = await api<MeUser>("/me/");
    setUser(me);
  }, []);

  useEffect(() => {
    const boot = async () => {
      try {
        if (localStorage.getItem("konkur_access")) {
          await refreshMe();
          const saved = localStorage.getItem("konkur_role") as UserRole | null;
          if (saved) setRole(saved);
        }
      } catch {
        clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    void boot();
  }, [refreshMe]);

  const login = useCallback(async (username: string, password: string) => {
    const data = await api<{ access: string; refresh: string; user: MeUser }>(
      "/auth/login/",
      {
        method: "POST",
        auth: false,
        body: JSON.stringify({ username, password }),
      },
    );
    setTokens(data.access, data.refresh);
    setUser(data.user);
    await refreshMe().catch(() => setUser(data.user));
  }, [refreshMe]);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const data = await api<{ access: string; refresh: string; user: MeUser }>(
        "/auth/register/",
        {
          method: "POST",
          auth: false,
          body: JSON.stringify({ username, email, password, locale: "fa" }),
        },
      );
      setTokens(data.access, data.refresh);
      setUser(data.user);
      await refreshMe().catch(() => setUser(data.user));
    },
    [refreshMe],
  );

  const logout = useCallback(async () => {
    const refresh = localStorage.getItem("konkur_refresh");
    try {
      if (refresh) {
        await api("/auth/logout/", {
          method: "POST",
          body: JSON.stringify({ refresh }),
        });
      }
    } catch {
      /* ignore */
    }
    clearTokens();
    setUser(null);
  }, []);

  const changeRole = useCallback((next: UserRole) => {
    setRole(next);
    localStorage.setItem("konkur_role", next);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      setRole: changeRole,
      login,
      register,
      logout,
      refreshMe,
    }),
    [user, role, loading, changeRole, login, register, logout, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
