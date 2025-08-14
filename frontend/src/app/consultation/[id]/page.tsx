
"use client";

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Video, Phone, MessageSquare, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { useEffect, useState } from 'react';
import type { Consultation } from '@/lib/types/consultation';


export default function ConsultationPage() {
    const { id } = useParams();
    const { user, loading: authLoading } = useAuth();
    const [consultation, setConsultation] = useState<Consultation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || !user) return;

        const consultationRef = doc(db, 'consultations', id as string);
        const unsubscribe = onSnapshot(consultationRef, (docSnap) => {
            if (docSnap.exists()) {
                setConsultation(docSnap.data() as Consultation);
            } else {
                console.error("Consultation document not found!");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id, user]);
    
    if (authLoading || loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!consultation) {
        return <div>Consultation not found.</div>
    }

    const isPatient = user?.uid === consultation.patientId;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Video className="text-primary" />
                        Consultation In Progress
                    </CardTitle>
                    <CardDescription>
                        Consultation ID: {id}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-black rounded-lg aspect-video flex items-center justify-center text-white">
                        Video Stream Placeholder
                    </div>
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MessageSquare />
                                    Chat
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                Chat placeholder
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Phone />
                                    Controls
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                Call Controls placeholder
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

