import { UserPlus, Bot, Search, Pill, FlaskConical, Hospital, LayoutDashboard, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'How MediMate Works - Your Path to Seamless Healthcare',
  description: 'Learn how MediMate simplifies your health journey in a few easy steps. From AI-powered symptom checking to connecting with doctors, labs, and pharmacies—all from your browser.',
};

const StepCard = ({ icon, step, title, description }: { icon: React.ReactNode, step: number, title: string, description: string }) => (
    <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-white/20 p-8 shadow-lg backdrop-blur-md transition-all hover:shadow-xl hover:scale-[1.02]">
        <div className="absolute top-4 right-4 bg-accent/20 text-accent-foreground font-bold rounded-full h-10 w-10 flex items-center justify-center text-lg font-headline">{step}</div>
        <div className="relative z-10">
            <div className="mb-4 text-primary">{icon}</div>
            <h3 className="text-2xl font-bold font-headline mb-2">{title}</h3>
            <p className="text-foreground/80">{description}</p>
        </div>
    </div>
);

export default function HowItWorksPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-background to-secondary/50">
      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Header Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
            How MediMate Works: Your Path to Seamless Healthcare
          </h1>
          <p className="mx-auto max-w-[800px] text-foreground/80 md:text-xl mt-4">
            MediMate makes accessing doctors, labs, pharmacies, and hospitals effortless and intuitive. Our browser-based web app guides you through every step, from AI-powered symptom analysis to personalized care, all while prioritizing your privacy and convenience. Here’s how it works in a few simple steps.
          </p>
        </section>

        {/* Step-by-Step Guide Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <StepCard 
                icon={<UserPlus className="h-10 w-10" />} 
                step={1}
                title="Create Your Profile"
                description="Join MediMate by creating a free account in minutes. Add your location and preferences to unlock tailored healthcare options near you."
            />
             <StepCard 
                icon={<Bot className="h-10 w-10" />} 
                step={2}
                title="Check Your Symptoms"
                description="Use our Gemini AI symptom checker to input your symptoms and receive a list of possible conditions with percentage certainty and actionable insights."
            />
             <StepCard 
                icon={<Search className="h-10 w-10" />} 
                step={3}
                title="Connect with a Doctor"
                description="Find nearby doctors on a map, and schedule a private video call. Your symptom data is automatically shared for an informed consultation."
            />
             <StepCard 
                icon={<Pill className="h-10 w-10" />} 
                step={4}
                title="Access Prescriptions"
                description="Choose a local pharmacy, view medication costs, pay securely, and arrange for pickup or delivery. Pharmacy details are revealed after payment."
            />
            <StepCard 
                icon={<FlaskConical className="h-10 w-10" />} 
                step={5}
                title="Order Lab Tests"
                description="Select a lab for your tests, schedule an appointment, pay securely, and get results on your dashboard, shared with your doctor."
            />
            <StepCard 
                icon={<Hospital className="h-10 w-10" />} 
                step={6}
                title="Coordinate Hospital Care"
                description="If needed, seamlessly connect with a recommended or chosen hospital. Secure a connection fee to access details and services."
            />
             <div className="md:col-span-2 lg:col-span-3 lg:w-1/3 lg:mx-auto">
                 <StepCard 
                    icon={<LayoutDashboard className="h-10 w-10" />} 
                    step={7}
                    title="Manage and Follow Up"
                    description="Track everything on your unified dashboard—appointments, results, and prescriptions. Rate your experiences to help our community."
                />
            </div>
        </div>

        {/* Call to Action Section */}
        <section className="text-center mt-24">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-primary">
              Start Your Journey Today
            </h2>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl mt-4">
              With MediMate, healthcare is local, private, and effortless. Sign up now to experience AI-driven diagnostics, trusted providers, and a seamless care journey—all from your browser.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                 <Link href="/signup">
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
                <Link href="/about">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                </Link>
            </div>
        </section>
      </main>
    </div>
  );
}
