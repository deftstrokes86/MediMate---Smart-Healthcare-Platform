import { Mail, Phone, Share2, HelpCircle, FileText, Handshake, Info, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export const metadata = {
  title: 'Contact MediMate - We Are Here to Help',
  description: 'Get in touch with MediMate for support, feedback, or inquiries. Reach us via email, phone, or our contact form. We are your dedicated healthcare partner in Nigeria.',
};

const ContactCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-white/20 p-6 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:shadow-xl">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="text-xl font-bold font-headline">{title}</h3>
      </div>
      <div className="text-foreground/80 space-y-2">{children}</div>
    </div>
  </div>
);

export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-background to-secondary/50">
      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Header Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
            Get in Touch with Your Healthcare Partner
          </h1>
          <p className="mx-auto max-w-[800px] text-foreground/80 md:text-xl mt-4">
            At MediMate, we’re dedicated to making your healthcare journey seamless and stress-free. Whether you have questions about virtual consultations, lab services, pharmacy integration, or hospital coordination, our team is ready to assist. Reach out to us for support, feedback, or inquiries—we’re just a message away.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information Section */}
          <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold font-headline mb-6">How to Reach Us</h2>
                <div className="space-y-6">
                    <ContactCard icon={<Mail className="h-7 w-7 text-primary" />} title="Email">
                        <p>Send us your questions at <a href="mailto:support@medimate.com" className="text-primary hover:underline">support@medimate.com</a>. Expect a response within 24 hours.</p>
                    </ContactCard>
                    <ContactCard icon={<Phone className="h-7 w-7 text-primary" />} title="Phone">
                         <p>Call us at +234 123 456 7890 (Available Monday–Friday, 9 AM–5 PM WAT).</p>
                    </ContactCard>
                    <ContactCard icon={<Share2 className="h-7 w-7 text-primary" />} title="Social Media">
                        <p>Connect with us on X, LinkedIn, or other platforms for updates and community engagement.</p>
                    </ContactCard>
                </div>
            </div>
             <div>
                <h2 className="text-3xl font-bold font-headline mb-6">What We Can Help With</h2>
                <div className="grid md:grid-cols-2 gap-4">
                   <div className="flex items-start gap-3 p-4 rounded-lg bg-white/10">
                        <HelpCircle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold">Technical Support</h4>
                            <p className="text-sm text-foreground/70">Trouble accessing the web app or navigating features? We’ll guide you through.</p>
                        </div>
                   </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-white/10">
                        <FileText className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold">Billing Inquiries</h4>
                            <p className="text-sm text-foreground/70">Questions about pricing, insurance, or payments? We’re here to clarify.</p>
                        </div>
                   </div>
                   <div className="flex items-start gap-3 p-4 rounded-lg bg-white/10">
                        <Handshake className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold">Partnership Opportunities</h4>
                            <p className="text-sm text-foreground/70">Interested in joining our network? Let’s talk.</p>
                        </div>
                   </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-white/10">
                        <Info className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold">General Questions</h4>
                            <p className="text-sm text-foreground/70">Curious about how MediMate works? We’ve got you covered.</p>
                        </div>
                   </div>
                </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-white/20 p-8 shadow-2xl backdrop-blur-md">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>
             <div className="relative z-10">
                <h2 className="text-3xl font-bold font-headline mb-6">Send Us a Message</h2>
                <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="Enter your name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="Enter your email" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="How can we help?" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Your message..." className="min-h-[150px]" />
                    </div>
                    <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        Submit Your Inquiry
                    </Button>
                </form>
             </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="text-center mt-24">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-primary">
              Ready to Take Control of Your Health?
            </h2>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl mt-4">
             Your health is our priority. Whether you’re booking a doctor’s appointment, ordering a lab test, or managing prescriptions, we’re committed to providing exceptional support every step of the way. Contact us today and experience the MediMate difference.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                 <Link href="/signup">
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Start Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
                <Link href="/about">
                    <Button size="lg" variant="outline">
                      Explore More
                    </Button>
                </Link>
            </div>
        </section>
      </main>
    </div>
  );
}
