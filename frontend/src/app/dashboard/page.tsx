
"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Pill, FlaskConical, Bell, CheckCircle, Baby, HeartPulse, Video } from "lucide-react";
import RequestConsultationDialog from "@/components/patient/RequestConsultationDialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function PatientDashboardPage() {
    const { user } = useAuth();
    const router = useRouter();

    const isGuardian = user?.profile?.patientData?.isMinor === true;
    const patientName = isGuardian 
        ? user?.profile?.patientData?.childProfile?.fullName?.split(' ')[0] 
        : user?.displayName?.split(' ')[0];

    const welcomeMessage = isGuardian 
        ? `Hi ${user?.displayName?.split(' ')[0]}, here's what's next for ${patientName}.`
        : `Hi ${patientName || 'User'}, here’s what’s next.`;

    const subMessage = isGuardian 
        ? "Your child's personal health overview."
        : "Your personal health overview.";
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">{welcomeMessage}</h1>
                <p className="text-muted-foreground">{subMessage}</p>
            </div>
            
             <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 w-fit">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold text-sm">Profile Verified</span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 <DashboardCard 
                    icon={isGuardian ? <Baby className="text-primary" /> : <Calendar className="text-primary" />}
                    title="Upcoming Appointment"
                    value="Dr. Adebayo - Tomorrow, 10:00 AM"
                    description="Cardiology Check-up"
                />
                <DashboardCard 
                    icon={<Pill className="text-blue-500" />}
                    title="Recent Prescription"
                    value="Amoxicillin - Ready for Refill"
                    description="Expires in 5 days"
                />
                <DashboardCard 
                    icon={<FlaskConical className="text-purple-500" />}
                    title="New Lab Result"
                    value="Full Blood Count - View Result"
                    description="Uploaded 2 days ago"
                />
            </div>
            
            <Card className="shadow-sm rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="text-amber-500" />
                        Notifications & Alerts
                    </Title>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        <li className="text-sm text-muted-foreground">Your referral to 'General Hospital' has been accepted.</li>
                        <li className="text-sm text-muted-foreground">You have 1 unread message from Dr. Funke.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
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

const DashboardCard = ({ icon, title, value, description }: { icon: React.ReactNode, title: string, value: string, description: string }) => (
    <Card className="shadow-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-lg font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);
