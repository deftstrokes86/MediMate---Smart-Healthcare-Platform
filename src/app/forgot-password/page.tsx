
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await sendPasswordReset(values.email);
      setIsSubmitted(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-background to-secondary/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl backdrop-blur-lg border-primary/20 bg-white/20">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Forgot Your Password?</CardTitle>
          <CardDescription>
            {isSubmitted 
              ? "Check your inbox for a password reset link." 
              : "No problem. Enter your email and we'll send you a reset link."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                If you don't see the email, please check your spam folder.
              </p>
              <Button asChild>
                <Link href="/login">Back to Login</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 animate-spin" />}
                  Send Reset Link
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
