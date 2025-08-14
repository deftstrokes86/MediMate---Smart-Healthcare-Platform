"use client";

import React, { useState } from "react";
import ProviderProfilePage from "@/components/profile/ProviderProfilePage";
import { useAuth } from "@/contexts/auth-context";
import { FlaskConical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const availableTests = [
    "Blood Test",
    "X-Ray",
    "MRI",
    "Urinalysis",
    "CT Scan",
    "Ultrasound",
    "ECG",
    "Biopsy"
];

export default function LabProfilePage() {
    const { user, loading } = useAuth();
    
    // @ts-ignore
    const providerData = user?.profile?.medicalLabData || {};
    const [selectedServices, setSelectedServices] = useState<string[]>(providerData.services || []);

    const toggleService = (service: string) => {
        setSelectedServices(prev => 
            prev.includes(service) 
                ? prev.filter(s => s !== service)
                : [...prev, service]
        );
    };

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
        <div className="space-y-4">
            <Label>Available Tests</Label>
            <div className="flex flex-wrap gap-2">
                {availableTests.map(test => {
                    const isSelected = selectedServices.includes(test);
                    return (
                        <Badge
                            key={test}
                            variant="outline"
                            onClick={() => isEditing && toggleService(test)}
                            className={cn(
                                "cursor-pointer transition-colors",
                                isSelected 
                                    ? "bg-primary text-primary-foreground hover:bg-primary/80" 
                                    : "bg-background text-foreground hover:bg-accent",
                                !isEditing && "cursor-not-allowed opacity-70"
                            )}
                        >
                            {test}
                        </Badge>
                    )
                })}
            </div>
             <p className="text-xs text-muted-foreground">
                {isEditing ? "Click on the tests you provide." : "These are the services currently offered."}
            </p>
        </div>
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
