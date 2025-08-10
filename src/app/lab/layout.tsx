
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
import { Loader2, LayoutDashboard, Users, FileText, FlaskConical, UserCheck, MessageSquare, LogOut, Beaker } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function MedicalLabLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && (!user || user.role !== "medical_lab")) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "medical_lab") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const navItems = [
    { href: "/lab/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
    { href: "/lab/test-requests", label: "Test Requests", icon: <Beaker /> },
    { href: "/lab/upload-results", label: "Upload Results", icon: <FileText /> },
    { href: "/lab/patients", label: "My Patients", icon: <Users /> },
    { href: "/lab/profile", label: "Profile & Verification", icon: <UserCheck /> },
    { href: "/lab/support", label: "Support", icon: <MessageSquare /> },
  ];

  const sidebarContent = (
      <Sidebar>
        <SidebarHeader>
             <div className="flex items-center gap-2">
                <FlaskConical className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold font-headline">MediMate</span>
             </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
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
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'Lab'} />
                    <AvatarFallback>{(user.displayName || 'L').charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user.displayName || 'Medical Lab'}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
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
                  <SheetTitle className="sr-only">Lab Menu</SheetTitle>
                  {sidebarContent}
              </SheetContent>
            </Sheet>
            <div className="flex-1" />
            <Button variant="ghost" size="icon" className="rounded-full">
                <Users className="h-5 w-5" />
            </Button>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
    </SidebarProvider>
  );
}

export default function ProtectedMedicalLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return <MedicalLabLayout>{children}</MedicalLabLayout>;
}
