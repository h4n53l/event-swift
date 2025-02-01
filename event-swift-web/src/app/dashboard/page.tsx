// src/app/dashboard/page.tsx
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './dashboard-client';


// Server component
export default async function DashboardPage() {
  const headersList = await headers();
  const token = headersList.get('authorization');
  
  if (!token) {
    redirect('/auth/signin');
  }

  return <DashboardClient />;
}