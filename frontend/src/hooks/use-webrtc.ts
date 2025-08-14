
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { doc, onSnapshot, collection, addDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Role, Profile } from '@/lib/types/profile';
import type { Consultation, RTCSessionDescription } from '@/lib/types/consultation';
import { useRouter } from 'next/navigation';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

let faceLandmarker: FaceLandmarker;
let lastVideoTime = -1;

export function useWebRTC(consultationId: string, currentUserId?: string, currentUserRole?: Role) {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isBlurOn, setIsBlurOn] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
    const [localUser, setLocalUser] = useState<Profile | null>(null);
    const [remoteUser, setRemoteUser] = useState<Profile | null>(null);
    
    const pc = useRef<RTCPeerConnection | null>(null);
    const unprocessedLocalStream = useRef<MediaStream | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
    const videoRef = useRef<HTMLVideoElement>(document.createElement('video'));
    const requestAnimationRef = useRef<number>(0);

    const router = useRouter();


    const createFaceLandmarker = async () => {
        const filesetResolver = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );
        faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                delegate: "GPU"
            },
            outputFaceBlendshapes: false,
            runningMode: "VIDEO",
            outputFaceLandmarks: true,
            numFaces: 1
        });
    };

    const processVideo = useCallback(() => {
        if (!isBlurOn || !unprocessedLocalStream.current) return;
    
        const video = videoRef.current;
        if(video.srcObject !== unprocessedLocalStream.current) {
            video.srcObject = unprocessedLocalStream.current;
            video.play();
        }
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        if (video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime;
            const faceLandmarkerResult = faceLandmarker.detectForVideo(video, Date.now());

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            if (faceLandmarkerResult.faceLandmarks.length > 0) {
                 faceLandmarkerResult.faceLandmarks.forEach(landmarks => {
                    const xCoords = landmarks.map(lm => lm.x * canvas.width);
                    const yCoords = landmarks.map(lm => lm.y * canvas.height);

                    const minX = Math.min(...xCoords);
                    const maxX = Math.max(...xCoords);
                    const minY = Math.min(...yCoords);
                    const maxY = Math.max(...yCoords);
                    
                    const width = maxX - minX;
                    const height = maxY - minY;

                    ctx.filter = 'blur(20px)';
                    ctx.fillRect(minX, minY, width, height);
                    ctx.filter = 'none';
                });
            }
        }

        requestAnimationRef.current = requestAnimationFrame(processVideo);

    }, [isBlurOn]);

    const startProcessing = useCallback(() => {
        if (!faceLandmarker) {
            createFaceLandmarker().then(() => {
                setIsProcessing(true);
                requestAnimationRef.current = requestAnimationFrame(processVideo);
            })
        } else {
            setIsProcessing(true);
            requestAnimationRef.current = requestAnimationFrame(processVideo);
        }
    }, [processVideo]);

    const stopProcessing = useCallback(() => {
         cancelAnimationFrame(requestAnimationRef.current);
         setIsProcessing(false);
    }, []);

    const toggleBlur = useCallback(async () => {
        const shouldBeOn = !isBlurOn;
        setIsBlurOn(shouldBeOn);

        if (shouldBeOn) {
            startProcessing();
            const canvasStream = canvasRef.current.captureStream();
            const audioTrack = unprocessedLocalStream.current?.getAudioTracks()[0];
            if (audioTrack) {
                canvasStream.addTrack(audioTrack);
            }
            setLocalStream(canvasStream);

            const videoTrack = canvasStream.getVideoTracks()[0];
            const sender = pc.current?.getSenders().find(s => s.track?.kind === 'video');
            if (sender) {
                await sender.replaceTrack(videoTrack);
            }

        } else {
            stopProcessing();
            setLocalStream(unprocessedLocalStream.current);
            const videoTrack = unprocessedLocalStream.current?.getVideoTracks()[0];
            if (videoTrack) {
                const sender = pc.current?.getSenders().find(s => s.track?.kind === 'video');
                if (sender) {
                    await sender.replaceTrack(videoTrack);
                }
            }
        }

    }, [isBlurOn, startProcessing, stopProcessing]);

    const setupMedia = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            unprocessedLocalStream.current = stream;
            setLocalStream(stream);
            return stream;
        } catch (error) {
            console.error("Error accessing media devices.", error);
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
        if (unprocessedLocalStream.current) {
            unprocessedLocalStream.current.getTracks().forEach(track => track.stop());
        }
        setLocalStream(null);
        setRemoteStream(null);
        stopProcessing();

        if (consultationId) {
            const consultationRef = doc(db, 'consultations', consultationId);
            await updateDoc(consultationRef, { status: 'ended' });
        }
        
        if(currentUserRole === 'doctor') {
            router.push('/doctor/dashboard');
        } else {
            router.push('/dashboard');
        }

    }, [localStream, consultationId, router, currentUserRole, stopProcessing]);


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

            const fetchUsers = async () => {
                const localProfileDoc = await getDoc(doc(db, 'profiles', currentUserId));
                setLocalUser(localProfileDoc.data() as Profile);

                const remoteUserId = currentUserRole === 'patient' ? consultationData.providerId : consultationData.patientId;
                const remoteProfileDoc = await getDoc(doc(db, 'profiles', remoteUserId));
                setRemoteUser(remoteProfileDoc.data() as Profile);
            };

             if (consultationData.status === 'ended') {
                endCall();
                return;
            }
            
            // PATIENT creates the offer
            if (currentUserRole === 'patient' && !consultationData.offer) {
                const stream = await setupMedia();
                if (!stream) return;
                fetchUsers();
                initializePeerConnection(stream);

                const offerDescription = await pc.current!.createOffer();
                await pc.current!.setLocalDescription(offerDescription);

                const offer = {
                    sdp: offerDescription.sdp,
                    type: offerDescription.type,
                };
                await updateDoc(consultationRef, { offer });

                const iceCandidatesCollection = collection(consultationRef, 'iceCandidates');
                pc.current!.onicecandidate = event => {
                    event.candidate && addDoc(iceCandidatesCollection, event.candidate.toJSON());
                };
            }

            // PROVIDER creates the answer
            if (currentUserRole === 'doctor' && consultationData.offer && !consultationData.answer) {
                const stream = await setupMedia();
                if (!stream) return;
                fetchUsers();
                initializePeerConnection(stream);
                
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
            if (unprocessedLocalStream.current) {
                unprocessedLocalStream.current.getTracks().forEach(track => track.stop());
            }
            stopProcessing();
        };

    }, [consultationId, currentUserId, currentUserRole, setupMedia, endCall, stopProcessing]);

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

    return { 
        localStream, 
        remoteStream, 
        isMuted, 
        isVideoOff, 
        isBlurOn, 
        toggleMute, 
        toggleVideo, 
        toggleBlur, 
        endCall, 
        connectionState,
        localUser,
        remoteUser
    };
}
