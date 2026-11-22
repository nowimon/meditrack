/**
 * MediTrack DSA Lab - Synthetic Data Generator
 *
 * Provides deterministic generation of medical-waste collection requests
 * for reproducible searching, sorting, and empirical benchmarking.
 */

import type { WasteRequest } from '../models/WasteRequest';
import type { WasteColorCode } from '../models/WasteCategory';

const HOSPITAL_NAMES = [
  'Apex Memorial Hospital',
  'City Care Diagnostic Center',
  'LifeSpring Children Clinic',
  'St. Jude Research Hospital',
  'Metro Trauma & Orthopedic Center',
  'Green Valley Health Center',
];

const WARDS = [
  'ICU Ward A',
  'Pathology Lab 2',
  'Operation Theater 4',
  'Emergency Casualty',
  'Dialysis Unit',
  'Biochemistry Lab',
  'Chemotherapy Ward',
  'General Surgery Ward',
];

const CATEGORIES: WasteColorCode[] = ['YELLOW', 'RED', 'WHITE', 'BLUE'];

/**
 * Linear Congruential Generator (LCG) for deterministic pseudo-random numbers.
 * Guarantees identical dataset output across runs when given the same seed.
 */
class LCG {
  private state: number;

  constructor(seed = 42) {
    // Normalize seed to an unsigned 32-bit integer, defaulting to 42 if seed resolves to 0
    const normalized = Math.floor(Math.abs(seed));
    this.state = normalized === 0 ? 42 : normalized % 4294967296;
  }

  next(): number {
    this.state = (this.state * 1664525 + 1013904223) % 4294967296;
    if (this.state < 0) {
      this.state += 4294967296;
    }
    return this.state / 4294967296;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(min + this.next() * (max - min + 1));
  }

  nextFloat(min: number, max: number, decimals = 1): number {
    const val = min + this.next() * (max - min);
    return parseFloat(val.toFixed(decimals));
  }
}

/**
 * Fixed epoch anchor for deterministic timestamp generation.
 * Using a constant instead of Date.now() ensures createdAt values
 * are identical across every call with the same seed and count.
 */
const BASE_EPOCH_MS = new Date('2026-01-01T00:00:00.000Z').getTime();

/**
 * Generates an array of synthetic medical-waste requests.
 *
 * @param count Number of requests to generate
 * @param seed Optional seed for deterministic reproducibility (default: 42)
 */
export function generateSampleWasteRequests(count = 50, seed = 42): WasteRequest[] {
  const rng = new LCG(seed);
  const requests: WasteRequest[] = [];

  for (let i = 1; i <= count; i++) {
    const facilityIdx = rng.nextInt(0, HOSPITAL_NAMES.length - 1);
    const wardIdx = rng.nextInt(0, WARDS.length - 1);
    const category = CATEGORIES[rng.nextInt(0, CATEGORIES.length - 1)];
    const weightKg = rng.nextFloat(0.5, 45.0, 1);
    const urgencyScore = rng.nextInt(1, 100);

    requests.push({
      id: i,
      facilityId: facilityIdx + 1,
      facilityName: HOSPITAL_NAMES[facilityIdx],
      wardOrDepartment: WARDS[wardIdx],
      wasteCategory: category,
      wasteWeightKg: weightKg,
      urgencyScore,
      createdAt: new Date(BASE_EPOCH_MS + i * 600000).toISOString(),
      status: 'PENDING',
    });
  }

  return requests;
}
