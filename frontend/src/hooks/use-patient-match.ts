
"use client";

import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Patient } from '@/lib/types/patient';
import type { Profile } from '@/lib/types/profile';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

interface MatchData {
  patient: Patient | null;
  provider: Profile | null;
  loading: boolean;
}

export function usePatientMatch(): MatchData {
  const { user } = useAuth();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [provider, setProvider] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const patientDocRef = doc(db, 'patients', user.uid);

    const unsubscribe = onSnapshot(patientDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        const patientData = docSnap.data() as Patient;
        setPatient(patientData);

        if (patientData.matchStatus === 'matched' && patientData.matchedProviderId) {
          try {
            const providerDocRef = doc(db, 'profiles', patientData.matchedProviderId);
            const providerDoc = await getDoc(providerDocRef);
            if (providerDoc.exists()) {
              setProvider(providerDoc.data() as Profile);
              router.push(`/consultation/${user.uid}`);
            } else {
              setProvider(null);
            }
          } catch (error) {
            console.error("Error fetching provider profile:", error);
            setProvider(null);
          }
        } else {
          setProvider(null);
        }
      } else {
        setPatient(null);
        setProvider(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to patient document:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, router]);

  return { patient, provider, loading };
}
