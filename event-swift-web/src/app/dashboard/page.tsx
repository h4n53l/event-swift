'use client';

import { useEffect } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { useRouter } from 'next/navigation';
import DashboardClient from './dashboard-client';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Debug logging
    console.log('Dashboard Mount:', {
      user,
      loading,
      hasToken: typeof window !== 'undefined' && !!localStorage.getItem('token'),
      hasCookie: typeof window !== 'undefined' && document.cookie.includes('token=')
    });

    if (!loading && !user) {
      console.log('Redirecting to signin - No user found');
      router.replace('/auth/signin');
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!user) {
    return null;
  }

  // Log successful render
  console.log('Rendering dashboard for user:', user.email);

  return <DashboardClient />;
}