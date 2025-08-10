
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
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Loader2, Users, ShieldCheck, BarChart, Settings, LogOut, Stethoscope, LayoutDashboard, Hospital, FlaskConical, Pill, UserCheck, MessageSquare, Megaphone, FolderCog, BookUser, Search } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && (!user || (user.role !== "admin" && user.role !== "super_admin"))) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user || (user.role !== "admin" && user.role !== "super_admin")) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
    { 
      group: "Verifications",
      icon: <UserCheck />,
      items: [
        { href: "/admin/verifications/doctors", label: "Doctors", icon: <Stethoscope /> },
        { href: "/admin/verifications/hospitals", label: "Hospitals", icon: <Hospital /> },
        { href: "/admin/verifications/labs", label: "Labs", icon: <FlaskConical /> },
        { href: "/admin/verifications/pharmacies", label: "Pharmacies", icon: <Pill /> },
      ]
    },
    { 
      group: "All Users",
      icon: <Users />,
      items: [
        { href: "/admin/users/patients", label: "Patients" },
        { href: "/admin/users/staff", label: "Medical Staff" },
      ]
    },
    { href: "/admin/announcements", label: "Announcements", icon: <Megaphone /> },
    { href: "/admin/support", label: "Support Inbox", icon: <MessageSquare /> },
    { href: "/admin/admins", label: "Admin Control", icon: <BookUser /> },
    { href: "/admin/logs", label: "Reports / Logs", icon: <BarChart /> },
    { href: "/admin/settings", label: "System Settings", icon: <FolderCog /> },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
             <div className="flex items-center gap-2">
                <Stethoscope className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold font-headline">MediMate</span>
             </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item, index) => (
              item.group ? (
                <SidebarGroup key={index}>
                  <SidebarGroupLabel className="flex items-center gap-2">
                    {item.icon} {item.group}
                  </SidebarGroupLabel>
                  {item.items.map(subItem => (
                     <SidebarMenuItem key={subItem.href}>
                        <SidebarMenuButton asChild isActive={pathname.startsWith(subItem.href)}>
                            <Link href={subItem.href}>
                                {subItem.icon && <div className="w-4 h-4" />} 
                                <span>{subItem.label}</span>
                            </Link>
                        </SidebarMenuButton>
                     </SidebarMenuItem>
                  ))}
                </SidebarGroup>
              ) : (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                        <Link href={item.href}>
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              )
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className="flex items-center gap-2 p-2">
                 <Avatar>
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'Admin'} />
                    <AvatarFallback>{(user.displayName || 'A').charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user.displayName || 'Admin'}</span>
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
                  <SheetTitle className="sr-only">Admin Menu</SheetTitle>
                  <Sidebar>
                    <SidebarHeader>
                        <div className="flex items-center gap-2">
                            <Stethoscope className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold font-headline">MediMate</span>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                      <SidebarMenu>
                        {navItems.map((item, index) => (
                          item.group ? (
                            <SidebarGroup key={index}>
                              <SidebarGroupLabel className="flex items-center gap-2">
                                {item.icon} {item.group}
                              </SidebarGroupLabel>
                              {item.items.map(subItem => (
                                <SidebarMenuItem key={subItem.href}>
                                    <SidebarMenuButton asChild isActive={pathname.startsWith(subItem.href)}>
                                        <Link href={subItem.href}>
                                            {subItem.icon && <div className="w-4 h-4" />} 
                                            <span>{subItem.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                              ))}
                            </SidebarGroup>
                          ) : (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                                    <Link href={item.href}>
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                          )
                        ))}
                      </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <div className="flex items-center gap-2 p-2">
                            <Avatar>
                                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'Admin'} />
                                <AvatarFallback>{(user.displayName || 'A').charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">{user.displayName || 'Admin'}</span>
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
            </SheetContent>
          </Sheet>
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="w-full rounded-lg bg-white pl-8 md:w-[200px] lg:w-[320px]" />
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
                <Users className="h-5 w-5" />
            </Button>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
    </SidebarProvider>
  );
}

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return <AdminLayout>{children}</AdminLayout>;
}
