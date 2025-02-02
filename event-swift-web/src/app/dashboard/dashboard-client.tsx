// src/app/dashboard/dashboard-client.tsx
'use client';
import { useAuth } from '../../hooks/use-auth';


export default function DashboardClient() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-transparent">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {user?.name}</span>
              <button
                onClick={signOut}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Add your dashboard content here */}
      </main>
    </div>
  );
}