/**
 * MediTrack DSA Lab - Unit 2: Insertion Sort
 *
 * Algorithm Specification:
 * - Builds sorted array one element at a time by repeatedly taking the next element
 *   and sliding it into its correct relative position within the sorted subarray.
 * - Adaptive: highly efficient on small arrays and nearly-sorted datasets.
 * - Stable sort: preserved order for duplicate keys.
 *
 * Complexities:
 * - Best Case Time: O(n) [already sorted, 1 comparison per element, 0 shifts]
 * - Average Case Time: O(n^2) [n(n-1)/4 comparisons and shifts]
 * - Worst Case Time: O(n^2) [reverse sorted, maximum shifts]
 * - Auxiliary Space: O(1) [in-place]
 */

import type { AlgorithmResult, AlgorithmStep } from '../types';

export function insertionSort<T>(
  array: T[],
  keyExtractor: (item: T) => number = (item) => item as unknown as number
): AlgorithmResult<T[], T[]> {
  const startTime = performance.now();
  const arr = [...array];
  const steps: AlgorithmStep<T[]>[] = [];
  let comparisons = 0;
  let elementMovements = 0; // Shifts + insertions
  let stepNumber = 0;

  stepNumber++;
  steps.push({
    stepNumber,
    description: `Insertion Sort initiated on array of length ${arr.length}.`,
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

  for (let i = 1; i < n; i++) {
    const currentItem = arr[i];
    const currentVal = keyExtractor(currentItem);
    let j = i - 1;

    stepNumber++;
    steps.push({
      stepNumber,
      description: `Step ${i}: Selected key element arr[${i}] (${currentVal}). Inserting into sorted subarray [0..${i - 1}].`,
      state: [...arr],
      highlights: [i],
      comparisons,
      swaps: elementMovements,
      auxiliaryPointers: { keyIndex: i, scanIndex: j },
    });

    let inserted = false;
    while (j >= 0) {
      comparisons++;
      const compareVal = keyExtractor(arr[j]);

      if (compareVal > currentVal) {
        // Shift larger element to the right
        arr[j + 1] = arr[j];
        elementMovements++;

        stepNumber++;
        steps.push({
          stepNumber,
          description: `Shift: arr[${j}] (${compareVal}) > key (${currentVal}). Shifted ${compareVal} to index ${j + 1}.`,
          state: [...arr],
          highlights: [j, j + 1],
          comparisons,
          swaps: elementMovements,
          auxiliaryPointers: { keyIndex: i, scanIndex: j },
        });

        j--;
      } else {
        stepNumber++;
        steps.push({
          stepNumber,
          description: `Compare: arr[${j}] (${compareVal}) <= key (${currentVal}). Insertion position found at index ${j + 1}.`,
          state: [...arr],
          highlights: [j],
          comparisons,
          swaps: elementMovements,
          auxiliaryPointers: { keyIndex: i, scanIndex: j },
        });
        inserted = true;
        break;
      }
    }

    arr[j + 1] = currentItem;
    if (!inserted) {
      elementMovements++;
    }

    stepNumber++;
    steps.push({
      stepNumber,
      description: `Inserted key (${currentVal}) into final position at index ${j + 1}. Subarray [0..${i}] is now sorted.`,
      state: [...arr],
      highlights: [j + 1],
      comparisons,
      swaps: elementMovements,
      auxiliaryPointers: { sortedBoundary: i, keyFinalIndex: j + 1 },
    });
  }

  stepNumber++;
  steps.push({
    stepNumber,
    description: `Insertion Sort completed. Total comparisons: ${comparisons}, Total shifts/movements: ${elementMovements}.`,
    state: [...arr],
    highlights: [],
    comparisons,
    swaps: elementMovements,
  });

  const endTime = performance.now();
  return {
    result: arr,
    steps,
    totalComparisons: comparisons,
    totalSwaps: elementMovements,
    timeMs: Math.max(0, endTime - startTime),
  };
}
