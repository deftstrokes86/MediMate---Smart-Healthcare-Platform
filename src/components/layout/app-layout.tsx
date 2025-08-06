
"use client";

import { useAuth } from "@/contexts/auth-context";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  const pathname = usePathname();

  const noHeaderFooterRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
  ];

  const isAdminRoute = pathname.startsWith('/admin');
  const isInviteRoute = pathname.includes('/super-admin-portal/invite-only');

  const showHeaderFooter = !noHeaderFooterRoutes.includes(pathname) && !isInviteRoute && !isAdminRoute;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      {showHeaderFooter && <Header />}
      <main className="flex-1">{children}</main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}
