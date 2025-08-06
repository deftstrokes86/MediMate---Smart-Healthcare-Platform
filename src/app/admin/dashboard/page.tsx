
"use client";

import { useAdmin } from "@/hooks/use-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Clock, BarChart3, List, Activity } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleBadge } from "@/components/admin/badges";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
    const { users, loading, error } = useAdmin();

    const verifiedCount = users.filter(u => u.profile?.isVerified).length;
    const pendingCount = users.length - verifiedCount;
    const recentUsers = users.slice(0, 5);

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Users" value={users.length} icon={<Users className="text-primary" />} />
                <StatCard title="Pending Verifications" value={pendingCount} icon={<Clock className="text-amber-500" />} />
                <StatCard title="Verified Users" value={verifiedCount} icon={<UserCheck className="text-emerald-500" />} />
                <StatCard title="Suspended Users" value={0} icon={<UserX className="text-red-500" />} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle>Recent Registrations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                             <TableBody>
                                {recentUsers.map(user => (
                                    <TableRow key={user.uid}>
                                        <TableCell>
                                            <div className="font-medium">{user.displayName}</div>
                                            <div className="text-xs text-muted-foreground">{user.email}</div>
                                        </TableCell>
                                        <TableCell><RoleBadge role={user.role} /></TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm">View</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                             </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                 <Card className="shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle>Recent System Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <SystemEvent user="Admin" action="Verified" target="Dr. John Doe" />
                             <SystemEvent user="System" action="Flagged" target="New Lab Inc." reason="Duplicate ID" />
                             <SystemEvent user="Admin" action="Suspended" target="Patient XYZ" />
                        </div>
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

const SystemEvent = ({ user, action, target, reason }: { user: string, action: string, target: string, reason?: string}) => (
    <div className="flex items-center gap-4">
        <div className="bg-gray-100 p-2 rounded-full">
            <Activity className="h-5 w-5 text-gray-500" />
        </div>
        <div className="flex-1">
            <p className="text-sm">
                <span className="font-semibold">{user}</span> {action.toLowerCase()} <span className="font-semibold text-primary">{target}</span>.
            </p>
            {reason && <p className="text-xs text-muted-foreground">{reason}</p>}
        </div>
        <span className="text-xs text-muted-foreground">2 min ago</span>
    </div>
)
