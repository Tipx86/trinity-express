import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'trinity-secret-key-2026';

export interface AuthSessionUser {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'STAFF';
  phone?: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Creates a base64url signed token (self-contained JWT-like structure)
 */
export function createSessionToken(user: AuthSessionUser): string {
  const payload = {
    ...user,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const str = JSON.stringify(payload);
  const base64 = Buffer.from(str).toString('base64url');
  // Simple HMAC-like signature
  const sig = Buffer.from(`${base64}.${SECRET_KEY}`).toString('base64url').substring(0, 32);
  return `${base64}.${sig}`;
}

export function verifySessionToken(token: string): AuthSessionUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [base64, sig] = parts;
    const expectedSig = Buffer.from(`${base64}.${SECRET_KEY}`).toString('base64url').substring(0, 32);
    if (sig !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(base64, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Date.now()) {
      return null;
    }
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      phone: payload.phone,
    };
  } catch {
    return null;
  }
}

export function getSessionUser(req: NextRequest): AuthSessionUser | null {
  const cookie = req.cookies.get('trinity_session')?.value;
  if (!cookie) {
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return verifySessionToken(authHeader.substring(7));
    }
    return null;
  }
  return verifySessionToken(cookie);
}

export function setSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set('trinity_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set('trinity_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
