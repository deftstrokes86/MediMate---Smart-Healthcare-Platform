
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'MediMate Privacy Policy - Your Data Security is Our Priority',
  description: 'Learn how MediMate protects your personal and medical information. Our privacy policy details our commitment to NDPR compliance and data security in Nigeria.',
};

const PolicySection = ({ title, children }: { title:string, children: React.ReactNode }) => (
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
            MediMate Privacy Policy & Consent Agreement
          </h1>
          <p className="mx-auto max-w-[800px] text-foreground/80 md:text-xl mt-4">
            Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
           <p className="mx-auto max-w-[800px] text-foreground/80 md:text-l mt-4">
            Owner/Operator: MediMate Technologies Ltd., Registered in Nigeria
          </p>
        </section>

        {/* Policy Content Section */}
        <section className="max-w-4xl mx-auto">
             <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-white/20 p-8 md:p-12 shadow-2xl backdrop-blur-md">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>
                <div className="relative z-10">
                    <PolicySection title="1. Introduction">
                        <p>This Privacy Policy outlines how MediMate ("we", "our", or "us") collects, uses, stores, and protects your personal data in accordance with the Nigeria Data Protection Regulation (NDPR) 2019. By signing up and using our services, you consent to the practices described below.</p>
                    </PolicySection>

                    <PolicySection title="2. Data We Collect">
                        <p>We may collect the following categories of personal data:</p>
                        <p><strong>a. Personal Identification Information</strong></p>
                        <ul>
                            <li>Full name</li>
                            <li>Date of birth</li>
                            <li>Gender</li>
                            <li>Address</li>
                            <li>Phone number(s)</li>
                            <li>Email address</li>
                            <li>National Identification Number (NIN), passport, driver’s license (where required)</li>
                        </ul>
                         <p><strong>b. Health & Medical Data</strong></p>
                        <ul>
                           <li>Medical history</li>
                            <li>Allergies</li>
                            <li>Chronic conditions</li>
                            <li>Medications</li>
                            <li>Family health history</li>
                            <li>Consultation records</li>
                            <li>Laboratory results (if applicable)</li>
                        </ul>
                         <p><strong>c. Technical & Device Data</strong></p>
                        <ul>
                            <li>Device type, IP address, and usage logs</li>
                            <li>Location data (with consent)</li>
                        </ul>
                        <p><strong>d. Financial & Payment Data</strong></p>
                        <ul>
                           <li>Bank information (for refunds or payments)</li>
                           <li>Payment method (e.g. card or wallet)</li>
                        </ul>
                    </PolicySection>
                    
                    <PolicySection title="3. Why We Collect Your Data">
                         <p>We collect this data to:</p>
                        <ul>
                            <li>Deliver healthcare services (in-person, telemedicine, pharmacy, labs, hospitals)</li>
                            <li>Maintain accurate health records</li>
                            <li>Process payments and refunds</li>
                            <li>Enable appointment scheduling and follow-ups</li>
                            <li>Send important medical updates and reminders</li>
                            <li>Comply with regulatory obligations under NDPR, MDCN, PCN, and NAFDAC</li>
                            <li>Improve our services and user experience</li>
                        </ul>
                    </PolicySection>

                     <PolicySection title="4. Consent for Medical Data">
                        <p>By using our platform, you expressly consent to the collection, storage, and processing of your sensitive health data for the purposes stated above. You may withdraw your consent at any time by contacting us (see Section 11), though this may affect your ability to use the service.</p>
                    </PolicySection>

                    <PolicySection title="5. Who We May Share Your Data With">
                        <p>Your data may be shared only with the following:</p>
                        <ul>
                            <li>Licensed doctors, laboratories, and pharmacists registered on our platform</li>
                            <li>Regulatory authorities when required by law</li>
                            <li>Our IT, security, and cloud service providers (under strict confidentiality)</li>
                            <li>Insurance providers (if you choose to link them)</li>
                            <li>Emergency contacts (only in the case of medical emergencies)</li>
                        </ul>
                        <p>We do not sell or lease your personal data to any third party.</p>
                    </PolicySection>

                     <PolicySection title="6. Data Storage & Security">
                        <ul>
                            <li>Your data is stored securely in encrypted formats.</li>
                            <li>We use secure cloud hosting (e.g., Google Cloud, AWS) with access controls.</li>
                            <li>All health records are stored in compliance with best practices and NDPR standards.</li>
                            <li>Access to your records is strictly restricted to verified professionals and you.</li>
                        </ul>
                    </PolicySection>

                     <PolicySection title="7. Data Retention Policy">
                        <ul>
                           <li>Medical data: retained for a minimum of 7 years, or as legally required.</li>
                            <li>Financial data: retained for 5 years for auditing.</li>
                            <li>Inactive accounts: anonymized or deleted after 2 years of inactivity, unless required by law.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="8. Your Rights Under NDPR">
                        <p>You have the right to:</p>
                        <ul>
                           <li>Request access to your personal data</li>
                           <li>Correct inaccuracies in your records</li>
                           <li>Request deletion of your data ("right to be forgotten")</li>
                           <li>Withdraw consent at any time</li>
                           <li>File a complaint with the NITDA or a data protection officer</li>
                        </ul>
                        <p>To exercise any of these rights, please email: dpo@medimate.com</p>
                    </PolicySection>
                    
                    <PolicySection title="9. Children's Privacy">
                       <p>Our services are not intended for children under 18 unless with parental/guardian consent. We do not knowingly collect data from minors without legal consent. See our Parental Consent Policy for more details.</p>
                    </PolicySection>

                     <PolicySection title="10. Changes to This Privacy Policy">
                        <p>We reserve the right to update this Privacy Policy at any time. Significant changes will be communicated via email or in-app notification.</p>
                    </PolicySection>

                     <PolicySection title="11. Contact Information">
                        <p>If you have any questions, data requests, or wish to withdraw your consent, contact:</p>
                        <p>
                            Data Protection Officer (DPO)<br/>
                            MediMate Technologies Ltd.<br/>
                            Email: dpo@medimate.com<br/>
                            Phone: +234-123-456-7890
                        </p>
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
