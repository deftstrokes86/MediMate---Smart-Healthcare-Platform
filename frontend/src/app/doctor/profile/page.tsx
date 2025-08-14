
"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RoleBadge, VerificationStatusBadge } from "@/components/admin/badges";
import { Loader2, User, Award, Briefcase, FileBadge2, Edit } from "lucide-react";
import KycUploader from "@/components/kyc/KycUploader";

export default function DoctorProfilePage() {
    const { user, loading } = useAuth();

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
                     <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                </CardHeader>
                <CardContent className="p-6 grid md:grid-cols-2 gap-8">
                     <ProfileSection icon={<User className="text-primary"/>} title="Personal Information">
                        <InfoRow label="Full Name" value={doctorData?.fullName} />
                        <InfoRow label="Gender" value={doctorData?.gender} />
                        <InfoRow label="Date of Birth" value={doctorData?.dob} />
                        <InfoRow label="Nationality" value={doctorData?.nationality} />
                     </ProfileSection>

                      <ProfileSection icon={<Briefcase className="text-primary"/>} title="Professional Details">
                        <InfoRow label="Specialization" value={doctorData?.specialization} />
                        <InfoRow label="Years of Experience" value={doctorData?.yearsOfExperience} />
                        <InfoRow label="MDCN License" value={doctorData?.medicalLicenseNumber} />
                        <InfoRow label="Contact Address" value={doctorData?.address} />
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

const InfoRow = ({ label, value }: { label: string, value?: string }) => (
    <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}:</span>
        <span className="font-medium text-right">{value || "Not provided"}</span>
    </div>
);

