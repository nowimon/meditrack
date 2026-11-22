/**
 * MediTrack DSA Lab - Unit 2: Merge Sort
 *
 * Algorithm Specification:
 * - Divide-and-Conquer recursive sorting algorithm.
 * - Recursively divides the array into two halves until subarrays of size 1 remain,
 *   then merges sorted halves back together in linear time.
 * - Guarantees O(n log n) worst-case time complexity.
 * - Stable sort: relative order of equal elements is preserved by using `<=` during merge.
 *
 * Complexities:
 * - Best Case Time: O(n log n)
 * - Average Case Time: O(n log n)
 * - Worst Case Time: O(n log n)
 * - Auxiliary Space: O(n) [auxiliary buffer required during merge] + O(log n) call stack
 */

import type { AlgorithmResult, AlgorithmStep } from '../types';

export function mergeSort<T>(
  array: T[],
  keyExtractor: (item: T) => number = (item) => item as unknown as number
): AlgorithmResult<T[], T[]> {
  const startTime = performance.now();
  const arr = [...array];
  const steps: AlgorithmStep<T[]>[] = [];
  let comparisons = 0;
  let elementMovements = 0;
  let stepNumber = 0;

  stepNumber++;
  steps.push({
    stepNumber,
    description: `Merge Sort initiated on array of length ${arr.length}.`,
    state: [...arr],
    highlights: [],
    comparisons: 0,
    swaps: 0,
  });

  if (arr.length <= 1) {
    stepNumber++;
    steps.push({
      stepNumber,
      description: `Array of size ${arr.length} is trivially sorted base case.`,
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

  function merge(left: number, mid: number, right: number) {
    const leftSub = arr.slice(left, mid + 1);
    const rightSub = arr.slice(mid + 1, right + 1);

    stepNumber++;
    steps.push({
      stepNumber,
      description: `Merging subarrays: Left [${left}..${mid}] (${leftSub
        .map(keyExtractor)
        .join(', ')}) with Right [${mid + 1}..${right}] (${rightSub.map(keyExtractor).join(', ')}).`,
      state: [...arr],
      highlights: Array.from({ length: right - left + 1 }, (_, k) => left + k),
      comparisons,
      swaps: elementMovements,
      auxiliaryPointers: { left, mid, right },
    });

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftSub.length && j < rightSub.length) {
      comparisons++;
      const valL = keyExtractor(leftSub[i]);
      const valR = keyExtractor(rightSub[j]);

      // <= ensures stability
      if (valL <= valR) {
        arr[k] = leftSub[i];
        elementMovements++;
        i++;
      } else {
        arr[k] = rightSub[j];
        elementMovements++;
        j++;
      }
      k++;
    }

    while (i < leftSub.length) {
      arr[k] = leftSub[i];
      elementMovements++;
      i++;
      k++;
    }

    while (j < rightSub.length) {
      arr[k] = rightSub[j];
      elementMovements++;
      j++;
      k++;
    }

    stepNumber++;
    steps.push({
      stepNumber,
      description: `Merged result for [${left}..${right}]: (${arr
        .slice(left, right + 1)
        .map(keyExtractor)
        .join(', ')}).`,
      state: [...arr],
      highlights: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
      comparisons,
      swaps: elementMovements,
      auxiliaryPointers: { left, mid, right },
    });
  }

  function divideAndConquer(left: number, right: number) {
    if (left >= right) return;

    const mid = Math.floor(left + (right - left) / 2);

    stepNumber++;
    steps.push({
      stepNumber,
      description: `Divide: Splitting range [${left}..${right}] into [${left}..${mid}] and [${
        mid + 1
      }..${right}].`,
      state: [...arr],
      highlights: [mid],
      comparisons,
      swaps: elementMovements,
      auxiliaryPointers: { left, mid, right },
    });

    divideAndConquer(left, mid);
    divideAndConquer(mid + 1, right);
    merge(left, mid, right);
  }

  divideAndConquer(0, arr.length - 1);

  stepNumber++;
  steps.push({
    stepNumber,
    description: `Merge Sort completed. Total comparisons: ${comparisons}, Total element placements: ${elementMovements}.`,
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
