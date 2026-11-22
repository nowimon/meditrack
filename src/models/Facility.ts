/**
 * Facility Model - Hospitals, Clinics, and Treatment Centers in the Medical Network
 */

export type FacilityType = 'HOSPITAL' | 'DIAGNOSTIC_LAB' | 'PRIMARY_CLINIC' | 'TREATMENT_PLANT' | 'CENTRAL_STORAGE';

export interface Facility {
  id: number;              // Numeric ID for BST and Graph adjacency matrix indexing (e.g. 1..10)
  code: string;            // Human-readable code, e.g. "HOSP-01", "PLANT-A"
  name: string;            // E.g. "Apex Memorial Hospital", "North Biohazard Plant"
  type: FacilityType;
  zone: string;            // Sector or geographic zone
  wasteOutputAvgKg: number;// Average daily waste generation
  storageCapacityKg: number;
  contactPerson: string;
  isTreatmentPlant?: boolean;
}
