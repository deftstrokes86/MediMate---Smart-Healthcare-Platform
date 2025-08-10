
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
import { Loader2, LayoutDashboard, Users, FileText, UserCheck, MessageSquare, LogOut, Pill, Archive, ClipboardList } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function PharmacyLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && (!user || user.role !== "pharmacist")) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "pharmacist") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const navItems = [
    { href: "/pharmacy/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
    { href: "/pharmacy/orders", label: "Prescription Orders", icon: <ClipboardList /> },
    { href: "/pharmacy/inventory", label: "Upload Inventory", icon: <Archive /> },
    { href: "/pharmacy/log", label: "Dispense Log", icon: <FileText /> },
    { href: "/pharmacy/profile", label: "Profile & Verification", icon: <UserCheck /> },
    { href: "/pharmacy/support", label: "Support", icon: <MessageSquare /> },
  ];

  const sidebarContent = (
      <Sidebar>
        <SidebarHeader>
             <div className="flex items-center gap-2">
                <Pill className="h-8 w-8 text-primary" />
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
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'Pharmacy'} />
                    <AvatarFallback>{(user.displayName || 'P').charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user.displayName || 'Pharmacy'}</span>
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
                  <SheetTitle className="sr-only">Pharmacy Menu</SheetTitle>
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

export default function ProtectedPharmacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return <PharmacyLayout>{children}</PharmacyLayout>;
}
