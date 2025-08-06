
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

type Role = 'patient' | 'doctor' | 'pharmacist' | 'lab_technician' | 'admin';

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
        
        // Update Firebase Auth profile
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
        let profileData = {};
        switch (role) {
            case 'patient':
                profileData = { patientData: {} };
                break;
            case 'doctor':
                profileData = { doctorData: { licenseNumber: additionalData.licenseNumber, specialization: additionalData.specialization, isVerified: false } };
                break;
            case 'pharmacist':
                profileData = { pharmacistData: { pharmacyRegistration: additionalData.pharmacyRegistration }};
                break;
            case 'lab_technician':
                profileData = { labTechnicianData: { labAffiliation: additionalData.labAffiliation }};
                break;
        }
        await setDoc(profileDocRef, profileData);
        
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
