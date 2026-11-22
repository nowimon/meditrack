/**
 * MediTrack DSA Lab - Unit 2: Linear Search
 *
 * Algorithm Specification:
 * - Scans sequentially from index 0 to n-1.
 * - Does NOT require array to be sorted.
 * - Deterministic duplicate handling: returns the FIRST occurrence (lowest index).
 *
 * Complexities:
 * - Best Case: O(1) [target located at index 0]
 * - Average Case: O(n) [(n + 1) / 2 comparisons]
 * - Worst Case: O(n) [target at last index or absent]
 * - Auxiliary Space: O(1) [no extra buffers allocated]
 */

import type { AlgorithmResult, AlgorithmStep } from '../types';

export interface SearchOutcome {
  foundIndex: number; // -1 if not found
  isFound: boolean;
  totalComparisons: number;
}

/**
 * Searches for target in array using Linear Search.
 *
 * @param array Array of items to search through
 * @param target Value to search for
 * @param keyExtractor Optional selector function when searching object records (e.g. item => item.id)
 */
export function linearSearch<T>(
  array: T[],
  target: number | string,
  keyExtractor: (item: T) => number | string = (item) => item as unknown as number | string
): AlgorithmResult<SearchOutcome, T[]> {
  const startTime = performance.now();
  const steps: AlgorithmStep<T[]>[] = [];
  let comparisons = 0;
  let stepNumber = 0;

  // Initial step
  stepNumber++;
  steps.push({
    stepNumber,
    description: `Linear Search initiated for target '${target}'. Array length: ${array.length}.`,
    state: [...array],
    highlights: [],
    comparisons: 0,
    auxiliaryPointers: { currentIndex: null },
  });

  // Empty array handling
  if (array.length === 0) {
    stepNumber++;
    steps.push({
      stepNumber,
      description: `Array is empty. Target '${target}' not found.`,
      state: [],
      highlights: [],
      comparisons: 0,
      auxiliaryPointers: { currentIndex: null },
    });

    const endTime = performance.now();
    return {
      result: {
        foundIndex: -1,
        isFound: false,
        totalComparisons: 0,
      },
      steps,
      totalComparisons: 0,
      timeMs: Math.max(0, endTime - startTime),
    };
  }

  for (let i = 0; i < array.length; i++) {
    comparisons++;
    const currentVal = keyExtractor(array[i]);
    stepNumber++;

    if (currentVal === target) {
      steps.push({
        stepNumber,
        description: `Match found at index ${i}: '${currentVal}' === '${target}' (Comparison #${comparisons}).`,
        state: [...array],
        highlights: [i],
        comparisons,
        auxiliaryPointers: { currentIndex: i },
      });

      const endTime = performance.now();
      return {
        result: {
          foundIndex: i,
          isFound: true,
          totalComparisons: comparisons,
        },
        steps,
        totalComparisons: comparisons,
        timeMs: Math.max(0, endTime - startTime),
      };
    } else {
      steps.push({
        stepNumber,
        description: `Index ${i}: '${currentVal}' !== target '${target}' (Comparison #${comparisons}). Continuing scan.`,
        state: [...array],
        highlights: [i],
        comparisons,
        auxiliaryPointers: { currentIndex: i },
      });
    }
  }

  // Not found
  stepNumber++;
  steps.push({
    stepNumber,
    description: `Scanned all ${array.length} elements. Target '${target}' not present in array.`,
    state: [...array],
    highlights: [],
    comparisons,
    auxiliaryPointers: { currentIndex: null },
  });

  const endTime = performance.now();
  return {
    result: {
      foundIndex: -1,
      isFound: false,
      totalComparisons: comparisons,
    },
    steps,
    totalComparisons: comparisons,
    timeMs: Math.max(0, endTime - startTime),
  };
}
