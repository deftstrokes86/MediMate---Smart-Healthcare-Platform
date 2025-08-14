
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Users, FileText, BarChart3, Bell, CheckCircle, Video } from "lucide-react";
import { useProviderMatch } from "@/hooks/use-provider-match";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function DoctorDashboardPage() {
    const { matchedPatient, loading } = useProviderMatch();
    const router = useRouter();

    const handleStartConsultation = () => {
        if (matchedPatient) {
            router.push(`/consultation/${matchedPatient.uid}`);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Doctor's Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, Dr. [Name]. Here's your daily overview.</p>
                </div>
                 <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold text-sm">Verified</span>
                </div>
            </div>
            
            {loading && <MatchCardSkeleton />}

            {matchedPatient && (
                 <Card className="shadow-lg rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/50 animate-in fade-in-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Video />
                            New Consultation Request!
                        </CardTitle>
                        <CardDescription>
                            You have been matched with a patient. Please start the consultation.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={matchedPatient.photoURL} />
                            <AvatarFallback>{matchedPatient.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center sm:text-left">
                            <p className="font-bold text-lg">{matchedPatient.displayName}</p>
                            <p className="text-muted-foreground">Wants to consult about: <span className="font-semibold text-primary">{matchedPatient.requestedSpecialty}</span></p>
                        </div>
                        <Button size="lg" className="w-full sm:w-auto" onClick={handleStartConsultation}>
                            Start Consultation
                        </Button>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Today's Appointments" value={5} icon={<Clock className="text-primary" />} />
                <StatCard title="Patients Awaiting Feedback" value={3} icon={<Bell className="text-amber-500" />} />
                <StatCard title="Total Patients" value={82} icon={<Users className="text-emerald-500" />} />
                <StatCard title="Reports Uploaded (Week)" value={12} icon={<FileText className="text-blue-500" />} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle>Daily Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Your upcoming appointments for today will be listed here.</p>
                        {/* Placeholder for schedule component */}
                    </CardContent>
                </Card>
                 <Card className="shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-muted-foreground">Recent patient interactions and uploads will appear here.</p>
                       {/* Placeholder for activity feed */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


const StatCard = ({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) => (
    <Card className="shadow-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

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
