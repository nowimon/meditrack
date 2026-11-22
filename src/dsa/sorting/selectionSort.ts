/**
 * MediTrack DSA Lab - Unit 2: Selection Sort
 *
 * Algorithm Specification:
 * - Divides array into sorted sublist (left) and unsorted sublist (right).
 * - In each pass, finds the minimum element in the unsorted sublist and swaps it
 *   with the leftmost unsorted element.
 * - Key feature: Minimizes memory write operations (at most n-1 swaps).
 * - Unstable sort in array implementation due to long-distance swaps.
 *
 * Complexities:
 * - Best Case Time: O(n^2) [always performs n(n-1)/2 comparisons]
 * - Average Case Time: O(n^2)
 * - Worst Case Time: O(n^2)
 * - Auxiliary Space: O(1) [in-place]
 */

import type { AlgorithmResult, AlgorithmStep } from '../types';

export function selectionSort<T>(
  array: T[],
  keyExtractor: (item: T) => number = (item) => item as unknown as number
): AlgorithmResult<T[], T[]> {
  const startTime = performance.now();
  const arr = [...array];
  const steps: AlgorithmStep<T[]>[] = [];
  let comparisons = 0;
  let swaps = 0;
  let stepNumber = 0;

  stepNumber++;
  steps.push({
    stepNumber,
    description: `Selection Sort initiated on array of length ${arr.length}.`,
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
    let minIdx = i;
    stepNumber++;
    steps.push({
      stepNumber,
      description: `Pass ${i + 1}: Finding minimum element for index ${i}. Initial candidate minIdx=${i} (value: ${keyExtractor(
        arr[i]
      )}).`,
      state: [...arr],
      highlights: [i],
      comparisons,
      swaps,
      auxiliaryPointers: { sortedBoundary: i, minIdx: i, currentScan: null },
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      const currentVal = keyExtractor(arr[j]);
      const minVal = keyExtractor(arr[minIdx]);

      if (currentVal < minVal) {
        minIdx = j;
        stepNumber++;
        steps.push({
          stepNumber,
          description: `New minimum discovered: arr[${j}] (${currentVal}) < previous minimum arr[${minIdx}] (${minVal}). minIdx updated to ${j}.`,
          state: [...arr],
          highlights: [i, j],
          comparisons,
          swaps,
          auxiliaryPointers: { sortedBoundary: i, minIdx: j, currentScan: j },
        });
      } else {
        stepNumber++;
        steps.push({
          stepNumber,
          description: `Compare: arr[${j}] (${currentVal}) >= current minimum (${minVal}). Candidate unchanged.`,
          state: [...arr],
          highlights: [minIdx, j],
          comparisons,
          swaps,
          auxiliaryPointers: { sortedBoundary: i, minIdx, currentScan: j },
        });
      }
    }

    if (minIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
      swaps++;

      stepNumber++;
      steps.push({
        stepNumber,
        description: `Swap: Placed minimum element (${keyExtractor(
          arr[i]
        )}) at target index ${i} by swapping with index ${minIdx} (Swap #${swaps}).`,
        state: [...arr],
        highlights: [i, minIdx],
        comparisons,
        swaps,
        auxiliaryPointers: { sortedBoundary: i + 1, minIdx: null, currentScan: null },
      });
    } else {
      stepNumber++;
      steps.push({
        stepNumber,
        description: `Element at index ${i} (${keyExtractor(
          arr[i]
        )}) is already the minimum. No swap necessary.`,
        state: [...arr],
        highlights: [i],
        comparisons,
        swaps,
        auxiliaryPointers: { sortedBoundary: i + 1, minIdx: null, currentScan: null },
      });
    }
  }

  stepNumber++;
  steps.push({
    stepNumber,
    description: `Selection Sort completed. Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
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
