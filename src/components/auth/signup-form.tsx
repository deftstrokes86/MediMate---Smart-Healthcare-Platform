
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const roles = [
  { id: 'patient', label: 'Patient' },
  { id: 'doctor', label: 'Doctor' },
  { id: 'pharmacist', label: 'Pharmacist' },
  { id: 'lab_technician', label: 'Lab Technician' },
];

const passwordSchema = z.string().min(8, "Password must be at least 8 characters long.");

const formSchema = z.object({
  role: z.enum(['patient', 'doctor', 'pharmacist', 'lab_technician']),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: passwordSchema,
  confirmPassword: passwordSchema,
  displayName: z.string().min(2, "Please enter your full name."),
  // Role-specific fields
  licenseNumber: z.string().optional(),
  specialization: z.string().optional(),
  pharmacyRegistration: z.string().optional(),
  labAffiliation: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
}).refine(data => data.role !== 'doctor' || (data.licenseNumber && data.specialization), {
    message: "License number and specialization are required for doctors.",
    path: ["licenseNumber"],
}).refine(data => data.role !== 'pharmacist' || data.pharmacyRegistration, {
    message: "Pharmacy registration is required for pharmacists.",
    path: ["pharmacyRegistration"],
}).refine(data => data.role !== 'lab_technician' || data.labAffiliation, {
    message: "Lab affiliation is required for lab technicians.",
    path: ["labAffiliation"],
});

type SignupFormValues = z.infer<typeof formSchema>;

export default function SignupForm() {
  const { signupWithEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'patient',
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
    },
  });
  
  const currentRole = form.watch('role');

  async function onSubmit(values: SignupFormValues) {
    setIsLoading(true);
    try {
      await signupWithEmail(values.email, values.password, values.displayName, values.role, {
          licenseNumber: values.licenseNumber,
          specialization: values.specialization,
          pharmacyRegistration: values.pharmacyRegistration,
          labAffiliation: values.labAffiliation,
      });
      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      });
      // Redirect will be handled by AuthContext
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

  const handleNextStep = async () => {
    const fieldsToValidate: (keyof SignupFormValues)[] = step === 1 
      ? ['role'] 
      : ['displayName', 'email', 'password', 'confirmPassword'];
      
    if (currentRole === 'doctor' && step === 2) {
        fieldsToValidate.push('licenseNumber', 'specialization');
    }
    if (currentRole === 'pharmacist' && step === 2) {
        fieldsToValidate.push('pharmacyRegistration');
    }
    if (currentRole === 'lab_technician' && step === 2) {
        fieldsToValidate.push('labAffiliation');
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(prev => prev + 1);
    }
  };
  
  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
             {step === 1 && (
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Select Your Role</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          {roles.map(role => (
                            <FormItem key={role.id} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <div className="relative flex-grow">
                                  <RadioGroupItem value={role.id} id={role.id} className="sr-only peer" />
                                  <Label
                                    htmlFor={role.id}
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer w-full"
                                  >
                                    {role.label}
                                  </Label>
                                </div>
                              </FormControl>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             )}
            {step === 2 && (
                <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl><Input placeholder="Jane Doe" {...field} /></FormControl>
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
                          <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {currentRole === 'doctor' && (
                        <>
                            <FormField
                                control={form.control}
                                name="licenseNumber"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Medical License Number</FormLabel>
                                    <FormControl><Input placeholder="ABC12345" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="specialization"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Specialization</FormLabel>
                                    <FormControl><Input placeholder="Cardiology" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    {currentRole === 'pharmacist' && (
                        <FormField
                            control={form.control}
                            name="pharmacyRegistration"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Pharmacy Registration Details</FormLabel>
                                <FormControl><Input placeholder="Reg #XYZ" {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                    {currentRole === 'lab_technician' && (
                         <FormField
                            control={form.control}
                            name="labAffiliation"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Laboratory Affiliation</FormLabel>
                                <FormControl><Input placeholder="General Hospital Labs" {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>
            )}
             {step === 3 && (
                <div className="space-y-4">
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
                    <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
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
                </div>
             )}
            </motion.div>
        </AnimatePresence>

        <div className="flex gap-4 pt-4">
            {step > 1 && <Button type="button" variant="outline" onClick={handlePrevStep} className="w-full">Back</Button>}
            {step < 3 && <Button type="button" onClick={handleNextStep} className="w-full">Next</Button>}
            {step === 3 && (
                 <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 animate-spin" />}
                    Create Account
                </Button>
            )}
        </div>
      </form>
    </Form>
  );
}
