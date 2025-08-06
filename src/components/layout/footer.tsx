
import Link from "next/link";
import { Stethoscope, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Stethoscope className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold font-headline">MediMate</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your AI-powered health companion.
            </p>
          </div>
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-semibold mb-4 font-headline">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/symptom-checker" className="text-sm text-muted-foreground hover:text-primary">Symptom Checker</Link></li>
              <li><Link href="/find-a-doctor" className="text-sm text-muted-foreground hover:text-primary">Find a Doctor</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-1">
             <h3 className="font-semibold mb-4 font-headline">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-semibold mb-4 font-headline">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest health tips.
            </p>
            <form className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Email" className="flex-1" />
              <Button type="submit" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} MediMate. All rights reserved.
          </p>
          <p className="mt-2">
            This platform is for informational purposes only and does not constitute medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
