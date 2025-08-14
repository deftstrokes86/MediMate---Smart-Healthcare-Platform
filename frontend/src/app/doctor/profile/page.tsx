
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RoleBadge, VerificationStatusBadge } from "@/components/admin/badges";
import { Loader2, User, Briefcase, FileBadge2, Edit, Save, X } from "lucide-react";
import KycUploader from "@/components/kyc/KycUploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DoctorProfilePage() {
    const { user, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    // @ts-ignore - doctorData is not yet formally in the type
    const doctorData = user.profile?.doctorData;
    const verificationStatus = user.profile?.verificationStatus || 'none';


    return (
        <div className="space-y-6">
             <Card className="shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-primary/5 p-6 flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                        <AvatarImage src={user.photoURL || undefined} />
                        <AvatarFallback className="text-3xl">
                            {(user.displayName || 'D').charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <CardTitle className="text-3xl font-bold font-headline">{user.displayName}</CardTitle>
                            {user.role && <RoleBadge role={user.role} />}
                        </div>
                        <CardDescription className="flex items-center justify-center md:justify-start gap-2 mt-1">
                           {user.email} <VerificationStatusBadge status={verificationStatus} />
                        </CardDescription>
                    </div>
                     {isEditing ? (
                        <div className="flex gap-2">
                             <Button onClick={() => setIsEditing(false)} variant="outline">
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                            <Button onClick={() => setIsEditing(false)}>
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </Button>
                        </div>
                    ) : (
                         <Button onClick={() => setIsEditing(true)} variant="outline">
                            <Edit className="mr-2 h-4 w-4" /> Edit Profile
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="p-6 grid md:grid-cols-2 gap-8">
                     <ProfileSection icon={<User className="text-primary"/>} title="Personal Information">
                        <InfoRow label="Full Name" value={doctorData?.fullName} isEditing={isEditing} />
                        <InfoRow label="Gender" value={doctorData?.gender} isEditing={isEditing} />
                        <InfoRow label="Date of Birth" value={doctorData?.dob} isEditing={isEditing} type="date" />
                        <InfoRow label="Nationality" value={doctorData?.nationality} isEditing={isEditing} />
                     </ProfileSection>

                      <ProfileSection icon={<Briefcase className="text-primary"/>} title="Professional Details">
                        <InfoRow label="Specialization" value={doctorData?.specialization} isEditing={isEditing} />
                        <InfoRow label="Years of Experience" value={doctorData?.yearsOfExperience} isEditing={isEditing} type="number" />
                        <InfoRow label="MDCN License" value={doctorData?.medicalLicenseNumber} isEditing={isEditing} />
                        <InfoRow label="Contact Address" value={doctorData?.address} isEditing={isEditing} />
                     </ProfileSection>
                </CardContent>
             </Card>
             <Card className="shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileBadge2 className="text-primary"/>KYC Documents</CardTitle>
                    <CardDescription>Upload your documents for verification. Your documents are securely stored and only visible to administrators.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <KycUploader docType="Medical_License_MDCN" onUploadSuccess={(data) => console.log(data)} />
                    <KycUploader docType="Government_ID" onUploadSuccess={(data) => console.log(data)} />
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

const InfoRow = ({ label, value, isEditing, type = 'text' }: { label: string, value?: string, isEditing: boolean, type?: string }) => (
    <div className="flex justify-between items-center text-sm">
        <Label className="text-muted-foreground w-1/3">{label}:</Label>
        {isEditing ? (
            <Input type={type} defaultValue={value || ""} className="w-2/3" />
        ) : (
             <span className="font-medium text-right w-2/3">{value || "Not provided"}</span>
        )}
    </div>
);
