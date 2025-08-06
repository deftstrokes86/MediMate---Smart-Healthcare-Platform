import { ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'MediMate Privacy Policy - Your Data Security is Our Priority',
  description: 'Learn how MediMate protects your personal and medical information. Our privacy policy details our commitment to HIPAA compliance and data security in Nigeria.',
};

const PolicySection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-bold font-headline text-primary mb-3">{title}</h2>
        <div className="prose prose-lg text-foreground/80 max-w-none space-y-4">
            {children}
        </div>
    </div>
);

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-background to-secondary/50">
      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Header Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
            MediMate Privacy Policy
          </h1>
          <p className="mx-auto max-w-[800px] text-foreground/80 md:text-xl mt-4">
            At MediMate, we are committed to protecting your personal and medical information. This Privacy Policy explains how we collect, use, store, and safeguard your data, ensuring compliance with HIPAA and industry-leading security standards.
          </p>
        </section>

        {/* Policy Content Section */}
        <section className="max-w-4xl mx-auto">
             <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-white/20 p-8 md:p-12 shadow-2xl backdrop-blur-md">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>
                <div className="relative z-10">
                    <PolicySection title="1. Information We Collect">
                        <p>We collect the following types of information to provide and improve our services:</p>
                        <ul>
                            <li><strong>Personal Information:</strong> When you create a profile, we collect your name, email, location, and contact details. You may choose a pseudonym for consultations to enhance anonymity.</li>
                            <li><strong>Health Information:</strong> Data entered into our Gemini AI-powered symptom checker, consultation notes, lab results, prescriptions, and hospital records are collected with your consent.</li>
                            <li><strong>Payment Information:</strong> Billing details for consultations, lab tests, prescriptions, or hospital connections are processed securely through trusted payment providers.</li>
                            <li><strong>Usage Data:</strong> Information about how you interact with the app, such as browser type, device details, and navigation patterns, to improve user experience.</li>
                            <li><strong>Location Data:</strong> Your location is used to match you with doctors, labs, pharmacies, or hospitals within a specified radius (e.g., 8km for doctors, 4km for labs/pharmacies).</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="2. How We Use Your Information">
                         <p>Your data enables us to deliver a seamless healthcare experience:</p>
                        <ul>
                            <li><strong>Service Delivery:</strong> Process symptom checker results, facilitate consultations, order lab tests, manage prescriptions, and coordinate hospital visits.</li>
                            <li><strong>Personalization:</strong> Tailor doctor matches, lab, and pharmacy options based on your location and preferences.</li>
                            <li><strong>Communication:</strong> Send appointment reminders, test result notifications, and follow-up schedules via email or in-app notifications.</li>
                            <li><strong>Improvement:</strong> Analyze anonymized usage data to enhance app performance and features.</li>
                            <li><strong>Compliance:</strong> Share data with healthcare providers (doctors, labs, pharmacies, hospitals) only as needed to fulfill your care requests, with your consent.</li>
                        </ul>
                    </PolicySection>
                    
                    <PolicySection title="3. How We Protect Your Data">
                         <p>We prioritize your privacy with robust security measures:</p>
                        <ul>
                            <li><strong>HIPAA Compliance:</strong> All health data is handled in accordance with HIPAA regulations.</li>
                            <li><strong>Encryption:</strong> Your data is protected with industry-standard encryption during transmission and storage.</li>
                            <li><strong>Anonymity Options:</strong> Choose to blur your face or use a pseudonym during video consultations for added privacy.</li>
                            <li><strong>Restricted Access:</strong> Pharmacy, lab, and hospital names/locations are revealed only after payment confirmation to protect your information.</li>
                            <li><strong>Secure Payments:</strong> Payment details are processed through trusted, PCI-compliant third-party providers.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="4. Sharing Your Information">
                        <p>We share your data only when necessary and with your consent:</p>
                        <ul>
                            <li><strong>Healthcare Providers:</strong> Doctors, labs, pharmacies, and hospitals receive relevant data (e.g., symptom checker results, prescriptions, test orders) to provide care.</li>
                            <li><strong>Service Providers:</strong> Third-party vendors (e.g., payment processors, ride-share apps for pharmacy delivery) access limited data under strict confidentiality agreements.</li>
                            <li><strong>Legal Requirements:</strong> We may disclose data if required by law or to protect the safety of users or the public.</li>
                        </ul>
                    </PolicySection>

                     <PolicySection title="5. Your Choices and Rights">
                        <p>You have control over your data:</p>
                        <ul>
                           <li><strong>Access and Update:</strong> View or edit your profile and health data in your dashboard.</li>
                            <li><strong>Opt-Out:</strong> Manage notification preferences or opt out of non-essential communications.</li>
                            <li><strong>Data Deletion:</strong> Request deletion of your account by contacting support@medimate.com, subject to legal retention requirements.</li>
                            <li><strong>Anonymity:</strong> Use face-blurring or pseudonyms during consultations for enhanced privacy.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="6. Cookies and Tracking">
                        <p>We use cookies to improve your experience, such as remembering login details or analyzing app usage. You can manage cookie preferences in your browser settings.</p>
                    </PolicySection>

                    <PolicySection title="7. Updates to This Policy">
                        <p>We may update this Privacy Policy to reflect changes in our services or legal requirements. We’ll notify you via email or in-app notifications of significant updates.</p>
                    </PolicySection>
                    
                    <PolicySection title="8. Contact Us">
                        <p>Questions about your privacy? Reach out to our team:</p>
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
