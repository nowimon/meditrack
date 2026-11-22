/**
 * MediTrack DSA Lab - Unit 2: Binary Search
 *
 * Algorithm Specification:
 * - Divide-and-Conquer search dividing search interval in half at each iteration.
 * - MANDATORY PRECONDITION: The array MUST be sorted in ascending order.
 * - Deterministic duplicate handling: Returns the FIRST occurrence (lowest index)
 *   by continuing the search into the left sub-array when a match is found.
 *
 * Complexities:
 * - Best Case: O(1) [target located at the initial midpoint]
 * - Average Case: O(log n)
 * - Worst Case: O(log n) [target absent or at extremity]
 * - Auxiliary Space: O(1) [iterative implementation with pointers]
 */

import type { AlgorithmResult, AlgorithmStep } from '../types';

export interface BinarySearchOutcome {
  foundIndex: number;
  isFound: boolean;
  totalComparisons: number;
  sortedPreconditionViolated: boolean;
  violationMessage?: string;
}

/**
 * Checks whether an array is strictly sorted in non-decreasing order.
 */
export function isSortedAscending<T>(
  array: T[],
  keyExtractor: (item: T) => number | string
): { isSorted: boolean; violationIndex?: number } {
  for (let i = 0; i < array.length - 1; i++) {
    if (keyExtractor(array[i]) > keyExtractor(array[i + 1])) {
      return { isSorted: false, violationIndex: i };
    }
  }
  return { isSorted: true };
}

/**
 * Executes Binary Search on a sorted array.
 *
 * @param array Sorted array of items
 * @param target Search target value
 * @param keyExtractor Selector function for keys
 */
export function binarySearch<T>(
  array: T[],
  target: number | string,
  keyExtractor: (item: T) => number | string = (item) => item as unknown as number | string
): AlgorithmResult<BinarySearchOutcome, T[]> {
  const startTime = performance.now();
  const steps: AlgorithmStep<T[]>[] = [];
  let comparisons = 0;
  let stepNumber = 0;

  // Initial step
  stepNumber++;
  steps.push({
    stepNumber,
    description: `Binary Search initiated for target '${target}'. Array length: ${array.length}.`,
    state: [...array],
    highlights: [],
    comparisons: 0,
    auxiliaryPointers: { low: null, mid: null, high: null },
  });

  // Empty array handling
  if (array.length === 0) {
    stepNumber++;
    steps.push({
      stepNumber,
      description: `Array is empty. Binary Search terminated immediately.`,
      state: [],
      highlights: [],
      comparisons: 0,
      auxiliaryPointers: { low: null, mid: null, high: null },
    });

    const endTime = performance.now();
    return {
      result: {
        foundIndex: -1,
        isFound: false,
        totalComparisons: 0,
        sortedPreconditionViolated: false,
      },
      steps,
      totalComparisons: 0,
      timeMs: Math.max(0, endTime - startTime),
    };
  }

  // Mandatory Precondition Check: Array must be sorted
  const sortedCheck = isSortedAscending(array, keyExtractor);
  if (!sortedCheck.isSorted) {
    const vIdx = sortedCheck.violationIndex ?? 0;
    const msg = `Precondition Failed: Array is not sorted! Element at index ${vIdx} (${keyExtractor(
      array[vIdx]
    )}) > element at index ${vIdx + 1} (${keyExtractor(array[vIdx + 1])}).`;

    stepNumber++;
    steps.push({
      stepNumber,
      description: msg,
      state: [...array],
      highlights: [vIdx, vIdx + 1],
      comparisons: 0,
      auxiliaryPointers: { low: null, mid: null, high: null },
    });

    const endTime = performance.now();
    return {
      result: {
        foundIndex: -1,
        isFound: false,
        totalComparisons: 0,
        sortedPreconditionViolated: true,
        violationMessage: msg,
      },
      steps,
      totalComparisons: 0,
      timeMs: Math.max(0, endTime - startTime),
    };
  }

  let low = 0;
  let high = array.length - 1;
  let firstFoundIndex = -1;

  while (low <= high) {
    // Avoid integer overflow using floor(low + (high - low) / 2)
    const mid = Math.floor(low + (high - low) / 2);
    const midVal = keyExtractor(array[mid]);
    comparisons++;
    stepNumber++;

    steps.push({
      stepNumber,
      description: `Interval [${low}..${high}], Midpoint mid=${mid} (value: '${midVal}'). Comparing with target '${target}'.`,
      state: [...array],
      highlights: [mid],
      comparisons,
      auxiliaryPointers: { low, mid, high },
    });

    if (midVal === target) {
      firstFoundIndex = mid;
      stepNumber++;
      steps.push({
        stepNumber,
        description: `Target match found at index ${mid}. Checking left interval [${low}..${mid - 1}] to guarantee first occurrence.`,
        state: [...array],
        highlights: [mid],
        comparisons,
        auxiliaryPointers: { low, mid, high: mid - 1 },
      });
      // Continue left to find first occurrence
      high = mid - 1;
    } else if (midVal < target) {
      stepNumber++;
      steps.push({
        stepNumber,
        description: `'${midVal}' < target '${target}'. Target must reside in right half. Adjusting low = ${mid + 1}.`,
        state: [...array],
        highlights: [mid],
        comparisons,
        auxiliaryPointers: { low: mid + 1, mid, high },
      });
      low = mid + 1;
    } else {
      stepNumber++;
      steps.push({
        stepNumber,
        description: `'${midVal}' > target '${target}'. Target must reside in left half. Adjusting high = ${mid - 1}.`,
        state: [...array],
        highlights: [mid],
        comparisons,
        auxiliaryPointers: { low, mid, high: mid - 1 },
      });
      high = mid - 1;
    }
  }

  const isFound = firstFoundIndex !== -1;
  stepNumber++;
  steps.push({
    stepNumber,
    description: isFound
      ? `Search complete: First occurrence of '${target}' confirmed at index ${firstFoundIndex}.`
      : `Search complete: Interval collapsed (low > high). Target '${target}' not present in array.`,
    state: [...array],
    highlights: isFound ? [firstFoundIndex] : [],
    comparisons,
    auxiliaryPointers: { low, mid: null, high },
  });

  const endTime = performance.now();
  return {
    result: {
      foundIndex: firstFoundIndex,
      isFound,
      totalComparisons: comparisons,
      sortedPreconditionViolated: false,
    },
    steps,
    totalComparisons: comparisons,
    timeMs: Math.max(0, endTime - startTime),
  };
}
