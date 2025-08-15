
"use client";

import { usePatientMatch } from "@/hooks/use-patient-match";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, UserCheck, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function MatchStatusCard() {
    const { patient, provider, loading } = usePatientMatch();
    const router = useRouter();

    if (loading) {
        return <MatchCardSkeleton />;
    }

    if (!patient || patient.matchStatus === 'completed' || patient.matchStatus === 'in_consult') {
        return null;
    }
    
    if (patient.matchStatus === 'matched' && provider) {
         return (
             <Card className="shadow-lg rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/50 animate-in fade-in-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <UserCheck />
                        We've found a doctor for you!
                    </CardTitle>
                    <CardDescription>
                        You have been matched with Dr. {provider.displayName}. Please start the consultation.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={provider.photoURL} />
                        <AvatarFallback>{provider.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left">
                        <p className="font-bold text-lg">Dr. {provider.displayName}</p>
                        <p className="text-muted-foreground">Specialty: <span className="font-semibold text-primary">{provider.specialties?.[0] || 'General Practice'}</span></p>
                    </div>
                    <Button size="lg" className="w-full sm:w-auto" onClick={() => router.push(`/consultation/${patient.uid}`)}>
                        <Video className="mr-2 h-4 w-4"/>
                        Start Consultation
                    </Button>
                </CardContent>
            </Card>
        )
    }

    if (patient.matchStatus === 'waiting') {
         return (
            <Card className="shadow-md rounded-2xl bg-blue-50 border border-blue-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                         <Loader2 className="animate-spin" />
                        Searching for a Doctor
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground">
                        We are currently searching for an available doctor specializing in <span className="font-semibold text-blue-700">{patient.requestedSpecialty?.replace(/_/g, ' ')}</span>. Please wait, this may take a few moments.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return null;
}

const MatchCardSkeleton = () => (
    <Card className="shadow-lg rounded-2xl">
        <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-12 w-full sm:w-40 rounded-md" />
        </CardContent>
    </Card>
)
