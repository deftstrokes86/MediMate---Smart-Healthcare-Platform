
"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/admin/badges";
import { Loader2, User, Heart, Shield, Phone, Edit } from "lucide-react";

export default function PatientProfilePage() {
    const { user, loading } = useAuth();

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    const profile = user.profile;
    const patientData = profile?.patientData;

    return (
        <div className="space-y-6">
             <Card className="shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-primary/5 p-6 flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                        <AvatarImage src={user.photoURL || undefined} />
                        <AvatarFallback className="text-3xl">
                            {(user.displayName || 'P').charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <CardTitle className="text-3xl font-bold font-headline">{user.displayName}</CardTitle>
                            {user.role && <RoleBadge role={user.role} />}
                        </div>
                        <CardDescription>{user.email}</CardDescription>
                    </div>
                     <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                </CardHeader>
                <CardContent className="p-6 grid md:grid-cols-2 gap-8">
                     <ProfileSection icon={<User className="text-primary"/>} title="Personal Information">
                        <InfoRow label="Full Name" value={patientData?.fullName} />
                        <InfoRow label="Date of Birth" value={patientData?.dob} />
                        <InfoRow label="Gender" value={patientData?.gender} />
                        <InfoRow label="Nationality" value={patientData?.nationality} />
                        <InfoRow label="Address" value={patientData?.address} />
                     </ProfileSection>

                      <ProfileSection icon={<Heart className="text-primary"/>} title="Medical Information">
                        <InfoRow label="Blood Type" value={patientData?.bloodType} />
                        <InfoRow label="Allergies" value={patientData?.allergies || "None specified"} />
                        <InfoRow label="Chronic Conditions" value={patientData?.chronicConditions || "None specified"} />
                     </ProfileSection>

                     <ProfileSection icon={<Phone className="text-primary"/>} title="Contact Details">
                        <InfoRow label="Phone Number" value={patientData?.phone} />
                        <InfoRow label="WhatsApp" value={patientData?.whatsappNumber || "N/A"} />
                     </ProfileSection>

                    <ProfileSection icon={<Shield className="text-primary"/>} title="Emergency Contact">
                        <InfoRow label="Name" value={patientData?.emergencyContact?.name} />
                        <InfoRow label="Phone" value={patientData?.emergencyContact?.phone} />
                        <InfoRow label="Relationship" value={patientData?.emergencyContact?.relationship} />
                    </ProfileSection>
                </CardContent>
             </Card>
        </div>
    );
}

const ProfileSection = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold font-headline flex items-center gap-2 border-b pb-2">
            {icon}
            {title}
        </h3>
        <div className="space-y-2">
            {children}
        </div>
    </div>
);

const InfoRow = ({ label, value }: { label: string, value?: string }) => (
    <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}:</span>
        <span className="font-medium text-right">{value || "Not provided"}</span>
    </div>
);

