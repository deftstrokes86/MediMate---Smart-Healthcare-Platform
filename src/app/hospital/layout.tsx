
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
import { Loader2, LayoutDashboard, Users, FileText, UserCheck, MessageSquare, LogOut, Hospital, CalendarCheck, BookHeart, Building, Star, HandHeart } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function HospitalLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && (!user || user.role !== "hospital")) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "hospital") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const navItems = [
    { href: "/hospital/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
    { href: "/hospital/referrals", label: "Referrals", icon: <HandHeart /> },
    { href: "/hospital/appointments", label: "Appointments", icon: <CalendarCheck /> },
    { href: "/hospital/patient-logs", label: "Patient Logs", icon: <BookHeart /> },
    { href: "/hospital/services", label: "Services Offered", icon: <FileText /> },
    { href: "/hospital/profile", label: "Hospital Profile", icon: <UserCheck /> },
    { href: "/hospital/staff", label: "Staff Directory", icon: <Users /> },
    { href: "/hospital/feedback", label: "Feedback & Ratings", icon: <Star /> },
    { href: "/hospital/support", label: "Support", icon: <MessageSquare /> },
  ];

  const sidebarContent = (
      <Sidebar>
        <SidebarHeader>
             <div className="flex items-center gap-2">
                <Hospital className="h-8 w-8 text-primary" />
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
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'Hospital'} />
                    <AvatarFallback>{(user.displayName || 'H').charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user.displayName || 'Hospital'}</span>
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
      <Sidebar>
        <SidebarHeader>
             <div className="flex items-center gap-2">
                <Hospital className="h-8 w-8 text-primary" />
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
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'Hospital'} />
                    <AvatarFallback>{(user.displayName || 'H').charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user.displayName || 'Hospital'}</span>
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
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <SidebarTrigger className="md:hidden" />
                </SheetTrigger>
                <SheetContent side="left" className="pr-0">
                    <SheetTitle className="sr-only">Hospital Menu</SheetTitle>
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

export default function ProtectedHospitalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return <HospitalLayout>{children}</HospitalLayout>;
}
