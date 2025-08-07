
"use client";

import { useAuth } from "@/contexts/auth-context";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { loading, roleVerified } = useAuth();
  const pathname = usePathname();

  const noHeaderFooterRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
  ];

  const isAdminRoute = pathname.startsWith('/admin');
  const isDoctorRoute = pathname.startsWith('/doctor');
  const isLabRoute = pathname.startsWith('/lab');
  const isPharmacyRoute = pathname.startsWith('/pharmacy');
  const isHospitalRoute = pathname.startsWith('/hospital');
  const isPatientDashboard = pathname.startsWith('/dashboard');
  const isInviteRoute = pathname.includes('/super-admin-portal/invite-only');

  const showHeaderFooter = !noHeaderFooterRoutes.includes(pathname) && !isInviteRoute && !isAdminRoute && !isDoctorRoute && !isLabRoute && !isPharmacyRoute && !isHospitalRoute && !isPatientDashboard;

  // Wait for both initial user loading and role verification to complete
  if (loading || !roleVerified) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!showHeaderFooter) {
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
