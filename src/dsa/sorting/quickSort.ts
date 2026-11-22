/**
 * MediTrack DSA Lab - Unit 2: Quick Sort
 *
 * Algorithm Specification:
 * - Divide-and-Conquer in-place recursive sorting algorithm.
 * - Uses the Lomuto Partition Scheme (last element chosen as pivot).
 * - Partitions the array so that elements <= pivot are placed to the left,
 *   and elements > pivot are placed to the right.
 * - Unstable sort in array implementation due to partition swaps.
 *
 * Complexities:
 * - Best Case Time: O(n log n) [balanced half partitions at each level]
 * - Average Case Time: O(n log n)
 * - Worst Case Time: O(n^2) [repeatedly unbalanced partitions, e.g. already sorted array]
 * - Auxiliary Space: O(log n) average call-stack depth, O(n) worst-case call stack
 */

import type { AlgorithmResult, AlgorithmStep } from '../types';

export function quickSort<T>(
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
    description: `Quick Sort initiated on array of length ${arr.length} (Lomuto Partition).`,
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

  function partition(low: number, high: number): number {
    const pivotVal = keyExtractor(arr[high]);
    let i = low - 1; // Index of smaller element

    stepNumber++;
    steps.push({
      stepNumber,
      description: `Partition range [${low}..${high}]: Selected pivot arr[${high}] = ${pivotVal}.`,
      state: [...arr],
      highlights: [high],
      comparisons,
      swaps,
      auxiliaryPointers: { low, high, pivotIndex: high, partitionBoundary: i },
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      const currentVal = keyExtractor(arr[j]);

      if (currentVal <= pivotVal) {
        i++;
        // Swap arr[i] and arr[j]
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        swaps++;

        stepNumber++;
        steps.push({
          stepNumber,
          description: `arr[${j}] (${currentVal}) <= pivot (${pivotVal}). Increment boundary to ${i} and swap with arr[${j}] (Swap #${swaps}).`,
          state: [...arr],
          highlights: [i, j, high],
          comparisons,
          swaps,
          auxiliaryPointers: { low, high, pivotIndex: high, partitionBoundary: i },
        });
      } else {
        stepNumber++;
        steps.push({
          stepNumber,
          description: `arr[${j}] (${currentVal}) > pivot (${pivotVal}). Element remains in right partition.`,
          state: [...arr],
          highlights: [j, high],
          comparisons,
          swaps,
          auxiliaryPointers: { low, high, pivotIndex: high, partitionBoundary: i },
        });
      }
    }

    // Place pivot in its correct position by swapping with arr[i + 1]
    const pivotFinalIndex = i + 1;
    const temp = arr[pivotFinalIndex];
    arr[pivotFinalIndex] = arr[high];
    arr[high] = temp;
    swaps++;

    stepNumber++;
    steps.push({
      stepNumber,
      description: `Pivot (${pivotVal}) placed into sorted position at index ${pivotFinalIndex} (Swap #${swaps}). Elements left are <= ${pivotVal}, elements right are > ${pivotVal}.`,
      state: [...arr],
      highlights: [pivotFinalIndex],
      comparisons,
      swaps,
      auxiliaryPointers: { low, high, pivotIndex: pivotFinalIndex, partitionBoundary: i },
    });

    return pivotFinalIndex;
  }

  function recurseQuickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      recurseQuickSort(low, pi - 1);
      recurseQuickSort(pi + 1, high);
    }
  }

  recurseQuickSort(0, arr.length - 1);

  stepNumber++;
  steps.push({
    stepNumber,
    description: `Quick Sort completed. Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
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
