
import * as React from 'react';
import { ArrowRight, Bot, HeartPulse, Hospital, FlaskConical, Pill, ShieldCheck, Search, Users, Wallet, Zap, CheckCircle, UserPlus, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-primary/20 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                    MediMate: Healthcare, Connected and Simplified
                  </h1>
                  <p className="max-w-[600px] text-foreground/80 md:text-xl">
                    Welcome to MediMate, the web app that transforms how you access healthcare. From virtual doctor visits to lab tests, pharmacy services, and hospital coordination, we bring it all together in one secure, browser-based platform.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <img
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="doctor smiling patient"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* Why MediMate Stands Out Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                  Why MediMate?
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Why MediMate Stands Out
                </h2>
                <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is designed to provide a seamless and comprehensive healthcare experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <FeatureCard
                icon={<HeartPulse className="h-8 w-8 text-primary" />}
                title="All-in-One Care"
                description="Connect with doctors, labs, pharmacies, and hospitals in a single, intuitive platform."
              />
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-primary" />}
                title="Browser-Based Access"
                description="Use any device—desktop, laptop, or mobile—to manage your health instantly."
              />
              <FeatureCard
                icon={<Users className="h-8 w-8 text-primary" />}
                title="Trusted Network"
                description="Partnered with board-certified doctors, accredited labs, and top hospitals."
              />
               <FeatureCard
                icon={<ShieldCheck className="h-8 w-8 text-primary" />}
                title="Secure and Private"
                description="HIPAA-compliant encryption ensures your data is always protected."
              />
               <FeatureCard
                icon={<Wallet className="h-8 w-8 text-primary" />}
                title="Affordable and Clear"
                description="Transparent pricing and insurance options make care accessible."
              />
               <FeatureCard
                icon={<Bot className="h-8 w-8 text-primary" />}
                title="AI Symptom Checker"
                description="Our cutting-edge AI analyzes your symptoms to provide a list of potential conditions."
              />
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32  bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                  Core Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Healthcare at Your Fingertips
                </h2>
                <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From intelligent diagnosis to finding the right specialist, we've got you covered.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <FeatureCard
                icon={<Search className="h-8 w-8 text-primary" />}
                title="Virtual Consultations"
                description="Schedule video or phone visits with specialists, available 24/7 for urgent needs."
              />
              <FeatureCard
                icon={<FlaskConical className="h-8 w-8 text-primary" />}
                title="Lab Integration"
                description="Order tests, locate nearby labs, and view results securely in your dashboard."
              />
              <FeatureCard
                icon={<Pill className="h-8 w-8 text-primary" />}
                title="Pharmacy Made Easy"
                description="Request prescriptions, arrange delivery, or pick up medications with ease."
              />
              <FeatureCard
                icon={<Hospital className="h-8 w-8 text-primary" />}
                title="Hospital Connections"
                description="Book appointments and share records for streamlined in-person care."
              />
              <FeatureCard
                icon={<Users className="h-8 w-8 text-primary" />}
                title="User-Friendly Design"
                description="Navigate appointments, results, and records in a multilingual, accessible interface."
              />
               <FeatureCard
                icon={<Bot className="h-8 w-8 text-primary" />}
                title="AI Symptom Checker"
                description="Our cutting-edge AI analyzes your symptoms to provide a list of potential conditions, helping you have a more informed conversation with your doctor."
              />
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
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


        {/* Call to Action Section */}
        <section className="w-full py-20 bg-primary/10">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-primary">
              Join the Future of Healthcare
            </h2>
            <p className="mx-auto max-w-[600px] text-foreground/80 md:text-xl mt-4">
             With MediMate, you’re in control of your health like never before. Whether it’s a quick consultation, a lab test, or hospital care, our platform makes it effortless and reliable. Sign up today and experience healthcare that’s connected, convenient, and built for you.
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Sign Up Today
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-white/20 p-6 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:shadow-xl">
       <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>
       <div className="relative z-10 flex flex-col gap-4 text-left">
        {icon}
        <h3 className="text-xl font-bold font-headline">{title}</h3>
        <p className="text-foreground/80">{description}</p>
      </div>
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
