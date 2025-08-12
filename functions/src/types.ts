import type { FieldValue, Timestamp } from 'firebase-admin/firestore';

export type Role = 'patient'|'doctor'|'pharmacy'|'medical_lab'|'hospital'|'admin';

export interface GeoPoint { lat: number; lng: number; }

export interface KycMeta {
  licenseHash?: string;
  licenseType?: string;
  licenseExpiry?: Timestamp;
  docRefs?: string[];
  ocrRef?: string;
  riskScore?: number;
  cacRef?: string;
  insuranceRef?: string;
}

export interface Profile {
  uid: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  email?: string;
  phone?: string;
  dob?: Timestamp;
  gender?: 'male'|'female'|'other';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    coords?: GeoPoint;
  };
  languages?: string[];
  specialties?: string[];
  employerOrgId?: string;
  isVerified: boolean;
  verificationStatus: 'none'|'pending'|'approved'|'rejected';
  verificationRequestedAt?: Timestamp;
  verificationReviewedAt?: Timestamp;
  kyc?: KycMeta;
  providerDetails?: any;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}
