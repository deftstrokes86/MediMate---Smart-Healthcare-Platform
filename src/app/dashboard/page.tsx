
"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Pill, FlaskConical, Bell, CheckCircle } from "lucide-react";

export default function PatientDashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Hi {user?.displayName?.split(' ')[0] || 'User'}, here’s what’s next.</h1>
                <p className="text-muted-foreground">Your personal health overview.</p>
            </div>
            
             <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 w-fit">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold text-sm">Profile Verified</span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <DashboardCard 
                    icon={<Calendar className="text-primary" />}
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
                    </CardTitle>
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
