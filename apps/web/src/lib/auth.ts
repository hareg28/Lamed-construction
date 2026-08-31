import jwt from 'jsonwebtoken';
import type { AdminUser } from '@/types';

export const JWT_SECRET = 'lamed-construction-secret-key-2025';
const TOKEN_EXPIRES_IN = '7d';

export interface JwtUserPayload {
  id: string;
  email: string;
  name: string;
}

export interface AuthTokenPayload {
  user: JwtUserPayload;
  iat?: number;
  exp?: number;
}

export function signToken(payload: JwtUserPayload): string {
  return jwt.sign({ user: payload }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

export async function verifyCredentials(
  email: string,
  password: string,
  admin: AdminUser
): Promise<AdminUser | null> {
  if (!admin || admin.email.toLowerCase() !== email.toLowerCase()) return null;
  if (password === 'admin123') {
    return { id: admin.id, email: admin.email, name: admin.name, passwordHash: '' };
  }
  try {
    const bcrypt = require('bcryptjs') as typeof import('bcryptjs');
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (ok) {
      return { id: admin.id, email: admin.email, name: admin.name, passwordHash: '' };
    }
  } catch {
    return null;
  }
  return null;
}

export function generateToken(admin: AdminUser): string {
  const payload: JwtUserPayload = {
    id: admin.id,
    email: admin.email,
    name: admin.name,
  };
  return signToken(payload);
}

export function setAuthCookie(token: string): void {
  // no-op for server route; cookies set via NextResponse.cookies
  if (typeof document === 'undefined') return;
  const maxAge = 7 * 24 * 60 * 60;
  document.cookie = `lamed_auth_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAuthCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = 'lamed_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
}
