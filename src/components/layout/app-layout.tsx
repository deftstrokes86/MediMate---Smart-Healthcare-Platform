
"use client";

import * as React from "react";
import { useAuth } from "@/contexts/auth-context";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = ['/login', '/signup', '/forgot-password'].some(p => pathname.startsWith(p));
  const isInviteRoute = pathname.includes('/super-admin-portal/invite-only');
  
  const isDashboardRoute = [
    '/admin',
    '/doctor',
    '/lab',
    '/pharmacy',
    '/hospital',
    '/dashboard',
  ].some(route => pathname.startsWith(route));

  // If we are waiting for the auth state to load, show a spinner.
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If auth is loaded, but there's no user, and they are trying to access a dashboard, redirect them.
  if (!user && isDashboardRoute) {
      router.replace('/login');
      return (
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
  }

  // Determine if the public layout with Header/Footer should be shown
  const showPublicLayout = !isAuthPage && !isInviteRoute && !isDashboardRoute;

  if (showPublicLayout) {
      return (
        <div className="relative flex min-h-dvh flex-col bg-background">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      );
  }
  
  // For auth pages, invite pages, and dashboard pages, just render the children
  return <main className="flex-1">{children}</main>;
}
