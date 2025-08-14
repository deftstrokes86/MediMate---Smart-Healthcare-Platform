
import type { FieldValue, Timestamp } from 'firebase/firestore';

export type Role = 'patient'|'doctor'|'pharmacy'|'medical_lab'|'hospital'|'admin';

export interface GeoPoint { lat: number; lng: number; }

export interface KycMeta {
  licenseHash?: string;               // hashed license number (never plaintext)
  licenseType?: string;               // e.g., 'MDCN','PCN','MLSCN','StateFacility'
  licenseExpiry?: Timestamp;
  docRefs?: string[];                 // storage paths: "private/kyc/{uid}/{docId}"
  ocrRef?: string;                    // pointer to OCR docId if available
  riskScore?: number;
  cacRef?: string;                    // storage path to CAC doc for orgs (optional)
  insuranceRef?: string;              // malpractice/PI insurance doc path (optional)
}

export interface Profile {
  uid: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  pseudonym?: string;
  usePseudonym?: boolean;
  role: Role;
  email?: string;
  phone?: string;
  bio?: string;
  dob?: Timestamp;
  gender?: 'male'|'female'|'other';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    coords?: GeoPoint;
  };
  languages?: string[];                // e.g. ['en','yo','ig','ha']
  specialties?: string[];              // clinical specialties (doctors)
  services?: string[];                 // for labs, pharmacies, hospitals
  employerOrgId?: string;              // for staff accounts (pointer to org collection)
  isVerified: boolean;                 // set ONLY by server
  verificationStatus: 'none'|'pending'|'approved'|'rejected';
  verificationRequestedAt?: Timestamp;
  verificationReviewedAt?: Timestamp;
  kyc?: KycMeta;
  providerDetails?: any;               // provider-type-specific small object
  
  // Provider-specific fields for matching
  availability?: boolean;              // Default: false
  lastAvailable?: Timestamp;
  rating?: number;                     // Default: 0
  consultationCount?: number;          // Default: 0

  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export interface DoctorProviderDetails {
    mdcnNumber?: string;
    primaryDegreeRef?: string;
}

export interface PharmacyProviderDetails {
    pcnPremisesNumber?: string;
    premisesAddress?: { street: string, city: string, state: string };
    cacRef?: string;
}

export interface MedicalLabProviderDetails {
    mlscnNumber?: string;
    labClass?: 'basic'|'intermediate'|'advanced';
    facilityLayoutRef?: string;
}

export interface HospitalProviderDetails {
    stateFacilityRegistrationNo?: string;
    hefamaaRef?: string;
    bedCapacity?: number;
}
