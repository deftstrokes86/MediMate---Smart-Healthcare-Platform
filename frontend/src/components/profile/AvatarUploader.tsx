
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/services/firebase';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
    file: z.any()
        .refine((files) => files?.length == 1, "A file is required.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
            ".jpg, .jpeg, .png and .webp files are accepted."
        ),
});

interface AvatarUploaderProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AvatarUploader({ isOpen, onOpenChange }: AvatarUploaderProps) {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const { toast } = useToast();
    const [isHovering, setIsHovering] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const file = values.file[0];
        if (!file || !user) return;

        setIsLoading(true);
        setUploadProgress(0);

        try {
            // 1. Get signed URL for upload
            const generateSignedUploadUrl = httpsCallable(functions, 'generateSignedUploadUrl');
            const result: any = await generateSignedUploadUrl({
                filename: `profilePicture.${file.name.split('.').pop()}`,
                contentType: file.type,
                docType: 'profile_picture' // A specific docType for profile pictures
            });
            
            const { uploadUrl, storagePath } = result.data;

            // 2. Upload the file to Firebase Storage
            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('PUT', uploadUrl, true);
                xhr.setRequestHeader('Content-Type', file.type);

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = Math.round((event.loaded / event.total) * 100);
                        setUploadProgress(percentComplete);
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve();
                    } else {
                        reject(new Error(`Upload failed with status: ${xhr.statusText}`));
                    }
                };

                xhr.onerror = () => reject(new Error('Network error during upload.'));
                xhr.send(file);
            });

            // 3. Call cloud function to update photoURL
            const updateProfilePicture = httpsCallable(functions, 'updateProfilePicture');
            await updateProfilePicture({ storagePath });

            toast({ title: "Upload Successful", description: "Your profile picture has been updated." });
            onOpenChange(false); // Close modal on success

        } catch (error: any) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: error.message || "An unknown error occurred.",
            });
        } finally {
            setIsLoading(false);
            setUploadProgress(null);
            form.reset();
        }
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Profile Picture</DialogTitle>
                    <DialogDescription>
                        Choose a new image to use for your profile. (Max 5MB)
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div 
                        className={cn("p-6 bg-[#EAF4FC] border-2 border-dashed border-[#DEE4EA] rounded-xl text-center cursor-pointer transition-colors", isHovering && "border-primary")}
                        onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                        onDragLeave={() => setIsHovering(false)}
                        onDrop={() => setIsHovering(false)}
                    >
                        <label htmlFor="avatar-upload" className="cursor-pointer flex flex-col items-center gap-2">
                            <UploadCloud className="w-8 h-8 text-primary" />
                            <span className="font-semibold text-primary">Click to upload or drag & drop</span>
                            <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (max 5MB)</p>
                        </label>
                        <Input 
                            id="avatar-upload"
                            type="file" 
                            {...form.register('file')}
                            disabled={isLoading}
                            className="sr-only"
                            accept={ACCEPTED_FILE_TYPES.join(',')}
                        />
                    </div>

                    {form.formState.errors.file && (
                        <p className="text-sm font-medium text-destructive">
                            {form.formState.errors.file.message as string}
                        </p>
                    )}

                    {uploadProgress !== null && <Progress value={uploadProgress} className="h-2" />}

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading || !form.watch('file')?.[0]}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                            {isLoading ? `Uploading... ${uploadProgress || 0}%` : "Upload & Save"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
