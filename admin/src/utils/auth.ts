export interface AdminInfo {
  id: string;
  username: string;
  nickname: string;
}

const TOKEN_KEY = 'admin_token';
const ADMIN_KEY = 'admin_info';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}

export function getAdmin(): AdminInfo | null {
  const raw = localStorage.getItem(ADMIN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminInfo;
  } catch {
    return null;
  }
}

export function setAdmin(admin: AdminInfo): void {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}
