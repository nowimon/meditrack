import { describe, it, expect } from 'vitest';
import { WASTE_CATEGORIES } from '../src/models/WasteCategory';
import type { AlgorithmStep, AlgorithmResult } from '../src/dsa/types';

describe('Phase 0 Verification & Smoke Test', () => {
  it('should have all 4 biomedical waste categories defined correctly', () => {
    expect(Object.keys(WASTE_CATEGORIES)).toHaveLength(4);
    expect(WASTE_CATEGORIES.YELLOW.urgencyWeight).toBe(4);
    expect(WASTE_CATEGORIES.RED.urgencyWeight).toBe(3);
    expect(WASTE_CATEGORIES.WHITE.urgencyWeight).toBe(2);
    expect(WASTE_CATEGORIES.BLUE.urgencyWeight).toBe(1);
  });

  it('should correctly conform to AlgorithmStep contract', () => {
    const sampleStep: AlgorithmStep<number[]> = {
      stepNumber: 1,
      description: 'Initial state of array buffer',
      state: [10, 20, 30],
      highlights: [0],
      comparisons: 0,
      swaps: 0,
    };

    expect(sampleStep.stepNumber).toBe(1);
    expect(sampleStep.state).toEqual([10, 20, 30]);
  });

  it('should correctly conform to AlgorithmResult contract', () => {
    const sampleResult: AlgorithmResult<number, number[]> = {
      result: 42,
      steps: [
        {
          stepNumber: 1,
          description: 'Step 1',
          state: [42],
          highlights: [0],
          comparisons: 1,
        },
      ],
      totalComparisons: 1,
      totalSwaps: 0,
      timeMs: 0.12,
    };

    expect(sampleResult.result).toBe(42);
    expect(sampleResult.steps).toHaveLength(1);
    expect(sampleResult.totalComparisons).toBe(1);
  });
});
