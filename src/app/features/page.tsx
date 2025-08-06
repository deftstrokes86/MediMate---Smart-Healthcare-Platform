import { Bot, Map, Pill, FlaskConical, Hospital, LayoutDashboard, ShieldCheck, ArrowRight, Video, UserCheck, Truck, Beaker, CheckCircle, EyeOff, Sparkles } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'MediMate Features - Smart, Simple, and Secure Healthcare',
  description: 'Explore the powerful features of MediMate, from our AI-powered symptom checker and doctor matching to seamless prescription management and lab testing. Your healthcare, smarter and simpler.',
};

const FeatureDetailCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-white/20 p-8 shadow-lg backdrop-blur-md transition-all hover:shadow-xl hover:scale-[1.02]">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>
    <div className="relative z-10">
      <div className="flex items-start md:items-center gap-4 mb-4">
        <div className="flex-shrink-0 text-primary">{icon}</div>
        <h3 className="text-3xl font-bold font-headline">{title}</h3>
      </div>
      <div className="text-foreground/80 space-y-3 prose max-w-none prose-p:my-0 prose-ul:list-disc prose-ul:pl-6 prose-li:mb-1">
        {children}
      </div>
    </div>
  </div>
);

export default function FeaturesPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-background to-secondary/50">
      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Header Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
            MediMate Features: Your Healthcare, Smarter and Simpler
          </h1>
          <p className="mx-auto max-w-[800px] text-foreground/80 md:text-xl mt-4">
            [App Name] redefines telemedicine by connecting you with doctors, labs, pharmacies, and hospitals in one intuitive, browser-based platform. Powered by advanced AI and designed for privacy and convenience, our features make managing your health effortless, secure, and personalized. Discover how [App Name] transforms your healthcare experience.
          </p>
        </section>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FeatureDetailCard icon={<Bot className="h-10 w-10" />} title="AI-Powered Symptom Checker">
                <ul>
                    <li><strong>Smart Diagnosis:</strong> Start your journey with our Gemini AI-driven symptom checker, which analyzes your symptoms and provides a list of possible conditions with percentage certainty.</li>
                    <li><strong>Personalized Insights:</strong> Get a clear, actionable starting point for your care, tailored to your unique symptoms.</li>
                </ul>
            </FeatureDetailCard>
             <FeatureDetailCard icon={<Map className="h-10 w-10" />} title="Seamless Doctor Matching">
                <ul>
                    <li><strong>Local Expertise:</strong> Find board-certified doctors within an 8km radius using our interactive map interface, complete with ratings, consultation counts, and specializations.</li>
                    <li><strong>Privacy-First Consultations:</strong> Enjoy video calls with options to blur your face or use a pseudonym for anonymity.</li>
                    <li><strong>Informed Care:</strong> Your symptom checker results are automatically shared with your doctor for a focused, efficient consultation.</li>
                </ul>
            </FeatureDetailCard>
             <FeatureDetailCard icon={<Pill className="h-10 w-10" />} title="Flexible Prescription Management">
                <ul>
                    <li><strong>Nearby Pharmacies:</strong> Select from pharmacies within a 4km radius (expandable if needed) that carry your prescribed medication, with ratings and prescription fill counts displayed.</li>
                    <li><strong>Transparent Pricing:</strong> View medication costs upfront and choose pickup or delivery via ride-share apps or direct pharmacy coordination.</li>
                    <li><strong>Secure Transactions:</strong> Pharmacy locations are revealed only after payment confirmation, ensuring a smooth and private process.</li>
                </ul>
            </FeatureDetailCard>
            <FeatureDetailCard icon={<FlaskConical className="h-10 w-10" />} title="Streamlined Lab Testing">
                <ul>
                    <li><strong>Local Lab Matching:</strong> Choose from medical labs within a 4km radius (expandable) for your doctor-ordered tests, with ratings and test volume shown.</li>
                    <li><strong>Effortless Process:</strong> Labs receive test details instantly, and you get notified of appointment times and costs. Locations are revealed post-payment for security.</li>
                    <li><strong>Integrated Results:</strong> Receive test results directly in the app, with copies shared with your doctor for follow-up care.</li>
                </ul>
            </FeatureDetailCard>
             <FeatureDetailCard icon={<Hospital className="h-10 w-10" />} title="Hospital Coordination">
                <ul>
                    <li><strong>Priority Access:</strong> If your doctor recommends a hospital visit, their affiliated hospital gets first priority unless otherwise specified.</li>
                    <li><strong>Customizable Search:</strong> Select from hospitals within a 4km radius (expandable) based on ratings and patient volume, with names revealed post-payment.</li>
                    <li><strong>Seamless Referrals:</strong> Hospitals accept or decline requests, ensuring you connect with facilities equipped for your needs.</li>
                </ul>
            </FeatureDetailCard>
            <FeatureDetailCard icon={<LayoutDashboard className="h-10 w-10" />} title="Unified Health Dashboard">
                <ul>
                    <li><strong>Track Everything:</strong> Manage appointments, test results, prescriptions, and follow-up schedules in one secure, user-friendly interface.</li>
                    <li><strong>Follow-Up Care:</strong> Doctors can schedule follow-ups, which appear on your dashboard for easy acceptance or declination.</li>
                    <li><strong>Rate Your Experience:</strong> Provide feedback on doctors, pharmacies, and labs to help improve the platform and inform other users.</li>
                </ul>
            </FeatureDetailCard>
            <div className="lg:col-span-2">
                <FeatureDetailCard icon={<ShieldCheck className="h-10 w-10" />} title="Privacy and Security">
                     <ul>
                        <li><strong>Anonymity Options:</strong> Choose to blur your face or use a pseudonym during consultations for added privacy.</li>
                        <li><strong>HIPAA-Compliant:</strong> Your data is protected with industry-leading encryption, ensuring confidentiality at every step.</li>
                        <li><strong>Controlled Information:</strong> Pharmacy, lab, and hospital names are hidden until payment is confirmed, prioritizing your privacy.</li>
                    </ul>
                </FeatureDetailCard>
            </div>
        </div>

        {/* Why Choose Us */}
        <section className="text-center mt-24">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-primary">
              Why Choose MediMate?
            </h2>
            <p className="mx-auto max-w-[800px] text-foreground/80 md:text-xl mt-4">
             With MediMate, healthcare is local, intelligent, and tailored to you. From AI-driven diagnostics to privacy-focused consultations and seamless service coordination, our platform empowers you to take control of your health with confidence. Access it all from any browser, no downloads required.
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
