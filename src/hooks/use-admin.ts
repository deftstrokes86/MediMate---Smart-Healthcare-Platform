
"use client";

import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, functions } from '@/services/firebase';
import { useToast } from '@/hooks/use-toast';
import { httpsCallable } from 'firebase/functions';

type UserRole = 'patient' | 'doctor' | 'pharmacist' | 'medical_lab' | 'hospital' | 'admin';

interface UserProfile {
    isVerified: boolean;
    // other profile data
}

interface User {
    uid: string;
    email: string;
    displayName: string;
    role: UserRole;
    profile: UserProfile | null;
    isVerifying?: boolean;
}

export function useAdmin() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const usersData = await Promise.all(
                usersSnapshot.docs.map(async (userDoc) => {
                    const userData = userDoc.data();
                    const profileDocRef = doc(db, 'profiles', userDoc.id);
                    const profileDoc = await getDoc(profileDocRef);
                    const roles = userData.roles || {};
                    const role = Object.keys(roles).find(r => roles[r] === true) as UserRole || 'patient';

                    return {
                        uid: userDoc.id,
                        email: userData.email || '',
                        displayName: userData.displayName || 'No Name',
                        role,
                        profile: profileDoc.exists() ? (profileDoc.data() as UserProfile) : null,
                    };
                })
            );
            setUsers(usersData);
        } catch (err: any) {
            setError(err.message);
            toast({
                variant: 'destructive',
                title: 'Error fetching users',
                description: err.message,
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);
    
    const verifyUser = async (uid: string) => {
        setUsers(prevUsers => prevUsers.map(u => u.uid === uid ? { ...u, isVerifying: true } : u));
        try {
            const profileDocRef = doc(db, 'profiles', uid);
            await updateDoc(profileDocRef, { isVerified: true });

            setUsers(prevUsers => prevUsers.map(user => 
                user.uid === uid 
                    ? { ...user, profile: { ...(user.profile as UserProfile), isVerified: true }, isVerifying: false } 
                    : user
            ));
            
            toast({
                title: 'User Verified',
                description: 'The user has been successfully verified.',
            });
        } catch (err: any) {
             setUsers(prevUsers => prevUsers.map(u => u.uid === uid ? { ...u, isVerifying: false } : u));
            setError(err.message);
             toast({
                variant: 'destructive',
                title: 'Verification Failed',
                description: err.message,
            });
        }
    };


    return { users, loading, error, verifyUser };
}
