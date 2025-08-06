
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'MediMate Parental Consent Policy - Protecting Minors on Our Platform',
  description: 'Learn how MediMate ensures the safety and privacy of patients under 18 through our parental consent policy, compliant with NDPR.',
};

const PolicySection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-bold font-headline text-primary mb-3">{title}</h2>
        <div className="prose prose-lg text-foreground/80 max-w-none space-y-4">
            {children}
        </div>
    </div>
);

export default function ParentalConsentPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-background to-secondary/50">
      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Header Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
            Parental Consent Policy (For Patients Under 18)
          </h1>
          <p className="mx-auto max-w-[800px] text-foreground/80 md:text-xl mt-4">
            Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </section>

        {/* Policy Content Section */}
        <section className="max-w-4xl mx-auto">
             <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-white/20 p-8 md:p-12 shadow-2xl backdrop-blur-md">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>
                <div className="relative z-10">
                    <PolicySection title="Policy Purpose">
                        <p>To ensure compliance with the NDPR and other healthcare regulations regarding the use of digital health services by minors.</p>
                    </PolicySection>

                    <PolicySection title="Who This Applies To">
                        <p>Patients under the age of 18 (the age of majority in Nigeria). These patients may only access services if:</p>
                        <ul>
                            <li>A parent or legal guardian registers and manages the account.</li>
                            <li>The guardian provides explicit consent for data usage and medical access.</li>
                        </ul>
                    </PolicySection>
                    
                    <PolicySection title="What We Require from the Guardian">
                        <ul>
                            <li>Guardian’s Full Name & Valid ID</li>
                            <li>Relationship to Minor</li>
                            <li>Minor’s Full Name & Date of Birth</li>
                            <li>Consent to Collect & Process the Minor’s Health Data</li>
                            <li>Consent to Communicate Medical Information with the Guardian</li>
                            <li>Acknowledgment that Guardian is Responsible for Decisions on Behalf of the Child</li>
                        </ul>
                    </PolicySection>

                     <PolicySection title="Consent Statement (During Onboarding)">
                        <p>“I hereby confirm that I am the parent/legal guardian of [Child’s Full Name], born on [DOB]. I give my full and informed consent for the collection, processing, and sharing of [his/her/their] personal and medical data through the MediMate platform for the purpose of accessing healthcare services.</p>
                        <p>I understand and accept responsibility for managing this account and making medical decisions on behalf of the minor. I may withdraw this consent at any time by contacting support.”</p>
                    </PolicySection>

                    <PolicySection title="Verification Steps (Optional but Recommended for High-Risk Services)">
                        <ul>
                            <li>Upload of government-issued ID for guardian</li>
                            <li>Upload of birth certificate or school ID for minor</li>
                            <li>Video verification call (for sensitive services or prescriptions)</li>
                        </ul>
                    </PolicySection>

                     <PolicySection title="Privacy & Access">
                        <ul>
                            <li>The child’s medical records will be visible only to the guardian and verified healthcare professionals.</li>
                            <li>Guardians may request deletion of the child’s data at any time.</li>
                        </ul>
                    </PolicySection>

                    <div className="text-right text-sm text-muted-foreground mt-12">
                        Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mt-24">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-primary">
              Ready to Get Started?
            </h2>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl mt-4">
             If you are a parent or guardian, you can create an account to manage the healthcare of a minor.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                 <Link href="/signup">
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Create an Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
                <Link href="/contact">
                    <Button size="lg" variant="outline">
                      Contact Support
                    </Button>
                </Link>
            </div>
        </section>
      </main>
    </div>
  );
}
