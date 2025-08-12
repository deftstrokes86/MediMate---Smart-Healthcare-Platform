
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, FileCheck2, FileX2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Label } from '../ui/label';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const formSchema = z.object({
    file: z.any()
        .refine((files) => files?.length == 1, "File is required.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
        .refine(
            (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
            ".jpg, .jpeg, .png and .pdf files are accepted."
        ),
});

// This is a basic scaffold. You'll need to integrate this with a callable
// Cloud Function `generateSignedUploadUrl`.
export default function KycUploader({ docType, onUploadSuccess }: { docType: string, onUploadSuccess: (data: any) => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(formSchema),
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const file = values.file[0];
        if (!file) return;

        setIsLoading(true);
        setUploadProgress(0);

        try {
            // 1. Call your `generateSignedUploadUrl` Cloud Function
            // This is a placeholder for the actual function call.
            console.log("Requesting signed URL for", {
                filename: file.name,
                contentType: file.type,
                docType: docType
            });
            
            // const generateSignedUploadUrl = httpsCallable(functions, 'generateSignedUploadUrl');
            // const result: any = await generateSignedUploadUrl({ ... });
            // const { uploadUrl, storagePath, docId } = result.data;
            
            // --- MOCK RESPONSE FOR DEMO ---
            const mockUploadUrl = "https://mock-upload-url.com/some-signed-path";
            const mockStoragePath = `private/kyc/user-id-placeholder/${file.name}`;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            // --- END MOCK ---
            
            console.log("Received signed URL:", mockUploadUrl);


            // 2. Upload the file to the signed URL using PUT request
            await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('PUT', mockUploadUrl, true);
                xhr.setRequestHeader('Content-Type', file.type);

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = Math.round((event.loaded / event.total) * 100);
                        setUploadProgress(percentComplete);
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`Upload failed with status: ${xhr.status}`));
                    }
                };

                xhr.onerror = () => {
                    reject(new Error('Network error during upload.'));
                };
                
                xhr.send(file);
            });
            
            toast({ title: "Upload Successful", description: `${file.name} has been uploaded.` });
            onUploadSuccess({ storagePath: mockStoragePath });

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
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg">
            <Label htmlFor="file-upload">Upload {docType.replace('_', ' ')}</Label>
            <Input 
                id="file-upload"
                type="file" 
                {...form.register('file')}
                disabled={isLoading}
                className="file:text-primary file:font-semibold"
            />
            {form.formState.errors.file && (
                <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.file.message as string}
                </p>
            )}

            {uploadProgress !== null && <Progress value={uploadProgress} className="h-2" />}

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                {isLoading ? `Uploading... ${uploadProgress || 0}%` : "Upload Document"}
            </Button>
        </form>
    );
}
