
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/admin/badges";
import { Loader2, User, Heart, Shield, Phone, Edit, Eye, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function PatientProfilePage() {
    const { user, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

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
                        <InfoRow label="Full Name" value={patientData?.fullName} isEditing={isEditing} />
                        <InfoRow label="Date of Birth" value={patientData?.dob} isEditing={isEditing} type="date"/>
                        <InfoRow label="Gender" value={patientData?.gender} isEditing={isEditing} />
                        <InfoRow label="Nationality" value={patientData?.nationality} isEditing={isEditing} />
                        <InfoRow label="Address" value={patientData?.address} isEditing={isEditing} />
                     </ProfileSection>

                      <ProfileSection icon={<Heart className="text-primary"/>} title="Medical Information">
                        <InfoRow label="Blood Type" value={patientData?.bloodType} isEditing={isEditing} />
                        <InfoRow label="Allergies" value={patientData?.allergies || "None specified"} isEditing={isEditing} />
                        <InfoRow label="Chronic Conditions" value={patientData?.chronicConditions || "None specified"} isEditing={isEditing} />
                     </ProfileSection>

                     <ProfileSection icon={<Phone className="text-primary"/>} title="Contact Details">
                        <InfoRow label="Phone Number" value={patientData?.phone} isEditing={isEditing} />
                        <InfoRow label="WhatsApp" value={patientData?.whatsappNumber || "N/A"} isEditing={isEditing} />
                     </ProfileSection>

                    <ProfileSection icon={<Shield className="text-primary"/>} title="Emergency Contact">
                        <InfoRow label="Name" value={patientData?.emergencyContact?.name} isEditing={isEditing} />
                        <InfoRow label="Phone" value={patientData?.emergencyContact?.phone} isEditing={isEditing} />
                        <InfoRow label="Relationship" value={patientData?.emergencyContact?.relationship} isEditing={isEditing} />
                    </ProfileSection>
                     <div className="md:col-span-2">
                        <ProfileSection icon={<Eye className="text-primary"/>} title="Privacy Settings">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="pseudonym">Pseudonym</Label>
                                    <Input id="pseudonym" defaultValue={profile?.pseudonym || ''} placeholder="e.g. BlueJay" disabled={!isEditing} />
                                    <p className="text-xs text-muted-foreground mt-1">This name will be displayed during consultations if you enable it below.</p>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="use-pseudonym">Use Pseudonym</Label>
                                        <p className="text-xs text-muted-foreground">
                                        Enable this to use your pseudonym in consultations instead of your real name.
                                        </p>
                                    </div>
                                    <Switch
                                        id="use-pseudonym"
                                        checked={profile?.usePseudonym}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </ProfileSection>
                    </div>
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
