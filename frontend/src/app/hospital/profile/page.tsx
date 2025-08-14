"use client";

import React, { useState } from "react";
import ProviderProfilePage from "@/components/profile/ProviderProfilePage";
import { useAuth } from "@/contexts/auth-context";
import { Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const availableDepartments = [
    "General Practice",
    "Emergency",
    "Surgery",
    "Pediatrics",
    "Cardiology",
    "Oncology",
    "Neurology",
    "Orthopedics",
    "Maternity"
];


export default function HospitalProfilePage() {
    const { user, loading } = useAuth();
    
    // @ts-ignore
    const providerData = user?.profile?.hospitalData || {};
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
            <InfoRow label="Hospital Name" value={providerData.hospitalName} isEditing={isEditing} />
            <InfoRow label="Address" value={providerData.address} isEditing={isEditing} />
            <InfoRow label="Operating License" value={providerData.operatingLicense} isEditing={isEditing} />
            <InfoRow label="Medical Director" value={providerData.medicalDirector} isEditing={isEditing} />
            <InfoRow label="Hospital Type" value={providerData.hospitalType} isEditing={isEditing} />
        </>
    );

    const servicesContent = (isEditing: boolean) => (
        <div className="space-y-4">
            <Label>Available Departments</Label>
            <div className="flex flex-wrap gap-2">
                {availableDepartments.map(dept => {
                    const isSelected = selectedServices.includes(dept);
                    return (
                        <Badge
                            key={dept}
                            variant="outline"
                            onClick={() => isEditing && toggleService(dept)}
                            className={cn(
                                "cursor-pointer transition-colors",
                                isSelected 
                                    ? "bg-primary text-primary-foreground hover:bg-primary/80" 
                                    : "bg-background text-foreground hover:bg-accent",
                                !isEditing && "cursor-not-allowed opacity-70"
                            )}
                        >
                            {dept}
                        </Badge>
                    )
                })}
            </div>
             <p className="text-xs text-muted-foreground">
                {isEditing ? "Click on the departments you have." : "These are the departments currently offered."}
            </p>
        </div>
    );
    
    return (
        <ProviderProfilePage
            user={user}
            loading={loading}
            pageTitle="Hospital Profile"
            profileIcon={<Building className="text-primary" />}
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
