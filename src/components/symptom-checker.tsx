"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { handleSymptomCheck } from "@/app/actions";
import type { Ailment } from "@/lib/types";
import { Loader2, Sparkles, Map } from "lucide-react";

const formSchema = z.object({
  symptoms: z.string().min(10, "Please describe your symptoms in more detail."),
});

export default function SymptomChecker() {
  const [ailments, setAilments] = useState<Ailment[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAilments(null);

    const result = await handleSymptomCheck(values.symptoms);

    setIsLoading(false);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: result.error,
      });
    } else {
      setAilments(result.data || []);
    }
  }

  return (
    <Card className="max-w-3xl mx-auto shadow-lg border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline">
          <Sparkles className="text-primary" />
          Describe Your Symptoms
        </CardTitle>
        <CardDescription>
          Enter a detailed description of what you're feeling. For example:
          "I have a sore throat, a mild fever, and a persistent dry cough for
          the last 3 days."
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Symptoms</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your symptoms here..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Check Symptoms"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <AnimatePresence>
        {ailments && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CardFooter className="flex flex-col items-start gap-4 pt-6">
              <h3 className="text-xl font-bold font-headline text-primary">
                Possible Ailments
              </h3>
              <div className="w-full space-y-4">
                {ailments.length > 0 ? (
                  ailments.map((ailment, index) => (
                    <motion.div
                      key={ailment.ailment}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: index * 0.1 },
                      }}
                    >
                      <AilmentCard ailment={ailment} />
                    </motion.div>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    No specific ailments could be determined. Please consult a
                    doctor.
                  </p>
                )}
              </div>
              {ailments.length > 0 && (
                <Link href="/doctors" className="mt-4 self-center">
                    <Button variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <Map className="mr-2 h-4 w-4" />
                      Find a Doctor Nearby
                    </Button>
                </Link>
              )}
            </CardFooter>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function AilmentCard({ ailment }: { ailment: Ailment }) {
  return (
    <Card className="bg-secondary/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{ailment.ailment}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">Certainty</span>
          <span className="font-bold text-primary">
            {ailment.certainty}%
          </span>
        </div>
        <Progress value={ailment.certainty} className="mt-2 h-2" />
      </CardContent>
    </Card>
  );
}
