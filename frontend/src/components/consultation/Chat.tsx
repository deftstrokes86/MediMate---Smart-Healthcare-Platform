
"use client";

import { useState, useEffect, useRef, FormEvent } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { User } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
    id: string;
    senderId: string;
    message: string;
    timestamp: Timestamp;
    senderPhotoURL?: string | null;
    senderDisplayName?: string;
}

interface ChatProps {
    consultationId: string;
    currentUser: User;
}

export default function Chat({ consultationId, currentUser }: ChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chatQuery = query(
            collection(db, `consultations/${consultationId}/chat`),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as ChatMessage));
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [consultationId]);
    
    useEffect(() => {
        // Auto-scroll to bottom
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);


    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        try {
            await addDoc(collection(db, `consultations/${consultationId}/chat`), {
                senderId: currentUser.uid,
                message: newMessage,
                timestamp: serverTimestamp(),
                senderPhotoURL: currentUser.photoURL,
                senderDisplayName: currentUser.displayName,
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare />
                    Chat
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                 <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex items-end gap-2",
                                    msg.senderId === currentUser.uid ? "justify-end" : "justify-start"
                                )}
                            >
                                {msg.senderId !== currentUser.uid && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={msg.senderPhotoURL || undefined} />
                                        <AvatarFallback>{msg.senderDisplayName?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div
                                    className={cn(
                                        "max-w-xs rounded-lg p-3 text-sm",
                                        msg.senderId === currentUser.uid
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                    )}
                                >
                                    <p>{msg.message}</p>
                                </div>
                                {msg.senderId === currentUser.uid && (
                                     <Avatar className="h-8 w-8">
                                        <AvatarImage src={currentUser.photoURL || undefined} />
                                        <AvatarFallback>{currentUser.displayName?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-2">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    autoComplete="off"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </Card>
    );
}

