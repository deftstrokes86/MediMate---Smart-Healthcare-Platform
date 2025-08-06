
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
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

type Role = 'patient' | 'doctor' | 'pharmacist' | 'medical_lab' | 'admin' | 'hospital';

interface AuthUser extends User {
    role?: Role;
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    signupWithEmail: (email: string, password: string, displayName: string, role: Role, additionalData?: any) => Promise<any>;
    loginWithEmail: (email: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
    sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Fetch user role from firestore
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const roles = userDoc.data().roles;
                    const role = Object.keys(roles).find(r => roles[r] === true) as Role;
                    setUser({ ...user, role });
                } else {
                    setUser(user);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signupWithEmail = async (email: string, password: string, displayName: string, role: Role, additionalData: any = {}) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        await updateProfile(firebaseUser, { displayName });

        // Create user document in 'users' collection
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userDocRef, {
            email: firebaseUser.email,
            displayName: displayName,
            photoURL: firebaseUser.photoURL,
            provider: firebaseUser.providerId,
            createdAt: new Date(),
            roles: { [role]: true }
        });

        // Create profile document in 'profiles' collection
        const profileDocRef = doc(db, 'profiles', firebaseUser.uid);
        let profileData: { [key: string]: any } = {
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        switch (role) {
            case 'patient':
                profileData.patientData = {
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
                break;
            case 'doctor':
                profileData.doctorData = { 
                    fullName: additionalData.doctorFullName,
                    gender: additionalData.doctorGender,
                    dob: additionalData.doctorDob,
                    nationality: additionalData.doctorNationality,
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
        }
        await setDoc(profileDocRef, profileData, { merge: true });
        
        router.push('/'); 
        return userCredential;
    };

    const loginWithEmail = async (email: string, password: string) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        router.push('/');
        return result;
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

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

    