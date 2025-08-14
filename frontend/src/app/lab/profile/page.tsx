
"use client";

import ProviderProfilePage from "@/components/profile/ProviderProfilePage";
import { useAuth } from "@/contexts/auth-context";
import { FlaskConical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function LabProfilePage() {
    const { user, loading } = useAuth();
    
    // @ts-ignore
    const providerData = user?.profile?.medicalLabData || {};

    const infoRows = (isEditing: boolean) => (
        <>
            <InfoRow label="Lab Name" value={providerData.labName} isEditing={isEditing} />
            <InfoRow label="Address" value={providerData.address} isEditing={isEditing} />
            <InfoRow label="CAC Registration" value={providerData.cacRegistration} isEditing={isEditing} />
            <InfoRow label="MLSCN License" value={providerData.mlscnLicense} isEditing={isEditing} />
            <InfoRow label="Lab Manager" value={providerData.labManagerName} isEditing={isEditing} />
        </>
    );

    const servicesContent = (isEditing: boolean) => (
        <p className="text-muted-foreground text-sm">
            Lab services management will be available here.
        </p>
    );
    
    return (
        <ProviderProfilePage
            user={user}
            loading={loading}
            pageTitle="Medical Lab Profile"
            profileIcon={<FlaskConical className="text-primary" />}
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

