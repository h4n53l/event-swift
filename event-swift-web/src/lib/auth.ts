// src/lib/auth.ts
// This file contains our authentication utilities and types
import { jwtDecode } from 'jwt-decode';

export interface User {
  [x: string]: string | undefined;
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | undefined;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Custom error for authentication
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// Authentication functions
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new AuthError(error.message);
  }

  const data = await response.json();
  return data;
}

export async function signUp(email: string, password: string, name: string): Promise<{ message: string }> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new AuthError(error.message);
  }

  return await response.json();
}

// Auth utilities
export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode<{ exp: number } & User>(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

