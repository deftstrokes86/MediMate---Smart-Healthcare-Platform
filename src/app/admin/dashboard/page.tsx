
import AdminDashboard from "@/components/admin/admin-dashboard";
import InviteAdmin from "@/components/admin/invite-admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata = {
    title: "Admin Dashboard - MediMate",
    description: "Manage users, verify accounts, and oversee platform operations.",
};

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <AdminDashboard />
            <Card>
                <CardHeader>
                    <CardTitle>Invite New Admin</CardTitle>
                    <CardDescription>Generate a secure, one-time link to invite a new Super Admin.</CardDescription>
                </CardHeader>
                <CardContent>
                    <InviteAdmin />
                </CardContent>
            </Card>
        </div>
    );
}
