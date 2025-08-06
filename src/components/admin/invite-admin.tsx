
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/services/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Check } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address for the invitee." }),
});

export default function InviteAdmin() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to invite admins.",
        });
        return;
    }

    setIsLoading(true);
    setInviteLink('');
    setHasCopied(false);

    try {
      const inviteAdmin = httpsCallable(functions, 'inviteAdmin');
      const result: any = await inviteAdmin({ invitedEmail: values.email, invitedBy: user.uid });
      
      if (result.data.success) {
        const token = result.data.token;
        const link = `${window.location.origin}/super-admin-portal/invite-only/${token}/create`;
        setInviteLink(link);
        toast({
          title: "Invite Link Generated",
          description: "Share this link with the new admin. It is valid for 24 hours.",
        });
      } else {
        throw new Error(result.data.error || 'Failed to generate invite link.');
      }

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Invitation Failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>New Admin's Email</FormLabel>
                <FormControl>
                    <Input type="email" placeholder="new.admin@medimate.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 animate-spin" />}
            Generate Invite Link
            </Button>
        </form>
        </Form>
        {inviteLink && (
            <div className="mt-6 p-4 border rounded-md bg-secondary">
                <p className="text-sm font-semibold">One-Time Invite Link:</p>
                <div className="flex items-center gap-2 mt-2">
                    <Input readOnly value={inviteLink} className="bg-background" />
                    <Button variant="outline" size="icon" onClick={copyToClipboard}>
                        {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        )}
    </div>
  );
}
