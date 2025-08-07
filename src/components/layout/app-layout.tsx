
"use client";

import * as React from "react";
import { useAuth } from "@/contexts/auth-context";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, roleVerified } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const authRoutes = ['/login', '/signup', '/forgot-password'];
  const isAuthPage = authRoutes.includes(pathname);
  const isInviteRoute = pathname.includes('/super-admin-portal/invite-only');
  const isDashboardRoute = [
    '/admin',
    '/doctor',
    '/lab',
    '/pharmacy',
    '/hospital',
    '/dashboard',
  ].some(route => pathname.startsWith(route));

  React.useEffect(() => {
    if (!loading && roleVerified) {
        if (user) {
            const isAdmin = user.role === "admin" || user.role === "super_admin";
            const isDoctor = user.role === "doctor";
            const isMedicalLab = user.role === "medical_lab";
            const isPharmacist = user.role === "pharmacist";
            const isHospital = user.role === "hospital";
            const isPatient = user.role === "patient";

            // If on an auth page, redirect away to the correct dashboard
            if (isAuthPage) {
                if (isAdmin) router.replace('/admin/dashboard');
                else if (isDoctor) router.replace('/doctor/dashboard');
                else if (isMedicalLab) router.replace('/lab/dashboard');
                else if (isPharmacist) router.replace('/pharmacy/dashboard');
                else if (isHospital) router.replace('/hospital/dashboard');
                else if (isPatient) router.replace('/dashboard');
                else router.replace('/');
            }
        } else {
            // If not logged in and trying to access a protected dashboard route
            if (isDashboardRoute) {
                router.replace('/login');
            }
        }
    }
  }, [user, loading, roleVerified, pathname, router, isAuthPage, isDashboardRoute]);

  // Wait for both initial user loading and role verification to complete
  if (loading || !roleVerified) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Determine if the public layout with Header/Footer should be shown
  const showPublicLayout = !isAuthPage && !isInviteRoute && !isDashboardRoute;

  if (!showPublicLayout) {
     return <main className="flex-1">{children}</main>;
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
