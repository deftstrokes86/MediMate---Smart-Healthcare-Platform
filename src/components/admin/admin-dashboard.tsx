
"use client";

import React from "react";
import { useAdmin } from "@/hooks/use-admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Clock } from "lucide-react";
import { RoleBadge, VerificationStatusBadge } from "./badges";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"


export default function AdminDashboard() {
  const { users, loading, error, verifyUser } = useAdmin();

  const handleVerify = async (uid: string) => {
    await verifyUser(uid);
  };
  
  const verifiedCount = users.filter(u => u.profile?.isVerified).length;
  const pendingCount = users.length - verifiedCount;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{users.length}</div>
                    <p className="text-xs text-muted-foreground">All registered users</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{verifiedCount}</div>
                    <p className="text-xs text-muted-foreground">Active and verified accounts</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
                    <Clock className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingCount}</div>
                    <p className="text-xs text-muted-foreground">Accounts awaiting approval</p>
                </CardContent>
            </Card>
        </div>


        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View, manage, and verify user accounts.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">All Users</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="verified">Verified</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                        <UserTable users={users} onVerify={handleVerify} />
                    </TabsContent>
                     <TabsContent value="pending">
                        <UserTable users={users.filter(u => !u.profile?.isVerified)} onVerify={handleVerify} />
                    </TabsContent>
                    <TabsContent value="verified">
                        <UserTable users={users.filter(u => u.profile?.isVerified)} onVerify={handleVerify} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}

const UserTable = ({ users, onVerify }: { users: any[], onVerify: (uid: string) => void }) => {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {users.map((user) => (
                    <TableRow key={user.uid}>
                    <TableCell>{user.displayName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <RoleBadge role={user.role} />
                    </TableCell>
                    <TableCell>
                        <VerificationStatusBadge
                        isVerified={user.profile?.isVerified}
                        />
                    </TableCell>
                    <TableCell>
                        {!user.profile?.isVerified && user.role !== 'admin' && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onVerify(user.uid)}
                            disabled={user.isVerifying}
                        >
                             {user.isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                            Verify
                        </Button>
                        )}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>
    )
}
