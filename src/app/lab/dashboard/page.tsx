
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, FileText, FlaskConical, Users } from "lucide-react";

export default function MedicalLabDashboardPage() {

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Medical Lab Dashboard</h1>
                    <p className="text-muted-foreground">Welcome, [Lab Name]. Here's your overview.</p>
                </div>
                 <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold text-sm">Verified</span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Pending Tests" value={12} icon={<Clock className="text-amber-500" />} />
                <StatCard title="Results Submitted (Today)" value={8} icon={<FileText className="text-primary" />} />
                <StatCard title="Total Patients Served" value={150} icon={<Users className="text-emerald-500" />} />
                <StatCard title="Monthly Performance" value={"98%"} icon={<FlaskConical className="text-blue-500" />} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle>Pending Test Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">New test requests from doctors will appear here.</p>
                        {/* Placeholder for pending tests list */}
                    </CardContent>
                </Card>
                 <Card className="shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle>Recent Submissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-muted-foreground">A list of recently uploaded test results.</p>
                       {/* Placeholder for recent submissions feed */}
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
