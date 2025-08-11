
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
    onAuthStateChanged, 
    User, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    UserCredential
} from 'firebase/auth';
import { auth, db } from '@/services/firebase';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

type Role = 'patient' | 'doctor' | 'pharmacist' | 'medical_lab' | 'hospital' | 'admin' | 'super_admin';

interface UserProfile {
    isVerified?: boolean;
    patientData?: {
        isMinor: boolean;
        childProfile?: any;
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
    signupWithEmail: (email: string, password: string, displayName: string, role: Role, additionalData?: any) => Promise<UserCredential>;
    loginWithEmail: (email: string, password: string) => Promise<UserCredential>;
    logout: () => Promise<void>;
    sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        console.log('AuthProvider mounted. Setting up onAuthStateChanged listener.');
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log('onAuthStateChanged event fired.');
            if (firebaseUser) {
                console.log(`User detected: ${firebaseUser.uid}. Forcing token refresh...`);
                try {
                    const idTokenResult = await firebaseUser.getIdTokenResult(true);
                    console.log('Token refreshed. Claims found:', idTokenResult.claims);
                    const role = (idTokenResult.claims.role as Role) || 'patient';
                    
                    const profileDocRef = doc(db, 'profiles', firebaseUser.uid);
                    const profileDoc = await getDoc(profileDocRef);
                    const profile = profileDoc.exists() ? (profileDoc.data() as UserProfile) : null;
                    
                    const authUser: AuthUser = { ...firebaseUser, role, profile };
                    setUser(authUser);

                    console.log(`User role identified as: '${role}'. Preparing to redirect.`);
                    
                    const currentPath = window.location.pathname;
                    
                    if (role === 'admin' || role === 'super_admin') {
                        if (!currentPath.startsWith('/admin')) {
                            console.log("Redirecting to /admin/dashboard...");
                            router.replace('/admin/dashboard');
                        }
                    } else if (role === 'doctor') {
                         if (!currentPath.startsWith('/doctor')) {
                            console.log("Redirecting to /doctor/dashboard...");
                            router.replace('/doctor/dashboard');
                         }
                    } else if (role === 'medical_lab') {
                        if (!currentPath.startsWith('/lab')) {
                            console.log("Redirecting to /lab/dashboard...");
                            router.replace('/lab/dashboard');
                        }
                    } else if (role === 'pharmacist') {
                        if (!currentPath.startsWith('/pharmacy')) {
                            console.log("Redirecting to /pharmacy/dashboard...");
                            router.replace('/pharmacy/dashboard');
                        }
                    } else if (role === 'hospital') {
                        if (!currentPath.startsWith('/hospital')) {
                            console.log("Redirecting to /hospital/dashboard...");
                            router.replace('/hospital/dashboard');
                        }
                    } else if (role === 'patient') {
                        if (!currentPath.startsWith('/dashboard')) {
                            console.log("Redirecting to /dashboard...");
                            router.replace('/dashboard');
                        }
                    } else {
                        console.log("Already on the correct page or no specific redirect rule matched.");
                    }

                } catch (error) {
                    console.error("Error refreshing token or processing claims:", error);
                    setUser(null);
                }
            } else {
                console.log('No user detected. Setting user state to null.');
                setUser(null);
            }
            setLoading(false);
            console.log('Auth loading state set to false.');
        });

        return () => {
            console.log('AuthProvider unmounting. Unsubscribing from onAuthStateChanged.');
            unsubscribe();
        };
    }, [router]);

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
            isVerified: role === 'super_admin' || (role === 'patient' && additionalData.patientType !== 'minor'),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        switch (role) {
            case 'patient':
                if (additionalData.patientType === 'minor') {
                    profileData.isVerified = false;
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
                profileData.phone = additionalData.phone;
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
