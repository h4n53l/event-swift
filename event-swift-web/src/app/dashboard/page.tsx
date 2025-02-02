'use client';
import DashboardClient from './dashboard-client';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { redirect } from 'next/navigation';


// Server component
export default function DashboardPage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      redirect('/auth/signin');
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <DashboardClient />;
}