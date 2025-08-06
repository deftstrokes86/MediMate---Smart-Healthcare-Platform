
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

const roles = [
  { id: 'patient', label: 'Patient' },
  { id: 'doctor', label: 'Doctor' },
  { id: 'pharmacist', label: 'Pharmacist' },
  { id: 'medical_lab', label: 'Medical Lab' },
  { id: 'hospital', label: 'Hospital' },
];

const passwordSchema = z.string().min(8, "Password must be at least 8 characters long.");

const formSchema = z.object({
  role: z.enum(['patient', 'doctor', 'pharmacist', 'medical_lab', 'hospital']),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: passwordSchema,
  confirmPassword: passwordSchema,
  
  // Universal
  displayName: z.string().min(2, "Please enter your full name or facility name.").optional(),
  
  // Patient
  dob: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  
  // Doctor
  medicalLicenseNumber: z.string().optional(),
  specialization: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  
  // Pharmacist
  pharmacyName: z.string().optional(),
  pharmacyAddress: z.string().optional(),
  pcnLicense: z.string().optional(), // Pharmacists Council of Nigeria
  pharmacistInCharge: z.string().optional(),

  // Medical Lab
  labName: z.string().optional(),
  labAddress: z.string().optional(),
  cacCertificate: z.string().optional(), // Corporate Affairs Commission
  mlscnLicense: z.string().optional(), // Medical Laboratory Science Council of Nigeria

  // Hospital
  hospitalName: z.string().optional(),
  hospitalAddress: z.string().optional(),
  hospitalRegistrationNumber: z.string().optional(),
  medicalDirector: z.string().optional(),

  // Consent
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the privacy policy to continue."
  }),

}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
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
      acceptTerms: false,
      dob: '',
      gender: '',
      nationality: '',
      address: '',
      phone: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      medicalLicenseNumber: '',
      specialization: '',
      yearsOfExperience: '',
      pharmacyName: '',
      pharmacyAddress: '',
      pcnLicense: '',
      pharmacistInCharge: '',
      labName: '',
      labAddress: '',
      cacCertificate: '',
      mlscnLicense: '',
      hospitalName: '',
      hospitalAddress: '',
      hospitalRegistrationNumber: '',
      medicalDirector: '',
    },
  });
  
  const currentRole = form.watch('role');

  async function onSubmit(values: SignupFormValues) {
    setIsLoading(true);
    try {
      await signupWithEmail(values.email, values.password, values.displayName || '', values.role, values);
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
    let fieldsToValidate: (keyof SignupFormValues)[] = [];
    if (step === 1) {
        fieldsToValidate = ['role'];
    } else if (step === 2) {
        fieldsToValidate = ['displayName', 'email'];
        if (currentRole === 'patient') {
            fieldsToValidate.push('dob', 'gender');
        }
    } else if (step === 3) {
        fieldsToValidate = ['password', 'confirmPassword', 'acceptTerms'];
    }


    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(prev => prev + 1);
    }
  };
  
  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const getStepTwoFields = () => {
      switch(currentRole) {
          case 'doctor':
              return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="displayName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Dr. Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>Gender</FormLabel><FormControl><Input placeholder="Female" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="dob" render={({ field }) => (<FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="nationality" render={({ field }) => (<FormItem><FormLabel>Nationality</FormLabel><FormControl><Input placeholder="Nigerian" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="medicalLicenseNumber" render={({ field }) => (<FormItem><FormLabel>Medical License (MDCN)</FormLabel><FormControl><Input placeholder="MDCN/12345/2024" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="specialization" render={({ field }) => (<FormItem><FormLabel>Specialization</FormLabel><FormControl><Input placeholder="Cardiology" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="yearsOfExperience" render={({ field }) => (<FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" placeholder="5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
              )
          case 'pharmacist':
               return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="pharmacyName" render={({ field }) => (<FormItem><FormLabel>Pharmacy Name</FormLabel><FormControl><Input placeholder="MediPlus Pharmacy" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Business Email</FormLabel><FormControl><Input type="email" placeholder="contact@mediplus.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="pharmacyAddress" render={({ field }) => (<FormItem><FormLabel>Pharmacy Address</FormLabel><FormControl><Input placeholder="123 Health Way, Lagos" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="pcnLicense" render={({ field }) => (<FormItem><FormLabel>PCN License Number</FormLabel><FormControl><Input placeholder="PCN/REG/12345" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="pharmacistInCharge" render={({ field }) => (<FormItem><FormLabel>Pharmacist in Charge</FormLabel><FormControl><Input placeholder="John Oke" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
              )
          case 'medical_lab':
               return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="labName" render={({ field }) => (<FormItem><FormLabel>Medical Lab Name</FormLabel><FormControl><Input placeholder="Wellness Diagnostics" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Business Email</FormLabel><FormControl><Input type="email" placeholder="info@wellnessdx.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="labAddress" render={({ field }) => (<FormItem><FormLabel>Lab Address</FormLabel><FormControl><Input placeholder="456 Test Avenue, Abuja" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="cacCertificate" render={({ field }) => (<FormItem><FormLabel>CAC Registration Number</FormLabel><FormControl><Input placeholder="RC 1234567" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="mlscnLicense" render={({ field }) => (<FormItem><FormLabel>MLSCN License Number</FormLabel><FormControl><Input placeholder="MLSCN/LAB/2024/001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
              )
          case 'hospital':
              return (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="hospitalName" render={({ field }) => (<FormItem><FormLabel>Hospital Name</FormLabel><FormControl><Input placeholder="St. Nicholas Hospital" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Hospital Email</FormLabel><FormControl><Input type="email" placeholder="admin@stnicholas.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="hospitalAddress" render={({ field }) => (<FormItem><FormLabel>Hospital Address</FormLabel><FormControl><Input placeholder="789 Care Crescent, Port Harcourt" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="hospitalRegistrationNumber" render={({ field }) => (<FormItem><FormLabel>Operating License Number</FormLabel><FormControl><Input placeholder="FMoH/2024/123" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="medicalDirector" render={({ field }) => (<FormItem><FormLabel>Medical Director Name</FormLabel><FormControl><Input placeholder="Dr. Fatima Bello" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
              )
          default: // Patient
              return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="displayName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="08012345678" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="dob" render={({ field }) => (<FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>Gender</FormLabel><FormControl><Input placeholder="Female" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="nationality" render={({ field }) => (<FormItem><FormLabel>Nationality</FormLabel><FormControl><Input placeholder="Nigerian" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="123 Main St, Lagos" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="emergencyContactName" render={({ field }) => (<FormItem><FormLabel>Emergency Contact Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="emergencyContactPhone" render={({ field }) => (<FormItem><FormLabel>Emergency Contact Phone</FormLabel><FormControl><Input placeholder="08012345678" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
              )
      }
  }

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
                          className="grid grid-cols-2 lg:grid-cols-3 gap-4"
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
                    <h3 className="text-lg font-semibold font-headline">
                        Step 2: Provide Your Details
                    </h3>
                    {getStepTwoFields()}
                </div>
            )}
             {step === 3 && (
                <div className="space-y-4">
                     <h3 className="text-lg font-semibold font-headline">
                        Step 3: Secure Your Account
                    </h3>
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
                    <FormField
                        control={form.control}
                        name="acceptTerms"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                            <FormControl>
                                <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                Accept terms and conditions
                                </FormLabel>
                                <FormDescription>
                                By signing up, you agree to our{' '}
                                <Link href="/privacy-policy" className="text-primary hover:underline" target="_blank">
                                    Privacy Policy
                                </Link>
                                .
                                </FormDescription>
                                <FormMessage />
                            </div>
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

    