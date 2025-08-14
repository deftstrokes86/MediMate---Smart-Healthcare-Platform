
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
    UserCredential,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth, db } from '@/services/firebase';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

type Role = 'patient' | 'doctor' | 'pharmacist' | 'medical_lab' | 'hospital' | 'admin' | 'super_admin';

interface UserProfile {
    isVerified?: boolean;
    usePseudonym?: boolean;
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
    loginWithGoogle: () => Promise<UserCredential>;
    logout: () => Promise<void>;
    sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let profileUnsubscribe: (() => void) | null = null;

        const authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            // Clean up previous profile listener if it exists
            if (profileUnsubscribe) {
                profileUnsubscribe();
            }

            if (firebaseUser) {
                try {
                    const idTokenResult = await firebaseUser.getIdTokenResult(true);
                    const role = (idTokenResult.claims.role as Role) || 'patient';
                    
                    const profileDocRef = doc(db, 'profiles', firebaseUser.uid);

                    // Set up real-time listener for the profile
                    profileUnsubscribe = onSnapshot(profileDocRef, (profileDoc) => {
                        const profile = profileDoc.exists() ? (profileDoc.data() as UserProfile) : null;
                        const authUser: AuthUser = { ...firebaseUser, role, profile };
                        setUser(authUser);

                        // Only redirect on initial load or role change, not every profile update
                        if (loading) {
                            const currentPath = window.location.pathname;
                            if (role === 'admin' || role === 'super_admin') {
                                if (!currentPath.startsWith('/admin')) router.replace('/admin/dashboard');
                            } else if (role === 'doctor') {
                                if (!currentPath.startsWith('/doctor')) router.replace('/doctor/dashboard');
                            } else if (role === 'medical_lab') {
                                if (!currentPath.startsWith('/lab')) router.replace('/lab/dashboard');
                            } else if (role === 'pharmacist') {
                                if (!currentPath.startsWith('/pharmacy')) router.replace('/pharmacy/dashboard');
                            } else if (role === 'hospital') {
                                if (!currentPath.startsWith('/hospital')) router.replace('/hospital/dashboard');
                            } else if (role === 'patient') {
                                // Allow staying on certain public pages even if logged in
                                const publicOkPaths = ['/', '/about', '/contact', '/features', '/how-it-works', '/faq', '/privacy-policy', '/terms', '/parental-consent', '/symptom-checker'];
                                if (!currentPath.startsWith('/dashboard') && !publicOkPaths.includes(currentPath)) {
                                    router.replace('/dashboard');
                                }
                            }
                        }
                         setLoading(false);
                    });

                } catch (error) {
                    console.error("Error setting up user session:", error);
                    setUser(null);
                    setLoading(false);
                }
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => {
            authUnsubscribe();
            if (profileUnsubscribe) {
                profileUnsubscribe();
            }
        };
    }, [router, loading]);

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
            displayName,
            email,
            role,
            isVerified: role === 'super_admin' || (role === 'patient' && additionalData.patientType !== 'minor'),
            verificationStatus: 'none',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };
        if (role === 'doctor') {
             profileData.verificationStatus = 'pending';
        }


        switch (role) {
            case 'patient':
                if (additionalData.patientType === 'minor') {
                    profileData.isVerified = false;
                    profileData.verificationStatus = 'pending';
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
                    profileData.verificationStatus = 'approved';
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
                    profileData.pseudonym = additionalData.pseudonym;
                    profileData.usePseudonym = additionalData.usePseudonym;
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
                 profileData.verificationStatus = 'pending';
                profileData.pharmacistData = {
                    pharmacyName: additionalData.pharmacyName,
                    address: additionalData.pharmacyAddress,
                    pcnLicense: additionalData.pcnLicense,
                    pharmacistInCharge: additionalData.pharmacistInCharge,
                    pharmacistInChargeLicense: additionalData.pharmacistInChargeLicense,
                };
                break;
            case 'medical_lab':
                 profileData.verificationStatus = 'pending';
                profileData.medicalLabData = {
                    labName: additionalData.labName,
                    address: additionalData.labAddress,
                    cacRegistration: additionalData.cacCertificate,
                    mlscnLicense: additionalData.mlscnLicense,
                    labManagerName: additionalData.labManagerName,
                };
                break;
            case 'hospital':
                 profileData.verificationStatus = 'pending';
                profileData.hospitalData = {
                    hospitalName: additionalData.hospitalName,
                    address: additionalData.hospitalAddress,
                    operatingLicense: additionalData.hospitalRegistrationNumber,
                    medicalDirector: additionalData.medicalDirector,
                    hospitalType: additionalData.hospitalType,
                };
                break;
             case 'super_admin':
                 profileData.verificationStatus = 'approved';
                profileData.phone = additionalData.phone;
                break;
        }
        await setDoc(profileDocRef, profileData, { merge: true });
        
        return userCredential;
    };

    const loginWithEmail = async (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const firebaseUser = userCredential.user;

        const profileDocRef = doc(db, 'profiles', firebaseUser.uid);
        const profileDoc = await getDoc(profileDocRef);

        if (!profileDoc.exists()) {
             // New user, create documents
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDocPayload = {
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                provider: firebaseUser.providerId,
                createdAt: serverTimestamp(),
                roles: { patient: true } // Default role
            };
            await setDoc(userDocRef, userDocPayload);

            await setDoc(profileDocRef, {
                displayName: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                role: 'patient',
                isVerified: true,
                verificationStatus: 'approved',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                patientData: { isMinor: false }
            });
        }
        return userCredential;
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
        loginWithGoogle,
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
