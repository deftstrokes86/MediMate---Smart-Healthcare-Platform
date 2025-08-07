
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, HandHeart, CalendarCheck, Star, Bell, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HospitalDashboardPage() {

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Hospital Dashboard</h1>
                    <p className="text-muted-foreground">Welcome, [Hospital Name]. Here's your overview.</p>
                </div>
                 <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold text-sm">Verified</span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Referrals This Week" value={14} icon={<HandHeart className="text-primary" />} />
                <StatCard title="Appointments Today" value={6} icon={<CalendarCheck className="text-blue-500" />} />
                <StatCard title="Average Patient Rating" value={"4.8"} icon={<Star className="text-amber-500" />} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                 <Card className="shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> System Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-muted-foreground">Platform-wide alerts or messages from MediMate admins will appear here.</p>
                       {/* Placeholder for notifications */}
                    </CardContent>
                </Card>
                <Card className="shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" /> Pending Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <ActionItem label="New Referrals to Review" count={4} />
                            <ActionItem label="Incomplete Profile Sections" count={1} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


const StatCard = ({ title, value, icon }: { title: string, value: number | string, icon: React.ReactNode }) => (
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

const ActionItem = ({ label, count }: { label: string, count: number }) => (
    <div className="flex justify-between items-center p-3 rounded-md bg-secondary/30">
        <p className="text-sm font-medium">{label}</p>
        <Badge variant="destructive">{count}</Badge>
    </div>
);
