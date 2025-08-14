
import type { FieldValue } from 'firebase/firestore';

export type ConsultationStatus = 'pending' | 'active' | 'ended';

export interface RTCSessionDescription {
  type: 'offer' | 'answer';
  sdp: string;
}

export interface RTCIceCandidate {
  candidate: string;
  sdpMid: string | null;
  sdpMLineIndex: number | null;
}

export interface Consultation {
  id: string;
  patientId: string;
  providerId: string;
  status: ConsultationStatus;
  createdAt: FieldValue;
  offer?: RTCSessionDescription;
  answer?: RTCSessionDescription;
  iceCandidates?: RTCIceCandidate[];
}

export interface ChatMessage {
  id?: string;
  senderId: string;
  message: string;
  timestamp: FieldValue;
}
