
"use client";

import { Stethoscope, Bot, Menu, Search, Info, MessageSquare, ChevronDown, UserCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
import { useAuth } from '@/contexts/auth-context';
  
const navLinks = [
  { href: "/symptom-checker", label: "Symptom Checker", icon: <Bot className="h-4 w-4" /> },
  { href: "/find-a-doctor", label: "Find a Doctor", icon: <Search className="h-4 w-4" /> },
  { href: "/contact", label: "Contact", icon: <MessageSquare className="h-4 w-4" /> },
];

const aboutLinks = [
    { href: "/features", label: "Features" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/faq", label: "FAQ" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
]

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">MediMate</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 font-medium text-foreground/60 transition-colors hover:text-foreground/80"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
             <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 font-medium text-foreground/60 transition-colors hover:text-foreground/80 outline-none">
                     <Info className="h-4 w-4" />
                    About Us
                    <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem asChild><Link href="/about">About MediMate</Link></DropdownMenuItem>
                    {aboutLinks.map(link => (
                         <DropdownMenuItem key={link.href} asChild>
                            <Link href={link.href}>{link.label}</Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {user ? (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                        <UserCircle className="h-5 w-5" />
                        {user.displayName || user.email}
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" asChild><Link href="/login">Log In</Link></Button>
                <Button asChild><Link href="/signup">Sign Up</Link></Button>
             </div>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <SheetTitle>Mobile Menu</SheetTitle>
              <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
                <Stethoscope className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline text-lg">MediMate</span>
              </Link>
              <div className="flex flex-col gap-4">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 text-lg font-medium text-foreground/80 hover:text-primary"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="about-us" className="border-b-0">
                        <AccordionTrigger className="flex items-center gap-2 text-lg font-medium text-foreground/80 hover:text-primary hover:no-underline">
                             <Info className="h-4 w-4" />
                             About Us
                        </AccordionTrigger>
                        <AccordionContent className="pl-8 flex flex-col gap-4 pt-2">
                             <Link href="/about" className="text-base font-medium text-foreground/70 hover:text-primary">About MediMate</Link>
                             {aboutLinks.map(link => (
                                <Link key={link.href} href={link.href} className="text-base font-medium text-foreground/70 hover:text-primary">{link.label}</Link>
                             ))}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
              </div>
              <div className="mt-auto flex flex-col gap-2 pt-6">
                 {user ? (
                    <>
                        <Button variant="outline" asChild><Link href="/dashboard">Dashboard</Link></Button>
                        <Button variant="destructive" onClick={logout}>Log Out</Button>
                    </>
                 ) : (
                    <>
                        <Button variant="ghost" asChild><Link href="/login">Log In</Link></Button>
                        <Button asChild><Link href="/signup">Sign Up</Link></Button>
                    </>
                 )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
