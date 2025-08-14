
"use client";

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/services/firebase';
import { doc, setDoc, GeoPoint } from 'firebase/firestore';
import { medicalSpecialties } from '@/lib/specialties';
import { Loader2, MapPin, Search } from 'lucide-react';

const formSchema = z.object({
  specialty: z.string().min(1, 'Please select a specialty.'),
});

export default function RequestConsultationDialog() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      specialty: '',
    },
  });

  const handleRequestConsultation = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'You must be logged in.' });
      return;
    }
    
    setIsSubmitting(true);
    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setIsGettingLocation(false);
        const { latitude, longitude } = position.coords;
        const location = new GeoPoint(latitude, longitude);

        try {
          const patientRef = doc(db, 'patients', user.uid);
          await setDoc(patientRef, {
            uid: user.uid,
            location: location,
            requestedSpecialty: values.specialty,
            matchStatus: 'waiting',
            matchedProviderId: null,
          });

          toast({
            title: 'Request Submitted',
            description: 'We are now searching for a doctor for you.',
          });
          setIsOpen(false);
          form.reset();

        } catch (error: any) {
          console.error('Error submitting consultation request:', error);
          toast({
            variant: 'destructive',
            title: 'Submission Failed',
            description: error.message,
          });
        } finally {
            setIsSubmitting(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        setIsSubmitting(false);
        console.error('Geolocation error:', error);
        toast({
          variant: 'destructive',
          title: 'Location Error',
          description: 'Could not get your location. Please enable location services in your browser.',
        });
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Request Consultation</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request a Consultation</DialogTitle>
          <DialogDescription>
            Select a specialty and we'll find a doctor for you. We need your location to find nearby specialists.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRequestConsultation)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Specialty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a specialty..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {medicalSpecialties.map((s) => (
                        <SelectItem key={s} value={s.toLowerCase().replace(/ /g, '_')}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                {isGettingLocation && <><MapPin className="mr-2 h-4 w-4 animate-pulse" /> Getting Location...</>}
                {isSubmitting && !isGettingLocation && <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>}
                {!isSubmitting && <><Search className="mr-2 h-4 w-4" />Find Doctor</>}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
