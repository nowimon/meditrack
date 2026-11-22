/**
 * MediTrack DSA Lab - Algorithm Step & Snapshot Types
 *
 * This file serves as the strict contract between pure DSA implementations
 * and the React visualization layer.
 */

export interface AlgorithmStep<T = unknown> {
  stepNumber: number;
  description: string;
  /**
   * Immutable snapshot of the data structure state at this exact step.
   * NOTE: Algorithms MUST store cloned copies (e.g. [...arr]) so that
   * in-place modifications in subsequent steps do not mutate past snapshots.
   */
  state: T;
  highlights: number[];
  comparisons: number;
  swaps?: number;
  lineReference?: number;
  /** Labeled pointer positions for visualization (e.g. { low: 0, mid: 4, high: 9 } or { pivot: 5 }) */
  auxiliaryPointers?: Record<string, number | null>;
}


export interface AlgorithmResult<T = unknown, S = unknown> {
  result: T;
  steps: AlgorithmStep<S>[];
  totalComparisons: number;
  totalSwaps?: number;
  timeMs: number;
}

export type SortOrder = 'asc' | 'desc';

export type SearchTargetField = 'id' | 'wasteWeightKg' | 'urgencyScore';
