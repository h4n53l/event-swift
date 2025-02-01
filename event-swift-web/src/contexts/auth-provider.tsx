// src/contexts/auth-provider.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext, AuthContextType } from './auth-context';
import { User, AuthError, signIn, signUp, getUser } from '../lib/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  // Create our context value object with proper typing
  const contextValue: AuthContextType = {
    user,
    loading,
    signIn: async (email: string, password: string) => {
      try {
        const response = await signIn(email, password);
        localStorage.setItem('token', response.access_token);
        setUser(response.user);
        router.push('/dashboard');
      } catch (error) {
        if (error instanceof AuthError) {
          throw error;
        }
        throw new AuthError('An unexpected error occurred during sign in');
      }
    },
    signUp: async (email: string, password: string, name: string) => {
      try {
        await signUp(email, password, name);
        router.push('/auth/signin?verified=pending');
      } catch (error) {
        if (error instanceof AuthError) {
          throw error;
        }
        throw new AuthError('An unexpected error occurred during sign up');
      }
    },
    signOut: () => {
      localStorage.removeItem('token');
      setUser(null);
      router.push('/auth/signin');
    }
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}