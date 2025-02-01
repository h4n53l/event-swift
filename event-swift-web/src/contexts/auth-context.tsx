// src/contexts/auth-context.tsx
'use client';

import { createContext } from 'react';
import type { User } from '../lib/auth';

// First, we define our context type
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
}

// Then, we create our context with a type assertion
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {
    throw new Error('AuthContext not initialized');
  },
  signUp: async () => {
    throw new Error('AuthContext not initialized');
  },
  signOut: () => {
    throw new Error('AuthContext not initialized');
  },
});

// We also export the context name for type safety
AuthContext.displayName = 'AuthContext';