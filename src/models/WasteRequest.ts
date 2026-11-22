import type { WasteColorCode } from './WasteCategory';

export type RequestStatus = 'PENDING' | 'SCHEDULED' | 'IN_TRANSIT' | 'COLLECTED' | 'PROCESSED' | 'CANCELLED';

export interface WasteRequest {
  id: number;                // Unique request ID (used for sorting and binary/linear search)
  facilityId: number;        // Foreign key to Facility
  facilityName: string;      // Cached display name
  wardOrDepartment: string;  // E.g. "ICU Ward B", "Pathology Lab 3"
  wasteCategory: WasteColorCode;
  wasteWeightKg: number;     // Weight in kilograms
  urgencyScore: number;      // Calculated priority score (e.g., 1..100)
  createdAt: string;         // ISO date string
  status: RequestStatus;
  hazardNote?: string;       // E.g. "Cytotoxic drugs", "Sharps container sealed"
}
