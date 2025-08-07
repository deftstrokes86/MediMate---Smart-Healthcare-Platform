
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

interface AuthUser extends User {
    role?: Role;
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
            setLoading(true); // Start loading when auth state changes
            setRoleVerified(false);
            if (user) {
                try {
                    const idTokenResult = await user.getIdTokenResult(true); // Force refresh
                    const role = idTokenResult.claims.role as Role | undefined;
                    const authUser: AuthUser = { ...user, role };
                    setUser(authUser);
                    
                    const isAdmin = role === 'admin' || role === 'super_admin';
                    const isDoctor = role === 'doctor';
                    const isMedicalLab = role === 'medical_lab';
                    const isPharmacist = role === 'pharmacist';
                    const isHospital = role === 'hospital';
                    const isPatient = role === 'patient';


                    // If on a public page, redirect to the correct dashboard after login
                    if (pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/') {
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
                    } else if (isAdmin && !pathname.startsWith('/admin')) {
                        // If an admin is not in the admin section, redirect them
                        router.push('/admin/dashboard');
                    } else if (isDoctor && !pathname.startsWith('/doctor')) {
                        // If a doctor is not in the doctor section, redirect them
                        router.push('/doctor/dashboard');
                    } else if (isMedicalLab && !pathname.startsWith('/lab')) {
                        // If a lab user is not in the lab section, redirect them
                        router.push('/lab/dashboard');
                    } else if (isPharmacist && !pathname.startsWith('/pharmacy')) {
                        // If a pharmacist is not in the pharmacy section, redirect them
                        router.push('/pharmacy/dashboard');
                    } else if (isHospital && !pathname.startsWith('/hospital')) {
                        // If a hospital user is not in the hospital section, redirect them
                        router.push('/hospital/dashboard');
                    } else if (isPatient && !pathname.startsWith('/dashboard')) {
                        // This case is tricky, a patient might be on other public pages
                        // We will avoid redirecting them if they are on other allowed pages.
                    }
                    else if (!isAdmin && !isDoctor && !isMedicalLab && !isPharmacist && !isHospital && !isPatient && (pathname.startsWith('/admin') || pathname.startsWith('/doctor') || pathname.startsWith('/lab') || pathname.startsWith('/pharmacy') || pathname.startsWith('/hospital') || pathname.startsWith('/dashboard'))) {
                       // If a non-privileged user tries to access a protected area, send them home
                        router.push('/');
                    }

                } catch(error) {
                    console.error("Error getting user token:", error);
                    setUser(user); // Set user without role if token fails
                } finally {
                    setRoleVerified(true);
                }
            } else {
                setUser(null);
                setRoleVerified(true); // No user, so verification is "complete"
            }
             setLoading(false); // Stop loading after all checks are done
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
                    profileData.isVerified = true;
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
                    isVerified: true, // Super admins are auto-verified
                    phone: additionalData.phone,
                };
                break;
        }
        await setDoc(profileDocRef, profileData, { merge: true });
        
        // Redirection after signup is handled by onAuthStateChanged
        return userCredential;
    };

    const loginWithEmail = async (email: string, password: string) => {
        // Redirection is now handled by onAuthStateChanged, so we just sign in here.
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setRoleVerified(false);
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
