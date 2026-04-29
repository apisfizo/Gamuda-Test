import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/projectService";
import { apiError } from "../services/api";

interface AuthCtx {
  username: string | null;
  isAuth: boolean;
  isLoading: boolean;
  login(u: string, p: string): Promise<void>;
  logout(): void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem("access_token"));

  useEffect(() => {
    if (!localStorage.getItem("access_token")) { setIsLoading(false); return; }
    authService.me()
      .then((me) => setUsername(me.username))
      .catch(() => localStorage.removeItem("access_token"))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (u: string, p: string) => {
    const { access_token } = await authService.login(u, p);
    localStorage.setItem("access_token", access_token);
    setUsername(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    setUsername(null);
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({ username, isAuth: !!username, isLoading, login, logout }),
    [username, isLoading, login, logout]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
}

export { apiError };
