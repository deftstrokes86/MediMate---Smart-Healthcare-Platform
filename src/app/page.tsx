import SymptomChecker from "@/components/symptom-checker";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl font-headline">
          AI Symptom Checker
        </h1>
        <p className="mt-4 text-lg text-foreground/80 md:text-xl">
          Feeling unwell? Describe your symptoms below and our advanced AI will
          provide a list of possible conditions to discuss with a doctor.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          This tool does not provide medical advice. It is intended for
          informational purposes only.
        </p>
      </div>

      <div className="mt-12">
        <SymptomChecker />
      </div>
    </div>
  );
}
