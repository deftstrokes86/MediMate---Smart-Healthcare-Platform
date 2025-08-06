
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'MediMate Terms of Service - Using Our Telemedicine Platform',
  description: 'Read the Terms of Service for MediMate. Understand your rights and responsibilities when using our telemedicine platform in Nigeria.',
};

const PolicySection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-bold font-headline text-primary mb-3">{title}</h2>
        <div className="prose prose-lg text-foreground/80 max-w-none space-y-4">
            {children}
        </div>
    </div>
);

export default function TermsOfServicePage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-background to-secondary/50">
      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Header Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
            MediMate Terms of Service
          </h1>
          <p className="mx-auto max-w-[800px] text-foreground/80 md:text-xl mt-4">
            Welcome to MediMate. These Terms of Service govern your use of our browser-based telemedicine web app. By using our platform, you agree to these terms.
          </p>
        </section>

        {/* Policy Content Section */}
        <section className="max-w-4xl mx-auto">
             <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-white/20 p-8 md:p-12 shadow-2xl backdrop-blur-md">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>
                <div className="relative z-10">
                    <PolicySection title="1. Using MediMate">
                        <ul>
                            <li><strong>Eligibility:</strong> You must be at least 18 years old or have legal guardian consent to use MediMate. You agree to provide accurate information when creating your profile.</li>
                            <li><strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</li>
                            <li><strong>Permitted Use:</strong> Use MediMate only for lawful purposes, such as booking consultations, ordering lab tests, managing prescriptions, or coordinating hospital visits.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="2. Services Provided">
                        <p>MediMate facilitates:</p>
                        <ul>
                            <li><strong>Symptom Checker:</strong> Use our Gemini AI-powered tool to analyze symptoms and receive potential condition insights.</li>
                            <li><strong>Doctor Consultations:</strong> Connect with board-certified doctors within an 8km radius via video calls, with options for face-blurring or pseudonyms.</li>
                            <li><strong>Lab and Pharmacy Services:</strong> Order tests or prescriptions from providers within a 4km radius (expandable), with locations revealed post-payment.</li>
                            <li><strong>Hospital Coordination:</strong> Match with hospitals for in-person care, with priority given to your doctor’s affiliated hospital unless specified otherwise.</li>
                        </ul>
                    </PolicySection>
                    
                    <PolicySection title="3. User Responsibilities">
                        <ul>
                            <li><strong>Accurate Information:</strong> Provide truthful symptom, health, and location data to ensure proper care.</li>
                            <li><strong>Payments:</strong> Pay for services (consultations, tests, prescriptions, hospital connections) promptly through the app. Costs are displayed upfront.</li>
                            <li><strong>Feedback:</strong> Rate doctors, labs, and pharmacies honestly to maintain platform quality.</li>
                            <li><strong>Compliance:</strong> Follow healthcare provider instructions and legal requirements for care.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="4. Payment Terms">
                        <ul>
                            <li><strong>Transparent Pricing:</strong> Costs for consultations, tests, prescriptions, or hospital connections are shown before confirmation.</li>
                            <li><strong>Secure Transactions:</strong> Payments are processed via trusted third-party providers. Pharmacy, lab, and hospital locations are revealed only after payment confirmation.</li>
                            <li><strong>Refunds:</strong> Refund policies vary by service provider (doctors, labs, pharmacies, hospitals). Contact support@medimate.com for assistance.</li>
                        </ul>
                    </PolicySection>

                     <PolicySection title="5. Privacy and Data">
                        <p>Your data is handled in accordance with our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. By using MediMate, you consent to the collection, use, and sharing of your data as described, including sharing symptom checker results, test results, and prescriptions with healthcare providers.</p>
                    </PolicySection>

                    <PolicySection title="6. Limitations of Service">
                        <ul>
                            <li><strong>Not Emergency Care:</strong> MediMate is not for medical emergencies. Call emergency services for life-threatening conditions.</li>
                            <li><strong>Third-Party Providers:</strong> Doctors, labs, pharmacies, and hospitals are independent providers. MediMate facilitates connections but is not responsible for their actions or service quality.</li>
                            <li><strong>Accuracy:</strong> The Gemini AI symptom checker provides insights but is not a substitute for professional medical advice.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="7. Termination">
                        <p>We may suspend or terminate your account for violating these terms, including misuse of the platform or failure to pay for services. You may delete your account by contacting support@medimate.com.</p>
                    </PolicySection>
                    
                    <PolicySection title="8. Liability">
                         <p>MediMate is provided “as is.” We are not liable for:</p>
                        <ul>
                            <li>Errors or delays in services provided by third-party healthcare providers.</li>
                            <li>Inaccuracies in the symptom checker or user-provided data.</li>
                            <li>Losses due to unauthorized account access if you fail to secure your credentials.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="9. Updates to Terms">
                        <p>We may update these Terms of Service to reflect changes in our platform or legal requirements. You’ll be notified via email or in-app notifications of significant changes.</p>
                    </PolicySection>

                    <PolicySection title="10. Contact Us">
                        <p>Questions about these terms? Reach out to our team:</p>
                        <ul>
                           <li>Email: <a href="mailto:support@medimate.com" className="text-primary hover:underline">support@medimate.com</a></li>
                           <li>Phone: +234 123 456 7890 (Monday–Friday, 9 AM–5 PM WAT)</li>
                           <li>Contact Form: <Link href="/contact" className="text-primary hover:underline">medimate.com/contact</Link></li>
                        </ul>
                    </PolicySection>

                    <div className="text-right text-sm text-muted-foreground mt-12">
                        Last Updated: August 6, 2025
                    </div>
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mt-24">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-primary">
              Ready to Take Control of Your Health?
            </h2>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl mt-4">
             Your health is our priority. We are committed to providing exceptional support every step of the way. 
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
