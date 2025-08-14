
"use client";

import React, { useState } from "react";
import ProviderProfilePage from "@/components/profile/ProviderProfilePage";
import { useAuth } from "@/contexts/auth-context";
import { Pill } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const availableServices = [
    "Prescription Fulfillment",
    "OTC Sales",
    "Delivery",
    "Vaccination",
    "Health Screenings",
    "Consultations"
];

export default function PharmacyProfilePage() {
    const { user, loading } = useAuth();
    
    // @ts-ignore
    const providerData = user?.profile?.pharmacistData || {};
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
            <InfoRow label="Pharmacy Name" value={providerData.pharmacyName} isEditing={isEditing} />
            <InfoRow label="Address" value={providerData.address} isEditing={isEditing} />
            <InfoRow label="PCN License" value={providerData.pcnLicense} isEditing={isEditing} />
            <InfoRow label="Pharmacist in Charge" value={providerData.pharmacistInCharge} isEditing={isEditing} />
            <InfoRow label="Pharmacist License" value={providerData.pharmacistInChargeLicense} isEditing={isEditing} />
        </>
    );

    const servicesContent = (isEditing: boolean) => (
         <div className="space-y-4">
            <Label>Available Services</Label>
            <div className="flex flex-wrap gap-2">
                {availableServices.map(service => {
                    const isSelected = selectedServices.includes(service);
                    return (
                        <Badge
                            key={service}
                            variant="outline"
                            onClick={() => isEditing && toggleService(service)}
                            className={cn(
                                "cursor-pointer transition-colors",
                                isSelected 
                                    ? "bg-primary text-primary-foreground hover:bg-primary/80" 
                                    : "bg-background text-foreground hover:bg-accent",
                                !isEditing && "cursor-not-allowed opacity-70"
                            )}
                        >
                            {service}
                        </Badge>
                    )
                })}
            </div>
             <p className="text-xs text-muted-foreground">
                {isEditing ? "Click on the services you provide." : "These are the services currently offered."}
            </p>
        </div>
    );
    
    return (
        <ProviderProfilePage
            user={user}
            loading={loading}
            pageTitle="Pharmacy Profile"
            profileIcon={<Pill className="text-primary" />}
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
