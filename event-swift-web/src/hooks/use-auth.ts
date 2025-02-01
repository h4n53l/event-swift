// src/hooks/use-auth.ts
'use client';

import { useContext } from 'react';
import { AuthContext } from '../contexts/auth-context';


export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Wrap a parent component in <AuthProvider> to fix this error.'
    );
  }
  
  return context;
}