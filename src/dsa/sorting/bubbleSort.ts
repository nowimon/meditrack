/**
 * MediTrack DSA Lab - Unit 2: Bubble Sort
 *
 * Algorithm Specification:
 * - Repeatedly steps through the list, compares adjacent elements and swaps them
 *   if they are in the wrong order.
 * - Optimized with an early-exit flag `swapped`: if no swaps occur in a full pass,
 *   the algorithm terminates early.
 * - Stable sort: relative order of equal elements is preserved.
 *
 * Complexities:
 * - Best Case Time: O(n) [already sorted, 1 pass with 0 swaps]
 * - Average Case Time: O(n^2)
 * - Worst Case Time: O(n^2) [reverse sorted, n(n-1)/2 comparisons and swaps]
 * - Auxiliary Space: O(1) [in-place]
 */

import type { AlgorithmResult, AlgorithmStep } from '../types';

export function bubbleSort<T>(
  array: T[],
  keyExtractor: (item: T) => number = (item) => item as unknown as number
): AlgorithmResult<T[], T[]> {
  const startTime = performance.now();
  const arr = [...array]; // Work on a clone so input is not mutated
  const steps: AlgorithmStep<T[]>[] = [];
  let comparisons = 0;
  let swaps = 0;
  let stepNumber = 0;

  stepNumber++;
  steps.push({
    stepNumber,
    description: `Bubble Sort initiated on array of length ${arr.length}.`,
    state: [...arr],
    highlights: [],
    comparisons: 0,
    swaps: 0,
  });

  const n = arr.length;
  if (n <= 1) {
    stepNumber++;
    steps.push({
      stepNumber,
      description: `Array of size ${n} is trivially sorted.`,
      state: [...arr],
      highlights: [],
      comparisons: 0,
      swaps: 0,
    });
    const endTime = performance.now();
    return {
      result: arr,
      steps,
      totalComparisons: 0,
      totalSwaps: 0,
      timeMs: Math.max(0, endTime - startTime),
    };
  }

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    stepNumber++;
    steps.push({
      stepNumber,
      description: `Starting Pass ${i + 1} of ${n - 1}. Elements from index ${n - i} onward are already in sorted position.`,
      state: [...arr],
      highlights: [],
      comparisons,
      swaps,
      auxiliaryPointers: { pass: i, unsortedBoundary: n - i - 1 },
    });

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      const valA = keyExtractor(arr[j]);
      const valB = keyExtractor(arr[j + 1]);

      if (valA > valB) {
        // Swap adjacent elements
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swaps++;
        swapped = true;

        stepNumber++;
        steps.push({
          stepNumber,
          description: `Swap: arr[${j}] (${valA}) > arr[${j + 1}] (${valB}). Swapping elements (Swap #${swaps}).`,
          state: [...arr], // Snapshot after swap
          highlights: [j, j + 1],
          comparisons,
          swaps,
          auxiliaryPointers: { j, next: j + 1 },
        });
      } else {
        stepNumber++;
        steps.push({
          stepNumber,
          description: `Compare: arr[${j}] (${valA}) <= arr[${j + 1}] (${valB}). Order valid, no swap needed.`,
          state: [...arr],
          highlights: [j, j + 1],
          comparisons,
          swaps,
          auxiliaryPointers: { j, next: j + 1 },
        });
      }
    }

    // Early termination check: if no swaps in inner pass, array is sorted
    if (!swapped) {
      stepNumber++;
      steps.push({
        stepNumber,
        description: `Early Exit Optimization: No swaps occurred in Pass ${i + 1}. Array is fully sorted (Best Case O(n)).`,
        state: [...arr],
        highlights: [],
        comparisons,
        swaps,
      });
      break;
    }
  }

  stepNumber++;
  steps.push({
    stepNumber,
    description: `Bubble Sort finished. Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
    state: [...arr],
    highlights: [],
    comparisons,
    swaps,
  });

  const endTime = performance.now();
  return {
    result: arr,
    steps,
    totalComparisons: comparisons,
    totalSwaps: swaps,
    timeMs: Math.max(0, endTime - startTime),
  };
}
