
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
    onAuthStateChanged, 
    User, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile
} from 'firebase/auth';
import { auth, db } from '@/services/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';

type Role = 'patient' | 'doctor' | 'pharmacist' | 'medical_lab' | 'hospital' | 'admin' | 'super_admin';

interface UserProfile {
    isVerified?: boolean;
    patientData?: {
        isMinor: boolean;
        // other patient data
    };
    // other profile data for different roles
}

interface AuthUser extends User {
    role?: Role;
    profile?: UserProfile | null;
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    roleVerified: boolean;
    signupWithEmail: (email: string, password: string, displayName: string, role: Role, additionalData?: any) => Promise<any>;
    loginWithEmail: (email: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
    sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [roleVerified, setRoleVerified] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true); 
            setRoleVerified(false);
            if (user) {
                try {
                    const idTokenResult = await user.getIdTokenResult(true);
                    const role = idTokenResult.claims.role as Role | undefined;
                    
                    const profileDocRef = doc(db, 'profiles', user.uid);
                    const profileDoc = await getDoc(profileDocRef);
                    const profile = profileDoc.exists() ? (profileDoc.data() as UserProfile) : null;
                    
                    const authUser: AuthUser = { ...user, role, profile };
                    setUser(authUser);
                    
                    const isAdmin = role === 'admin' || role === 'super_admin';
                    const isDoctor = role === 'doctor';
                    const isMedicalLab = role === 'medical_lab';
                    const isPharmacist = role === 'pharmacist';
                    const isHospital = role === 'hospital';
                    const isPatient = role === 'patient';

                    const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';

                    if (isAuthPage) {
                         if (isAdmin) {
                            router.push('/admin/dashboard');
                         } else if (isDoctor) {
                             router.push('/doctor/dashboard');
                         } else if (isMedicalLab) {
                            router.push('/lab/dashboard');
                         } else if (isPharmacist) {
                            router.push('/pharmacy/dashboard');
                         } else if (isHospital) {
                            router.push('/hospital/dashboard');
                         } else if (isPatient) {
                            router.push('/dashboard'); 
                         } else {
                            router.push('/');
                         }
                    }

                } catch(error) {
                    console.error("Error getting user token or profile:", error);
                    setUser(user); 
                } finally {
                    setRoleVerified(true);
                }
            } else {
                setUser(null);
                setRoleVerified(true);
            }
             setLoading(false); 
        });

        return () => unsubscribe();
    }, [pathname, router]);

    const signupWithEmail = async (email: string, password: string, displayName: string, role: Role, additionalData: any = {}) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        await updateProfile(firebaseUser, { displayName });
        
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocPayload: { [key: string]: any } = {
            email: firebaseUser.email,
            displayName: displayName,
            photoURL: firebaseUser.photoURL,
            provider: firebaseUser.providerId,
            createdAt: serverTimestamp(),
            roles: { [role]: true }
        };
         if (role === 'super_admin' && additionalData.token) {
            const inviteDoc = await getDoc(doc(db, 'adminInvites', additionalData.token));
            if (inviteDoc.exists()) {
                 userDocPayload.createdBy = inviteDoc.data().invitedBy;
            }
        }
        await setDoc(userDocRef, userDocPayload);

        const profileDocRef = doc(db, 'profiles', firebaseUser.uid);
        let profileData: { [key: string]: any } = {
            isVerified: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        switch (role) {
            case 'patient':
                if (additionalData.patientType === 'minor') {
                    profileData.patientData = {
                        isMinor: true,
                        childProfile: {
                            fullName: additionalData.childFullName,
                            dob: additionalData.childDob,
                            gender: additionalData.childGender,
                            ninOrBirthCert: additionalData.childNinOrBirthCert,
                            medicalHistory: additionalData.childMedicalHistory,
                            location: additionalData.childLocation,
                        },
                        guardianProfile: {
                            fullName: additionalData.guardianFullName,
                            relationship: additionalData.guardianRelationship,
                            phone: additionalData.guardianPhone,
                            email: additionalData.email,
                            idNumber: additionalData.guardianId,
                            proofOfGuardianship: additionalData.guardianProof,
                        }
                    };
                } else {
                    profileData.patientData = {
                        isMinor: false,
                        fullName: additionalData.patientFullName,
                        dob: additionalData.dob,
                        gender: additionalData.gender,
                        nationality: additionalData.nationality,
                        address: additionalData.address,
                        phone: additionalData.phone,
                        whatsappNumber: additionalData.whatsappNumber,
                        emergencyContact: {
                            name: additionalData.emergencyContactName,
                            phone: additionalData.emergencyContactPhone,
                            relationship: additionalData.emergencyContactRelationship,
                        },
                        bloodType: additionalData.bloodType,
                        allergies: additionalData.allergies,
                        chronicConditions: additionalData.chronicConditions,
                    };
                     profileData.isVerified = true;
                }
                break;
            case 'doctor':
                profileData.doctorData = { 
                    fullName: additionalData.doctorFullName,
                    gender: additionalData.doctorGender,
                    dob: additionalData.doctorDob,
                    nationality: additionalData.nationality,
                    phone: additionalData.doctorPhone,
                    address: additionalData.doctorAddress,
                    medicalLicenseNumber: additionalData.medicalLicenseNumber,
                    specialization: additionalData.specialization, 
                    yearsOfExperience: additionalData.yearsOfExperience,
                };
                break;
            case 'pharmacist':
                profileData.pharmacistData = {
                    pharmacyName: additionalData.pharmacyName,
                    address: additionalData.pharmacyAddress,
                    pcnLicense: additionalData.pcnLicense,
                    pharmacistInCharge: additionalData.pharmacistInCharge,
                    pharmacistInChargeLicense: additionalData.pharmacistInChargeLicense,
                };
                break;
            case 'medical_lab':
                profileData.medicalLabData = {
                    labName: additionalData.labName,
                    address: additionalData.labAddress,
                    cacRegistration: additionalData.cacCertificate,
                    mlscnLicense: additionalData.mlscnLicense,
                    labManagerName: additionalData.labManagerName,
                };
                break;
            case 'hospital':
                profileData.hospitalData = {
                    hospitalName: additionalData.hospitalName,
                    address: additionalData.hospitalAddress,
                    operatingLicense: additionalData.hospitalRegistrationNumber,
                    medicalDirector: additionalData.medicalDirector,
                    hospitalType: additionalData.hospitalType,
                };
                break;
             case 'super_admin':
                profileData = {
                    ...profileData,
                    isVerified: true, 
                    phone: additionalData.phone,
                };
                break;
        }
        await setDoc(profileDocRef, profileData, { merge: true });
        
        return userCredential;
    };

    const loginWithEmail = async (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        await signOut(auth);
        router.push('/login');
    };
    
    const sendPasswordReset = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    };

    const value = {
        user,
        loading,
        roleVerified,
        signupWithEmail,
        loginWithEmail,
        logout,
        sendPasswordReset
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
