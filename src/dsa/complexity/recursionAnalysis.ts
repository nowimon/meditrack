/**
 * MediTrack DSA Lab - Unit 1: Recursion & Recurrence Analysis
 *
 * Demonstrates:
 * 1. Base case termination
 * 2. Call-stack frame allocation and unwinding
 * 3. Linear recurrence T(n) = T(n-1) + O(1) -> O(n) time, O(n) space
 * 4. Divide-and-conquer recurrence T(n) = 2T(n/2) + O(1) -> O(n) time, O(log n) space
 */

import type { AlgorithmResult, AlgorithmStep } from '../types';

export interface RecursiveStackFrame {
  depth: number;
  subproblemSize: number;
  operation: 'CALL' | 'BASE_CASE' | 'RETURN';
  currentValue: number;
  accumulated: number;
}

/**
 * Calculates the total waste weight recursively.
 * Recurrence: T(n) = T(n-1) + O(1)
 * Time Complexity: O(n)
 * Auxiliary Space: O(n) due to recursive call stack frames
 */
export function calculateTotalWasteRecursive(
  weights: number[]
): AlgorithmResult<number, RecursiveStackFrame[]> {
  const startTime = performance.now();
  const steps: AlgorithmStep<RecursiveStackFrame[]>[] = [];
  const activeStack: RecursiveStackFrame[] = [];
  let stepNumber = 0;
  let comparisons = 0;

  function recurse(index: number): number {
    comparisons++;
    const depth = activeStack.length + 1;

    // Base case: beyond array boundary
    if (index >= weights.length) {
      stepNumber++;
      const baseFrame: RecursiveStackFrame = {
        depth,
        subproblemSize: 0,
        operation: 'BASE_CASE',
        currentValue: 0,
        accumulated: 0,
      };
      steps.push({
        stepNumber,
        description: `Base case reached at index ${index} (beyond bounds). Returning 0.`,
        state: [...activeStack, baseFrame],
        highlights: [index],
        comparisons,
      });
      return 0;
    }

    const currentWeight = weights[index];
    const callFrame: RecursiveStackFrame = {
      depth,
      subproblemSize: weights.length - index,
      operation: 'CALL',
      currentValue: currentWeight,
      accumulated: 0,
    };
    activeStack.push(callFrame);
    stepNumber++;
    steps.push({
      stepNumber,
      description: `Push frame depth ${depth}: Processing weight ${currentWeight} kg at index ${index}`,
      state: [...activeStack],
      highlights: [index],
      comparisons,
    });

    // Recursive step
    const subtotal = recurse(index + 1);
    const total = currentWeight + subtotal;

    stepNumber++;
    const returnFrame: RecursiveStackFrame = {
      depth,
      subproblemSize: weights.length - index,
      operation: 'RETURN',
      currentValue: currentWeight,
      accumulated: total,
    };
    activeStack.pop();
    steps.push({
      stepNumber,
      description: `Unwinding stack depth ${depth}: index ${index} (${currentWeight} kg) + subtotal (${subtotal} kg) = ${total} kg`,
      state: [...activeStack, returnFrame],
      highlights: [index],
      comparisons,
    });

    return total;
  }

  const result = recurse(0);
  const endTime = performance.now();

  return {
    result,
    steps,
    totalComparisons: comparisons,
    timeMs: Math.max(0, endTime - startTime),
  };
}
