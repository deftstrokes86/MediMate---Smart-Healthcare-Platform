
import { Badge } from "@/components/ui/badge";

export const RoleBadge = ({ role }: { role: string }) => {
    const roleStyles: { [key: string]: string } = {
        patient: "bg-blue-100 text-blue-800 border-blue-200",
        doctor: "bg-emerald-100 text-emerald-800 border-emerald-200",
        pharmacist: "bg-purple-100 text-purple-800 border-purple-200",
        medical_lab: "bg-indigo-100 text-indigo-800 border-indigo-200",
        hospital: "bg-rose-100 text-rose-800 border-rose-200",
        admin: "bg-gray-200 text-gray-800 border-gray-300",
        super_admin: "bg-gray-800 text-white border-gray-900",
    };

    return (
        <Badge variant="outline" className={`font-medium ${roleStyles[role] || "bg-gray-100 text-gray-800"}`}>
            {role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
    );
};

type VerificationStatus = 'none' | 'pending' | 'approved' | 'rejected';

export const VerificationStatusBadge = ({ status }: { status: VerificationStatus }) => {
    const statusStyles: { [key in VerificationStatus]: { text: string; className: string; } } = {
        none: { text: "Not Submitted", className: "border-gray-200 bg-gray-50 text-gray-600" },
        pending: { text: "Pending", className: "border-amber-200 bg-amber-50 text-amber-700" },
        approved: { text: "Verified", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
        rejected: { text: "Rejected", className: "border-red-200 bg-red-50 text-red-700" },
    };

    const { text, className } = statusStyles[status] || statusStyles.none;

    return (
        <Badge variant="outline" className={className}>
            {text}
        </Badge>
    );
};
