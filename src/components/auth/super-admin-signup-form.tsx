
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(10, "A valid phone number is required for MFA."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

type SuperAdminSignupFormValues = z.infer<typeof formSchema>;

interface SuperAdminSignupFormProps {
    token: string;
}

export default function SuperAdminSignupForm({ token }: SuperAdminSignupFormProps) {
  const { signupWithEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SuperAdminSignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: '', email: '', phone: '', password: '' },
  });

  async function onSubmit(values: SuperAdminSignupFormValues) {
    setIsLoading(true);
    try {
      const userCredential = await signupWithEmail(values.email, values.password, values.fullName, 'super_admin', { token, phone: values.phone });
      
      // Mark the token as used
      const inviteDocRef = doc(db, 'adminInvites', token);
      await updateDoc(inviteDocRef, {
        status: 'used',
        usedAt: new Date(),
        usedBy: userCredential.user.uid,
      });

      toast({
        title: "Super Admin Account Created",
        description: "You have been successfully registered.",
      });

      // Redirect to admin dashboard
      router.push('/admin/dashboard');

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+2348012345678" {...field} />
              </FormControl>
               <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                 <div className="relative">
                    <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...field} />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                 </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 animate-spin" />}
          Create Super Admin
        </Button>
      </form>
    </Form>
  );
}
