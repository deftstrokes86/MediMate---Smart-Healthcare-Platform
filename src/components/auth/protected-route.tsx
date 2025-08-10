"use client";

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => (
    <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading...</p>
    </div>
);

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Don't do anything while loading

    // If loading is finished and there's no user, redirect to login
    if (!user) {
      console.log("ProtectedRoute: No user found, redirecting to login.");
      router.replace('/login');
      return;
    }

    // If user exists, but their role is not allowed
    if (!allowedRoles.includes(user.role!)) {
      console.error(`Access Denied: User role '${user.role}' is not in allowed roles [${allowedRoles.join(', ')}].`);
      router.replace('/dashboard'); // Redirect to a default safe page
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user || !allowedRoles.includes(user.role!)) {
    // Show a loading spinner or a skeleton screen while checking auth
    return <LoadingSpinner />;
  }

  // If everything is fine, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
