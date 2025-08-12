
"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// This is a scaffold. You'll need to fetch user KYC docs and implement the logic.
// const { docs, loading } = useUserKycDocs(userId);

export default function KycReviewModal({ isOpen, onOpenChange, userId }: { isOpen: boolean, onOpenChange: (open: boolean) => void, userId: string }) {

    const handleVerify = async (action: 'approve' | 'reject') => {
        console.log(`Verifying user ${userId} with action: ${action}`);
        // Implement the call to the 'verifyProvider' Cloud Function here.
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Review KYC Documents for User</DialogTitle>
                    <DialogDescription>
                        User ID: {userId}. Review the uploaded documents and OCR data, then approve or reject the verification.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <p className="text-sm text-center text-muted-foreground">
                        (KYC Document list, previews, and OCR results will be displayed here)
                    </p>
                    {/* 
                        - Fetch kyc_docs for the user.
                        - For each doc, display its type and a button to get a signed download URL.
                        - Fetch and display OCR results from kyc_ocr/{docId}.
                    */}
                </div>

                <DialogFooter>
                    <Button variant="destructive" onClick={() => handleVerify('reject')}>
                        Reject
                    </Button>
                    <Button onClick={() => handleVerify('approve')}>
                        Approve
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
