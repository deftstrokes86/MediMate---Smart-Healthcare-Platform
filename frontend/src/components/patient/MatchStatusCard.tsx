
"use client";

import { usePatientMatch } from "@/hooks/use-patient-match";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RequestConsultationDialog from "./RequestConsultationDialog";
import { useRouter } from "next/navigation";
import { HeartPulse, Loader2, Video } from "lucide-react";

export default function MatchStatusCard() {
    const { patient, provider, loading } = usePatientMatch();
    const router = useRouter();

    if (loading) {
        return <MatchCardSkeleton />;
    }

    if (!patient || patient.matchStatus === 'completed' || patient.matchStatus === undefined) {
        return (
            <Card className="shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HeartPulse className="text-primary"/>
                        Consult a Doctor
                    </CardTitle>
                    <CardDescription>
                        Need to speak with a doctor? Request a consultation and we'll connect you with an available specialist.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RequestConsultationDialog />
                </CardContent>
            </Card>
        );
    }
    
    if (patient.matchStatus === 'waiting') {
        return (
             <Card className="shadow-lg rounded-2xl bg-amber-50 border border-amber-200">
                <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-amber-700">
                        <Loader2 className="animate-spin" />
                        Searching for a Doctor...
                    </CardTitle>
                    <CardDescription>
                       We're looking for a <span className="font-semibold">{patient.requestedSpecialty?.replace(/_/g, ' ')}</span> specialist for you. Please wait a moment.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">This should only take a few minutes. You will be notified here once a doctor is found.</p>
                </CardContent>
            </Card>
        )
    }

    if (patient.matchStatus === 'matched' && provider) {
         return (
            <Card className="shadow-lg rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/50 animate-in fade-in-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <Video />
                        Doctor Found!
                    </CardTitle>
                    <CardDescription>
                        You've been matched with {provider.displayName}. You can now start the video consultation.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={provider.photoURL} />
                        <AvatarFallback>{provider.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left">
                        <p className="font-bold text-lg">{provider.displayName}</p>
                        <p className="text-muted-foreground capitalize">
                            Specialty: {provider.specialties?.[0].replace(/_/g, ' ') || patient.requestedSpecialty?.replace(/_/g, ' ')}
                        </p>
                    </div>
                    <Button 
                        size="lg" 
                        className="w-full sm:w-auto" 
                        onClick={() => router.push(`/consultation/${patient.uid}`)}
                    >
                        <Video className="mr-2 h-4 w-4" />
                        Start Consultation
                    </Button>
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
            <Skeleton className="h-12 w-full sm:w-36 rounded-md" />
        </CardContent>
    </Card>
)
