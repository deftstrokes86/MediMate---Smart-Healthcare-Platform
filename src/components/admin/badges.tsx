
import { Badge } from "@/components/ui/badge";

export const RoleBadge = ({ role }: { role: string }) => {
    const roleColors: { [key: string]: string } = {
        patient: "bg-blue-100 text-blue-800",
        doctor: "bg-green-100 text-green-800",
        pharmacist: "bg-purple-100 text-purple-800",
        medical_lab: "bg-yellow-100 text-yellow-800",
        hospital: "bg-red-100 text-red-800",
        admin: "bg-gray-800 text-white",
    };

    return (
        <Badge className={`border-transparent ${roleColors[role] || "bg-gray-100 text-gray-800"}`}>
            {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
    );
};

export const VerificationStatusBadge = ({ isVerified }: { isVerified?: boolean }) => {
    return isVerified ? (
        <Badge className="border-transparent bg-green-100 text-green-800">Verified</Badge>
    ) : (
        <Badge className="border-transparent bg-yellow-100 text-yellow-800">Pending</Badge>
    );
};
