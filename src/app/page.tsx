import { ArrowRight, Stethoscope, Bot, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-primary/20 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                    Your Personal Health Companion, Powered by AI
                  </h1>
                  <p className="max-w-[600px] text-foreground/80 md:text-xl">
                    MediMate provides instant symptom analysis, connects you with trusted doctors, and helps you understand your health better. All in one secure platform.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/symptom-checker">
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Check Your Symptoms
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </div>
              </div>
              <img
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="doctor smiling"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                  Key Features
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
                icon={<Bot className="h-8 w-8 text-primary" />}
                title="AI Symptom Checker"
                description="Our cutting-edge AI analyzes your symptoms to provide a list of potential conditions, helping you have a more informed conversation with your doctor."
              />
              <FeatureCard
                icon={<MapPin className="h-8 w-8 text-primary" />}
                title="Find a Doctor"
                description="Easily locate and connect with top-rated doctors and specialists near you. Filter by specialty, rating, and more."
              />
              <FeatureCard
                icon={<Stethoscope className="h-8 w-8 text-primary" />}
                title="Personalized Care"
                description="Create your patient profile for a personalized experience and keep your medical information securely in one place."
              />
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
       <div className="relative z-10 flex flex-col gap-4">
        {icon}
        <h3 className="text-xl font-bold font-headline">{title}</h3>
        <p className="text-foreground/80">{description}</p>
      </div>
    </div>
  );
}
