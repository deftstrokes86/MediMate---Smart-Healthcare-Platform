
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { ArrowRight, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'MediMate FAQ - Your Questions, Answered',
  description: 'Find answers to common questions about MediMate, Nigeria\'s leading telemedicine platform. Learn about our AI symptom checker, doctor consultations, privacy, and more.',
};

const faqData = [
    {
        question: "1. What is MediMate, and how does it work?",
        answer: "MediMate is an all-in-one telemedicine web app that lets you access healthcare from any browser. Create a profile, use our Gemini AI-powered symptom checker to identify possible conditions, and connect with doctors, labs, pharmacies, or hospitals near you. From virtual consultations to lab tests and prescriptions, everything is managed in a secure, user-friendly dashboard. Learn more at our <a href='/how-it-works' class='text-primary hover:underline'>How It Works</a> page."
    },
    {
        question: "2. How does the symptom checker work?",
        answer: "Our symptom checker, powered by Gemini AI, analyzes the symptoms you input and provides a list of possible conditions with percentage certainty. These results are shared with your chosen doctor during a consultation to guide diagnosis and treatment, ensuring a personalized and efficient care experience."
    },
    {
        question: "3. How do I find and connect with doctors?",
        answer: "After using the symptom checker, you can match with board-certified doctors within an 8km radius of your location via our interactive map. You’ll see each doctor’s ratings, number of consultations, and specialization. Schedule a video call with options to blur your face or use a pseudonym for privacy."
    },
    {
        question: "4. Can I keep my identity private during consultations?",
        answer: "Yes! MediMate prioritizes your privacy. During video consultations, you can choose to blur your face or use a pseudonym, ensuring anonymity while still receiving high-quality care from licensed doctors."
    },
    {
        question: "5. How do I order prescriptions, and what if a pharmacy doesn’t have my medication?",
        answer: "If your doctor prescribes medication, you can select from pharmacies within a 4km radius (expandable) based on ratings and prescription fill counts. Medication costs are shown upfront. If no pharmacy has your prescription, you’ll receive a message indicating no matches. After payment, you can choose pickup or delivery via ride-share apps, with the pharmacy’s location revealed only post-payment."
    },
    {
        question: "6. How do lab tests work on MediMate?",
        answer: "If your doctor orders a test, you can choose from labs within a 4km radius (expandable) based on ratings and test volume. Labs receive test details instantly, and you’ll get notified of appointment times and costs. Pay securely through the app to reveal the lab’s location, complete the test, and receive results in your dashboard, shared with your doctor for follow-up."
    },
    {
        question: "7. What happens if a hospital visit is recommended?",
        answer: "If a hospital visit is needed, your doctor’s affiliated hospital gets priority unless specified otherwise. Alternatively, choose from hospitals within a 4km radius (expandable) based on ratings and patient volume. Pay a connection fee to confirm the match and access the hospital’s location. Hospitals accept or decline requests to ensure they can address your condition."
    },
    {
        question: "8. Is my data secure?",
        answer: "Absolutely. MediMate is HIPAA-compliant, using industry-leading encryption to protect your personal and medical data. Pharmacy, lab, and hospital names are hidden until payment is confirmed, and you can opt for anonymity during consultations with face-blurring or pseudonyms."
    },
     {
        question: "9. What are the costs, and can I use insurance?",
        answer: "Costs vary based on consultations, lab tests, medications, or hospital connections. You’ll see transparent pricing before confirming any service. Insurance integration is available for many services—check with your provider for coverage details."
    },
    {
        question: "10. What if I have technical issues or need support?",
        answer: "Our support team is here to help. Contact us at support@medimate.com, call our support line (Monday–Friday, 9 AM–5 PM WAT), or use our contact form on the <a href='/contact' class='text-primary hover:underline'>Contact Us</a> page. We aim to respond within 24 hours."
    },
    {
        question: "11. Do I need a specific browser to use MediMate?",
        answer: "No! MediMate is accessible on any modern browser (e.g., Chrome, Firefox, Safari) from your desktop, laptop, or mobile device. No downloads are required, and the platform is optimized for accessibility, including screen reader support and multilingual options."
    },
    {
        question: "12. Can I provide feedback on my experience?",
        answer: "Yes! After receiving care, you can rate your doctor, pharmacy, or lab directly in your dashboard. Your feedback helps us improve and informs other users about provider quality."
    }
];

export default function FaqPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-background to-secondary/50">
      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Header Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
            MediMate FAQ: Your Questions, Answered
          </h1>
          <p className="mx-auto max-w-[800px] text-foreground/80 md:text-xl mt-4">
            Have questions about how MediMate connects you with doctors, labs, pharmacies, and hospitals? We’ve got you covered. Below are answers to the most common questions about our browser-based telemedicine platform.
          </p>
        </section>

        {/* FAQ Accordion Section */}
        <section className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-white/20 p-8 shadow-2xl backdrop-blur-md">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>
                <div className="relative z-10">
                    <Accordion type="single" collapsible className="w-full">
                        {faqData.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-b-primary/20">
                                <AccordionTrigger className="text-left font-headline text-lg hover:no-underline">
                                    <span className="flex items-center gap-3">
                                        <HelpCircle className="h-5 w-5 text-primary" /> 
                                        {faq.question}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="pt-2 text-base text-foreground/80 prose" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>


        {/* CTA Section */}
        <section className="text-center mt-24">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-primary">
              Still Have Questions?
            </h2>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl mt-4">
             We’re here to support you every step of the way. Reach out to our team for personalized assistance or explore our platform to see how easy healthcare can be.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                 <Link href="/signup">
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
                <Link href="/contact">
                    <Button size="lg" variant="outline">
                      Contact Us
                    </Button>
                </Link>
            </div>
        </section>
      </main>
    </div>
  );
}
