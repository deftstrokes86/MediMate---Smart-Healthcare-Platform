
"use client";

import { useState, useEffect } from 'react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Patient } from '@/lib/types/patient';
import type { Profile } from '@/lib/types/profile';
import { useAuth } from '@/contexts/auth-context';

interface PatientMatchData {
  patient: Patient | null;
  provider: Profile | null;
  loading: boolean;
}

export function usePatientMatch(): PatientMatchData {
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [provider, setProvider] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const patientRef = doc(db, 'patients', user.uid);
    
    const unsubscribe = onSnapshot(patientRef, async (docSnap) => {
      setLoading(true);
      if (docSnap.exists()) {
        const patientData = docSnap.data() as Patient;
        setPatient(patientData);

        if (patientData.matchStatus === 'matched' && patientData.matchedProviderId) {
          try {
            const providerRef = doc(db, 'profiles', patientData.matchedProviderId);
            const providerSnap = await getDoc(providerRef);
            if (providerSnap.exists()) {
              setProvider(providerSnap.data() as Profile);
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
  }, [user]);

  return { patient, provider, loading };
}
