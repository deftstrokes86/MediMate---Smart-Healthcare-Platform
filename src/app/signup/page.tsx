
import SignupForm from '@/components/auth/signup-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Stethoscope } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Create Your MediMate Account',
    description: 'Sign up for MediMate to begin your personalized healthcare experience.',
};

export default function SignupPage() {
    return (
        <div className="min-h-dvh bg-gradient-to-b from-background to-secondary/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg shadow-2xl backdrop-blur-lg border-primary/20 bg-white/20">
                <CardHeader className="text-center">
                     <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
                        <Stethoscope className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Create Your MediMate Account</CardTitle>
                    <CardDescription>Join us to take control of your health. Choose your role to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SignupForm />
                     <p className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Log in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
