import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { createElement, type ReactNode } from 'react';
import { apiFetch } from '../lib/apiClient';

// ── Types ───────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  orgId: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// ── Keys ────────────────────────────────────────────────────────────────────

const TOKEN_KEY = 'qatrial:token';
const REFRESH_KEY = 'qatrial:refresh-token';

// ── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthState | null>(null);

// ── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(() => !!localStorage.getItem(TOKEN_KEY));

  const isAuthenticated = !!user && !!token;

  // Persist / clear tokens in localStorage
  const storeTokens = useCallback((accessToken: string, refreshToken: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    setToken(accessToken);
  }, []);

  const clearTokens = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // ── Refresh ─────────────────────────────────────────────────────────────

  const doRefresh = useCallback(async () => {
    const rt = localStorage.getItem(REFRESH_KEY);
    if (!rt) throw new Error('No refresh token');

    const res = await apiFetch<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: rt }),
    });

    storeTokens(res.accessToken, res.refreshToken);
    return res.accessToken;
  }, [storeTokens]);

  // ── Validate existing token on mount ────────────────────────────────────

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function validate() {
      try {
        const res = await apiFetch<{ user: AuthUser }>('/auth/me');
        if (!cancelled) {
          setUser(res.user);
        }
      } catch {
        // Token might be expired — try refresh
        try {
          await doRefresh();
          const res = await apiFetch<{ user: AuthUser }>('/auth/me');
          if (!cancelled) {
            setUser(res.user);
          }
        } catch {
          // Both failed — clear everything
          if (!cancelled) {
            clearTokens();
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    validate();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Login ───────────────────────────────────────────────────────────────

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch<{
      user: AuthUser;
      accessToken: string;
      refreshToken: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    storeTokens(res.accessToken, res.refreshToken);
    setUser(res.user);
  }, [storeTokens]);

  // ── Register ────────────────────────────────────────────────────────────

  const register = useCallback(async (email: string, password: string, name: string) => {
    const res = await apiFetch<{
      user: AuthUser;
      accessToken: string;
      refreshToken: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    storeTokens(res.accessToken, res.refreshToken);
    setUser(res.user);
  }, [storeTokens]);

  // ── Logout ──────────────────────────────────────────────────────────────

  const logout = useCallback(() => {
    clearTokens();
  }, [clearTokens]);

  // ── Refresh (public) ────────────────────────────────────────────────────

  const refreshTokenFn = useCallback(async () => {
    await doRefresh();
    const res = await apiFetch<{ user: AuthUser }>('/auth/me');
    setUser(res.user);
  }, [doRefresh]);

  // ── Value ───────────────────────────────────────────────────────────────

  const value = useMemo<AuthState>(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refreshToken: refreshTokenFn,
    }),
    [user, token, isAuthenticated, isLoading, login, register, logout, refreshTokenFn],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
