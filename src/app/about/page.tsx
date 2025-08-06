import { ShieldCheck, Users, Zap, Wallet, Network, Video, FlaskConical, Pill, Hospital, Accessibility, Activity, CheckCircle, ArrowRight, Bot, UserPlus, Calendar, FileText, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'About MediMate - Your Trusted Telemedicine Partner in Nigeria',
  description: 'Learn how MediMate is revolutionizing healthcare in Nigeria. Our telemedicine platform offers virtual consultations, lab services, pharmacy integration, and hospital coordination—all from your browser.',
};

const FeatureCard = ({ icon, title, description, children }: { icon: React.ReactNode, title: string, description?: string, children?: React.ReactNode }) => (
  <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-white/20 p-6 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:shadow-xl">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>
    <div className="relative z-10 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {icon}
        <h3 className="text-2xl font-bold font-headline">{title}</h3>
      </div>
      {description && <p className="text-foreground/80">{description}</p>}
      {children}
    </div>
  </div>
);


const BenefitCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="relative overflow-hidden rounded-lg border border-primary/10 bg-white/10 p-5 shadow-lg backdrop-blur-sm">
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0">{icon}</div>
            <div>
                <h4 className="font-bold text-lg font-headline">{title}</h4>
                <p className="text-sm text-foreground/70">{description}</p>
            </div>
        </div>
    </div>
);

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-background to-secondary/50">
      <main>
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-primary/20 to-background">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
              Transform Your Healthcare Journey with MediMate
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl mt-4">
              Imagine a world where your healthcare needs are met with unparalleled ease, speed, and precision—no long waits, no endless paperwork, no fragmented care. Welcome to MediMate, the ultimate telemedicine web app that redefines how you connect with healthcare.
            </p>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Why Choose MediMate?</h2>
              <p className="max-w-[800px] mx-auto text-foreground/80 mt-2 md:text-lg">
                MediMate isn’t just another telemedicine platform—it’s a revolution in how you experience healthcare. Designed with you at the heart of every feature, our web app eliminates the barriers of traditional healthcare systems, delivering a seamless, secure, and personalized experience.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BenefitCard icon={<Network className="h-8 w-8 text-accent" />} title="Comprehensive Care Ecosystem" description="Connect with doctors, labs, pharmacies, and hospitals in one intuitive platform." />
              <BenefitCard icon={<Zap className="h-8 w-8 text-accent" />} title="Instant Browser Access" description="No downloads, no hassle—access world-class healthcare from your desktop, laptop, or mobile browser." />
              <BenefitCard icon={<Users className="h-8 w-8 text-accent" />} title="Trusted and Verified Network" description="Partnered with board-certified doctors, accredited labs, and leading hospitals." />
              <BenefitCard icon={<Wallet className="h-8 w-8 text-accent" />} title="Transparent and Affordable" description="Clear pricing and insurance integration make quality healthcare accessible to everyone." />
              <BenefitCard icon={<ShieldCheck className="h-8 w-8 text-accent" />} title="Privacy You Can Trust" description="HIPAA-compliant encryption and robust security protocols safeguard your data." />
               <BenefitCard icon={<Bot className="h-8 w-8 text-accent" />} title="AI-Powered Symptom Checker" description="Get instant insights into your symptoms with our intelligent AI assistant." />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">A Deeper Look at Our Features</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FeatureCard icon={<Video className="h-10 w-10 text-primary" />} title="Virtual Consultations">
                <p className="text-foreground/80">Your health doesn’t follow a 9-to-5 schedule, and neither do we. Connect with board-certified doctors across a wide range of specialties.</p>
                <ul className="space-y-2 mt-4 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-1 text-accent flex-shrink-0" /><span><strong>Flexible Scheduling:</strong> Book video or phone consultations that fit your life.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-1 text-accent flex-shrink-0" /><span><strong>24/7 Urgent Care Access:</strong> Connect with doctors for non-emergency conditions in minutes.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-1 text-accent flex-shrink-0" /><span><strong>Chronic Condition Support:</strong> Manage ongoing conditions with regular check-ins.</span></li>
                </ul>
              </FeatureCard>
              <FeatureCard icon={<FlaskConical className="h-10 w-10 text-primary" />} title="Trusted Lab Services">
                <p className="text-foreground/80">Accurate diagnostics are the foundation of effective treatment. We make lab testing effortless and reliable.</p>
                 <ul className="space-y-2 mt-4 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-1 text-accent flex-shrink-0" /><span><strong>Streamlined Test Ordering:</strong> Order tests directly through the platform with a few clicks.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-1 text-accent flex-shrink-0" /><span><strong>Nationwide Lab Network:</strong> Find accredited labs near you with real-time availability.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-1 text-accent flex-shrink-0" /><span><strong>Secure and Fast Results:</strong> Access your lab results securely within the app.</span></li>
                </ul>
              </FeatureCard>
              <FeatureCard icon={<Pill className="h-10 w-10 text-primary" />} title="Pharmacy Integration">
                <p className="text-foreground/80">Managing prescriptions has never been easier. We connect you to a network of trusted pharmacies.</p>
                 <ul className="space-y-2 mt-4 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-1 text-accent flex-shrink-0" /><span><strong>Effortless Prescription Management:</strong> Send prescriptions directly to your preferred pharmacy.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-1 text-accent flex-shrink-0" /><span><strong>Convenient Delivery Options:</strong> Choose home delivery or local pickup.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-1 text-accent flex-shrink-0" /><span><strong>Smart Refill Reminders:</strong> Never miss a dose with automated notifications.</span></li>
                </ul>
              </FeatureCard>
              <FeatureCard icon={<Hospital className="h-10 w-10 text-primary" />} title="Hospital Coordination">
                <p className="text-foreground/80">When in-person care is needed, MediMate ensures smooth coordination with hospitals.</p>
                <ul className="space-y-2 mt-4 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-1 text-accent flex-shrink-0" /><span><strong>Easy Appointment Booking:</strong> Schedule hospital visits or procedures directly.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-1 text-accent flex-shrink-0" /><span><strong>Integrated Medical Records:</strong> Ensure continuity of care by sharing your records.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-1 text-accent flex-shrink-0" /><span><strong>Specialist Referrals:</strong> Receive and manage referrals to hospital-based specialists.</span></li>
                </ul>
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="space-y-2">
                         <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                            How It Works
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                            Getting Started is Simple
                        </h2>
                         <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Follow these simple steps to take control of your healthcare.
                        </p>
                    </div>
                </div>

                <div className="relative">
                    {/* Dashed line */}
                    <div className="absolute left-1/2 top-12 bottom-12 w-0.5 bg-border border-l-2 border-dashed border-primary/50 hidden md:block" aria-hidden="true"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <StepCard icon={<UserPlus />} title="1. Sign Up" description="Create a free account in minutes to get started." />
                        <div />
                        <div />
                        <StepCard icon={<Calendar />} title="2. Book a Consultation" description="Connect with a doctor via video or phone." textAlignment="text-right" />
                        <StepCard icon={<FileText />} title="3. Access Services" description="Order lab tests, request prescriptions, or schedule hospital visits." />
                         <div />
                         <div />
                        <StepCard icon={<HeartPulse />} title="4. Manage Your Health" description="Track everything in your secure, unified dashboard." textAlignment="text-right" />
                    </div>
                </div>
            </div>
        </section>


         {/* Designed for You Section */}
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Designed for You: Secure, Intuitive, and Inclusive</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <BenefitCard icon={<ShieldCheck className="h-8 w-8 text-primary" />} title="HIPAA-Compliant Security" description="Your data is protected with state-of-the-art encryption and privacy standards." />
                 <BenefitCard icon={<Activity className="h-8 w-8 text-primary" />} title="Unified Health Dashboard" description="Manage all your healthcare needs in one sleek, easy-to-navigate interface." />
                 <BenefitCard icon={<Accessibility className="h-8 w-8 text-primary" />} title="Accessibility for All" description="Our web app is optimized for all devices and screen readers, making healthcare inclusive." />
            </div>
          </div>
        </section>


        {/* Call to Action Section */}
        <section className="w-full py-20 bg-primary/10">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-primary">
              Join the Healthcare Revolution Today
            </h2>
            <p className="mx-auto max-w-[600px] text-foreground/80 md:text-xl mt-4">
              Don’t let outdated healthcare systems hold you back. With MediMate, you’re one step away from a smarter, more connected way to manage your health.
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const StepCard = ({ icon, title, description, textAlignment = 'text-left' }: { icon: React.ReactNode, title: string, description: string, textAlignment?: string }) => (
    <div className={`relative ${textAlignment}`}>
        <div className="inline-block bg-background p-4 rounded-full border-2 border-primary mb-4 relative z-10">
            {React.cloneElement(icon as React.ReactElement, { className: "h-8 w-8 text-primary" })}
        </div>
        <h3 className="text-2xl font-bold font-headline">{title}</h3>
        <p className="text-foreground/80 mt-2">{description}</p>
    </div>
);
