
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, FileText, BarChart3, Bell, CheckCircle } from "lucide-react";

export default function DoctorDashboardPage() {

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
