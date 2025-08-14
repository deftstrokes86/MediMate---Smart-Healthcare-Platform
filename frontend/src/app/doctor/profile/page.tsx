
"use client";

import React from "react";
import ProviderProfilePage from "@/components/profile/ProviderProfilePage";
import { useAuth } from "@/contexts/auth-context";
import { Stethoscope, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DoctorProfilePage() {
    const { user, loading } = useAuth();
    
    // @ts-ignore - doctorData is not yet formally in the type
    const providerData = user?.profile?.doctorData || {};

    const infoRows = (isEditing: boolean) => (
        <>
            <InfoRow label="Full Name" value={providerData.fullName} isEditing={isEditing} />
            <InfoRow label="Gender" value={providerData.gender} isEditing={isEditing} />
            <InfoRow label="Date of Birth" value={providerData.dob} isEditing={isEditing} type="date" />
            <InfoRow label="Nationality" value={providerData.nationality} isEditing={isEditing} />
            <InfoRow label="Contact Address" value={providerData.address} isEditing={isEditing} />
        </>
    );

    const servicesContent = (isEditing: boolean) => (
        <>
            <InfoRow label="Specialization" value={providerData.specialization} isEditing={isEditing} />
            <InfoRow label="Years of Experience" value={providerData.yearsOfExperience} isEditing={isEditing} type="number" />
            <InfoRow label="MDCN License" value={providerData.medicalLicenseNumber} isEditing={isEditing} />
        </>
    );
    
    return (
        <ProviderProfilePage
            user={user}
            loading={loading}
            pageTitle="Professional Details"
            profileIcon={<Stethoscope className="text-primary" />}
            infoRows={infoRows}
            servicesContent={servicesContent}
        />
    );
}

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
