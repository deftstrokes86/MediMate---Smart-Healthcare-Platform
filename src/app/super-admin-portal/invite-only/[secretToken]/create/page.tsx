
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import SuperAdminSignupForm from '@/components/auth/super-admin-signup-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function SuperAdminCreatePage() {
  const { secretToken } = useParams();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function validateToken() {
      if (!secretToken || typeof secretToken !== 'string') {
        setError("Invalid URL.");
        setIsValidToken(false);
        return;
      }

      try {
        const inviteDocRef = doc(db, 'adminInvites', secretToken);
        const inviteDoc = await getDoc(inviteDocRef);

        if (!inviteDoc.exists()) {
          setError("This invitation link is invalid or does not exist.");
          setIsValidToken(false);
          return;
        }

        const data = inviteDoc.data();
        if (data.status !== 'valid') {
          setError("This invitation link has already been used or expired.");
          setIsValidToken(false);
          return;
        }

        const expiresAt = data.expiresAt.toDate();
        if (expiresAt < new Date()) {
          setError("This invitation link has expired.");
          setIsValidToken(false);
          return;
        }
        
        setIsValidToken(true);

      } catch (e: any) {
        console.error("Token validation error:", e);
        setError("An error occurred while validating the invitation. Please try again later.");
        setIsValidToken(false);
      }
    }

    validateToken();
  }, [secretToken]);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-background to-secondary/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl backdrop-blur-lg border-primary/20 bg-white/20">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Create Super Admin Account</CardTitle>
          <CardDescription>Complete the form to create your administrator account.</CardDescription>
        </CardHeader>
        <CardContent>
          {isValidToken === null && (
            <div className="flex flex-col items-center justify-center gap-4 p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Validating invitation...</p>
            </div>
          )}
          {isValidToken === false && error && (
            <div className="flex flex-col items-center justify-center gap-4 p-8 text-center text-destructive">
                <ShieldAlert className="h-12 w-12" />
                <h3 className="font-bold text-lg">Access Denied</h3>
                <p className="text-sm">{error}</p>
            </div>
          )}
          {isValidToken === true && (
            <SuperAdminSignupForm token={secretToken as string} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
