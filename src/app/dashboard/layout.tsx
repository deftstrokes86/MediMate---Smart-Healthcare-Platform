
"use client";

import * as React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { 
    Loader2, 
    LayoutDashboard, 
    History,
    Bot,
    Pill,
    FileText,
    FlaskConical,
    HandHeart,
    Calendar,
    User,
    CreditCard,
    Shield,
    HelpCircle,
    LogOut, 
    Stethoscope,
    Baby,
    BookCopy
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function PatientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isGuardian = user?.profile?.patientData?.isMinor === true;

  React.useEffect(() => {
    if (!loading && (!user || user.role !== "patient")) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "patient") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const adultNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
    { href: "/dashboard/history", label: "Medical History", icon: <History /> },
    { href: "/symptom-checker", label: "Consult a Doctor", icon: <Bot /> },
    { href: "/dashboard/prescriptions", label: "Prescriptions", icon: <Pill /> },
    { href: "/dashboard/pharmacy-orders", label: "Pharmacy Orders", icon: <FileText /> },
    { href: "/dashboard/referrals", label: "Referrals", icon: <HandHeart /> },
    { href: "/dashboard/lab-results", label: "Lab Results", icon: <FlaskConical /> },
    { href: "/dashboard/appointments", label: "Appointments", icon: <Calendar /> },
    { href: "/dashboard/profile", label: "My Profile", icon: <User /> },
    { href: "/dashboard/billing", label: "Billing & Payments", icon: <CreditCard /> },
    { href: "/dashboard/settings", label: "Privacy & Settings", icon: <Shield /> },
    { href: "/dashboard/support", label: "Support", icon: <HelpCircle /> },
  ];

  const guardianNavItems = [
    { href: "/dashboard", label: "Child Dashboard", icon: <LayoutDashboard /> },
    { href: "/dashboard/history", label: "Medical History", icon: <History /> },
    { href: "/symptom-checker", label: "Consult for Child", icon: <Bot /> },
    { href: "/dashboard/prescriptions", label: "Prescriptions", icon: <Pill /> },
    { href: "/dashboard/appointments", label: "Appointments", icon: <Calendar /> },
    { href: "/dashboard/referrals", label: "Referrals", icon: <HandHeart /> },
    { href: "/dashboard/child-profile", label: "Child Profile", icon: <Baby /> },
    { href: "/dashboard/parental-consent", label: "Parental Consent", icon: <BookCopy /> },
    { href: "/dashboard/billing", label: "Billing & Payments", icon: <CreditCard /> },
    { href: "/dashboard/privacy-controls", label: "Privacy Controls", icon: <Shield /> },
    { href: "/dashboard/support", label: "Support", icon: <HelpCircle /> },
  ]

  const navItems = isGuardian ? guardianNavItems : adultNavItems;

  const sidebarContent = (
      <Sidebar>
        <SidebarHeader>
             <div className="flex items-center gap-2">
                <Stethoscope className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold font-headline">MediMate</span>
             </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className="flex items-center gap-2 p-2">
                 <Avatar>
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'Patient'} />
                    <AvatarFallback>{(user.displayName || 'P').charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user.displayName || 'Patient'}</span>
                    <span className="text-xs text-muted-foreground">{isGuardian ? "Guardian Account" : user.email}</span>
                </div>
            </div>
             <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton onClick={logout}>
                        <LogOut />
                        <span>Log Out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
  );

  return (
    <SidebarProvider>
      {sidebarContent}
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <SidebarTrigger className="md:hidden" />
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                  <SheetTitle className="sr-only">Patient Menu</SheetTitle>
                  {sidebarContent}
              </SheetContent>
            </Sheet>
            <div className="flex-1" />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
    </SidebarProvider>
  );
}

export default function ProtectedPatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return <PatientLayout>{children}</PatientLayout>;
}
