'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext, AuthContextType } from './auth-context';
import { User, AuthError, signIn, signUp, getUser } from '../lib/auth';
import { ToastContainer, useToast } from '@rewind-ui/core';


interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();


  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = getUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const contextValue: AuthContextType = {
    user,
    loading,
    signIn: async (email: string, password: string) => {
      try {
        const response = await signIn(email, password);
        
        // Store the JWT token
        localStorage.setItem('token', response.access_token);
        
        // Set cookie for server-side auth
        document.cookie = `token=${response.access_token}; path=/; secure; samesite=lax`;
        
        // Get user from decoded JWT
        const currentUser = getUser();
        if (!currentUser) {
          throw new Error('Failed to decode user from token');
        }
        
        setUser(currentUser);
        toast.add({
          id: 'unique-id',
          closeOnClick: true,
          color: 'purple',
          description: 'Successfully signed in!',
          duration: 3000,
          iconType: 'success',
          pauseOnHover: true,
          radius: 'lg',
          shadow: 'none',
          shadowColor: 'none',
          showProgress: true,
          title: 'Welcome back!',
          tone: 'solid',
        });
        router.replace('/dashboard');
      } catch (error) {
        console.error('Sign in error:', error);
        if (error instanceof AuthError) {
          throw error;
        }
        throw new AuthError('An unexpected error occurred during sign in');
      }
    },
    signUp: async (email: string, password: string, name: string) => {
      try {
        await signUp(email, password, name);
        router.replace('/auth/signin?verified=pending');
      } catch (error) {
        if (error instanceof AuthError) {
          throw error;
        }
        throw new AuthError('An unexpected error occurred during sign up');
      }
    },
    signOut: () => {
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      setUser(null);
      router.replace('/auth/signin');
    }
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <ToastContainer />
      {children}
    </AuthContext.Provider>
  );
}