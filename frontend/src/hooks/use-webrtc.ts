
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { doc, onSnapshot, collection, addDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Role } from '@/lib/types/profile';
import type { Consultation, RTCSessionDescription } from '@/lib/types/consultation';
import { useRouter } from 'next/navigation';

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

export function useWebRTC(consultationId: string, currentUserId?: string, currentUserRole?: Role) {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
    const pc = useRef<RTCPeerConnection | null>(null);
    const router = useRouter();

    const setupMedia = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            return stream;
        } catch (error) {
            console.error("Error accessing media devices.", error);
            // Handle error (e.g., show a message to the user)
            return null;
        }
    }, []);

    const endCall = useCallback(async () => {
        if (pc.current) {
            pc.current.close();
            pc.current = null;
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        setLocalStream(null);
        setRemoteStream(null);

        if (consultationId) {
            const consultationRef = doc(db, 'consultations', consultationId);
            await updateDoc(consultationRef, { status: 'ended' });
        }
        
        // Redirect based on role
        if(currentUserRole === 'doctor') {
            router.push('/doctor/dashboard');
        } else {
            router.push('/dashboard');
        }

    }, [localStream, consultationId, router, currentUserRole]);


    useEffect(() => {
        if (!consultationId || !currentUserId || !currentUserRole) return;

        const consultationRef = doc(db, 'consultations', consultationId);
        
        const initializePeerConnection = (stream: MediaStream) => {
            pc.current = new RTCPeerConnection(servers);
            setConnectionState(pc.current.connectionState);

            stream.getTracks().forEach(track => {
                pc.current!.addTrack(track, stream);
            });

            pc.current.ontrack = event => {
                setRemoteStream(event.streams[0]);
            };

            pc.current.onconnectionstatechange = () => {
                if (pc.current) {
                    setConnectionState(pc.current.connectionState);
                }
            };
        };


        const unsubscribe = onSnapshot(consultationRef, async (snapshot) => {
            const consultationData = snapshot.data() as Consultation;

             if (consultationData.status === 'ended') {
                endCall();
                return;
            }
            
            // PATIENT creates the offer
            if (currentUserRole === 'patient' && !consultationData.offer) {
                const stream = await setupMedia();
                if (!stream) return;

                initializePeerConnection(stream);

                const offerDescription = await pc.current!.createOffer();
                await pc.current!.setLocalDescription(offerDescription);

                const offer = {
                    sdp: offerDescription.sdp,
                    type: offerDescription.type,
                };
                await updateDoc(consultationRef, { offer });

                // Listen for ICE candidates
                const iceCandidatesCollection = collection(consultationRef, 'iceCandidates');
                pc.current!.onicecandidate = event => {
                    event.candidate && addDoc(iceCandidatesCollection, event.candidate.toJSON());
                };
            }

            // PROVIDER creates the answer
            if (currentUserRole === 'doctor' && consultationData.offer && !consultationData.answer) {
                const stream = await setupMedia();
                if (!stream) return;

                initializePeerConnection(stream);
                
                // Listen for ICE candidates
                const iceCandidatesCollection = collection(consultationRef, 'iceCandidates');
                pc.current!.onicecandidate = event => {
                    event.candidate && addDoc(iceCandidatesCollection, event.candidate.toJSON());
                };

                await pc.current!.setRemoteDescription(new RTCSessionDescription(consultationData.offer as RTCSessionDescription));
                
                const answerDescription = await pc.current!.createAnswer();
                await pc.current!.setLocalDescription(answerDescription);

                const answer = {
                    type: answerDescription.type,
                    sdp: answerDescription.sdp,
                };
                await updateDoc(consultationRef, { answer });
            }

            // PATIENT sets remote description with the answer
            if (currentUserRole === 'patient' && consultationData.answer) {
                if (pc.current && pc.current.remoteDescription === null) {
                    await pc.current!.setRemoteDescription(new RTCSessionDescription(consultationData.answer as RTCSessionDescription));
                }
            }
        });
        
        // Listen for ICE candidates from the other peer
        const iceCandidatesCollection = collection(consultationRef, 'iceCandidates');
        const unsubscribeIce = onSnapshot(iceCandidatesCollection, (snapshot) => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.current?.addIceCandidate(candidate);
                }
            })
        });

        return () => {
            unsubscribe();
            unsubscribeIce();
            if (pc.current) {
                pc.current.close();
            }
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };

    }, [consultationId, currentUserId, currentUserRole, setupMedia, endCall]);

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(prev => !prev);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(prev => !prev);
        }
    };


    return { localStream, remoteStream, isMuted, isVideoOff, toggleMute, toggleVideo, endCall, connectionState };
}

