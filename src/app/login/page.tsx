
import LoginForm from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Stethoscope } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Login to MediMate',
    description: 'Access your MediMate account to manage your healthcare journey.',
};

export default function LoginPage() {
    return (
        <div className="min-h-dvh bg-gradient-to-b from-background to-secondary/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl backdrop-blur-lg border-primary/20 bg-white/20">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
                        <Stethoscope className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Welcome Back to MediMate</CardTitle>
                    <CardDescription>Sign in to continue your healthcare journey.</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link href="/signup" className="font-semibold text-primary hover:underline">
                            Sign up here
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
