import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { loginUser as apiLogin, logoutUser as apiLogout } from '../api/battleCatsApi';
import { STORAGE_KEYS } from '../api/config';
import type { LoginRequest, UserRole } from '../types';

// ===========================================================
// Декодирование JWT
// ===========================================================

/**
 * Разбирает JWT и достаёт оттуда payload (middle часть).
 * Toкен формата "Header.Payload.Signature", всё в base64-url.
 * Используется чтобы достать роль юзера прямо из токена,
 * не делая отдельный запрос к бэку.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // base64url -> base64 (заменить URL-safe символы)
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Достаёт роль из payload. ASP.NET Core кладёт роль в claim
 * "http://schemas.microsoft.com/ws/2008/06/identity/claims/role".
 */
function extractRole(payload: Record<string, unknown> | null): UserRole | null {
  if (!payload) return null;
  const role =
    payload['role'] ??
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  if (role === 'Admin' || role === 'Manager' || role === 'User') {
    return role;
  }
  return null;
}

// ===========================================================
// Тип контекста
// ===========================================================

type AuthState = {
  isAuthenticated: boolean;
  userName: string | null;
  userRole: UserRole | null;
  userId: number | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

// ===========================================================
// Provider
// ===========================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.token),
  );
  const [userName, setUserName] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.userName),
  );

  // Восстанавливаем роль из токена при первой загрузке
  // (на случай рефреша страницы — иначе юзер "вылетал" из админки)
  const userRole = useMemo<UserRole | null>(() => {
    if (!token) return null;
    return extractRole(decodeJwtPayload(token));
  }, [token]);

  const userId = useMemo<number | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.userId);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }, [token]);

  // Сохраняем роль в localStorage отдельно — пригодится в DevTools
  useEffect(() => {
    if (userRole) {
      localStorage.setItem(STORAGE_KEYS.userRole, userRole);
    } else {
      localStorage.removeItem(STORAGE_KEYS.userRole);
    }
  }, [userRole]);

  const login = useCallback(async (credentials: LoginRequest) => {
    const data = await apiLogin(credentials);
    setToken(data.token);
    setUserName(credentials.login);
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setToken(null);
    setUserName(null);
  }, []);

  const value: AuthState = {
    isAuthenticated: token !== null,
    userName,
    userRole,
    userId,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ===========================================================
// Хук для использования в компонентах
// ===========================================================

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>');
  }
  return ctx;
}