import { Stethoscope, Bot } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">MediMate</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
             <Link
              href="/symptom-checker"
              className="flex items-center gap-1 transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <Bot className="h-4 w-4" />
              Symptom Checker
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center">
            <Button variant="ghost">Log In</Button>
            <Button>Sign Up</Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
