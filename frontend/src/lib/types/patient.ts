import type { GeoPoint } from './profile';

export type MatchStatus = "waiting" | "matched" | "in_consult" | "completed";

export interface Patient {
  uid: string;
  location: GeoPoint;
  requestedSpecialty?: string;
  matchStatus: MatchStatus;
  matchedProviderId?: string | null;
}
