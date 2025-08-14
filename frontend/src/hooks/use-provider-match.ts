
"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Patient } from '@/lib/types/patient';
import { useAuth } from '@/contexts/auth-context';

interface MatchedPatientData {
    uid: string;
    displayName: string;
    photoURL?: string;
    requestedSpecialty?: string;
}

interface ProviderMatchData {
  matchedPatient: MatchedPatientData | null;
  loading: boolean;
}

export function useProviderMatch(): ProviderMatchData {
  const { user } = useAuth();
  const [matchedPatient, setMatchedPatient] = useState<MatchedPatientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'patients'),
      where('matchedProviderId', '==', user.uid),
      where('matchStatus', '==', 'matched')
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      setLoading(true);
      if (querySnapshot.empty) {
        setMatchedPatient(null);
        setLoading(false);
        return;
      }

      // Assuming one match at a time for a provider
      const patientDoc = querySnapshot.docs[0];
      const patientData = patientDoc.data() as Patient;

      try {
        const userDocRef = doc(db, 'profiles', patientData.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setMatchedPatient({
            uid: patientData.uid,
            displayName: userData.displayName,
            photoURL: userData.photoURL,
            requestedSpecialty: patientData.requestedSpecialty
          });
        }
      } catch (error) {
        console.error("Error fetching patient user profile:", error);
        setMatchedPatient(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to patient matches:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { matchedPatient, loading };
}
