
"use client";

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Video, Phone, MessageSquare, Mic, MicOff, VideoOff, PhoneOff, Loader2, Sparkles, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useWebRTC } from '@/hooks/use-webrtc';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export default function ConsultationPage() {
    const { id } = useParams();
    const { user, loading: authLoading } = useAuth();
    const consultationId = Array.isArray(id) ? id[0] : id;

    const {
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
    } = useWebRTC(consultationId, user?.uid, user?.role);

    if (authLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4">Loading user...</p>
            </div>
        );
    }

    const localUserName = localUser?.usePseudonym ? localUser.pseudonym : localUser?.displayName;
    const remoteUserName = remoteUser?.usePseudonym ? remoteUser.pseudonym : remoteUser?.displayName;
    
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-6xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Video className="text-primary" />
                        Consultation with {remoteUserName || '...'}
                    </CardTitle>
                    <CardDescription>
                        Consultation ID: {consultationId} - Status: <span className="font-semibold capitalize">{connectionState}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-black rounded-lg aspect-video flex items-center justify-center text-white relative overflow-hidden">
                            {remoteStream ? (
                                <video ref={el => el && (el.srcObject = remoteStream)} autoPlay playsInline className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="animate-spin h-8 w-8"/>
                                    <p>Waiting for {remoteUserName || 'other user'} to connect...</p>
                                </div>
                            )}
                            <div className="absolute top-4 left-4 bg-black/50 p-2 rounded-lg text-white text-sm font-semibold flex items-center gap-2">
                                {remoteUser ? (
                                    <>
                                        <Avatar className="h-6 w-6">
                                            {/* <AvatarImage src={remoteUser.photoURL} /> */}
                                            <AvatarFallback>{remoteUserName?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{remoteUserName}</span>
                                    </>
                                ) : <Skeleton className="h-6 w-24" />}
                            </div>
                            <div className="absolute bottom-4 right-4 w-1/4 max-w-[200px] aspect-video rounded-md overflow-hidden border-2 border-white/50">
                                 {localStream && !isVideoOff ? (
                                    <video ref={el => el && (el.srcObject = localStream)} autoPlay playsInline muted className="h-full w-full object-cover" />
                                 ) : (
                                    <div className="h-full w-full bg-black/50 flex items-center justify-center text-xs text-center p-2">Local video off</div>
                                 )}
                            </div>
                        </div>
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
                    </div>
                </CardContent>
                 <CardFooter className="flex-col items-center gap-4 border-t pt-6">
                    <div className="flex items-center gap-4">
                         <Button onClick={toggleMute} variant={isMuted ? 'destructive' : 'outline'} size="icon" className="rounded-full h-12 w-12">
                            {isMuted ? <MicOff /> : <Mic />}
                        </Button>
                         <Button onClick={toggleVideo} variant={isVideoOff ? 'destructive' : 'outline'} size="icon" className="rounded-full h-12 w-12">
                            {isVideoOff ? <VideoOff /> : <Video />}
                        </Button>
                         <Button onClick={toggleBlur} variant={isBlurOn ? 'default' : 'outline'} size="icon" className="rounded-full h-12 w-12">
                            <Sparkles />
                        </Button>
                         <Button onClick={endCall} variant="destructive" size="icon" className="rounded-full h-12 w-12">
                            <PhoneOff />
                        </Button>
                    </div>
                     <div className="text-sm text-muted-foreground mt-2">
                        You are in this call as: <strong>{localUserName || '...'}</strong>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
