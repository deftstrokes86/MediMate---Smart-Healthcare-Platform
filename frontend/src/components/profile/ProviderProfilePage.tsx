
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RoleBadge, VerificationStatusBadge } from "@/components/admin/badges";
import { Loader2, Edit, Save, X, FileBadge2, CheckCircle, Briefcase } from "lucide-react";
import KycUploader from "@/components/kyc/KycUploader";
import AvatarUploader from "@/components/profile/AvatarUploader";

interface ProviderProfilePageProps {
    user: any;
    loading: boolean;
    pageTitle: string;
    profileIcon: React.ReactNode;
    infoRows: (isEditing: boolean) => React.ReactNode;
    servicesContent: (isEditing: boolean) => React.ReactNode;
}

export default function ProviderProfilePage({
    user,
    loading,
    pageTitle,
    profileIcon,
    infoRows,
    servicesContent,
}: ProviderProfilePageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isAvatarUploaderOpen, setIsAvatarUploaderOpen] = useState(false);

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    const verificationStatus = user.profile?.verificationStatus || 'none';

    return (
        <div className="space-y-6">
             <AvatarUploader isOpen={isAvatarUploaderOpen} onOpenChange={setIsAvatarUploaderOpen} />
            <Card className="shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-primary/5 p-4 md:p-6 flex flex-col md:flex-row items-center gap-6">
                     <button onClick={() => setIsAvatarUploaderOpen(true)} className="relative group rounded-full">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                            <AvatarImage src={user.photoURL || undefined} />
                            <AvatarFallback className="text-3xl">
                                {(user.displayName || 'P').charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit className="h-8 w-8 text-white" />
                        </div>
                    </button>
                    <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <CardTitle className="text-xl md:text-3xl font-bold font-headline">{user.displayName}</CardTitle>
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
                <CardContent className="p-4 md:p-6 grid lg:grid-cols-2 gap-8">
                     <ProfileSection icon={profileIcon} title={pageTitle}>
                        {infoRows(isEditing)}
                     </ProfileSection>

                      <ProfileSection icon={<Briefcase className="text-primary"/>} title="Services Offered">
                        {servicesContent(isEditing)}
                     </ProfileSection>
                </CardContent>
            </Card>
             <Card className="shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileBadge2 className="text-primary"/>KYC Documents</CardTitle>
                    <CardDescription>Upload your documents for verification. Your documents are securely stored and only visible to administrators.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    {(verificationStatus === 'pending' || verificationStatus === 'rejected' || verificationStatus === 'none') && (
                        <>
                            <KycUploader docType="Business_Registration_CAC" onUploadSuccess={(data) => console.log(data)} />
                            <KycUploader docType="Professional_License" onUploadSuccess={(data) => console.log(data)} />
                        </>
                    )}
                     {verificationStatus === 'approved' && (
                        <div className="md:col-span-2 flex items-center gap-2 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-semibold text-sm">Your documents have been verified. No further action is needed.</span>
                        </div>
                    )}
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
