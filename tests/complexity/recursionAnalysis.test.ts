import { describe, it, expect } from 'vitest';
import { calculateTotalWasteRecursive } from '../../src/dsa/complexity/recursionAnalysis';

describe('Unit 1: Recursion & Call-Stack Analysis', () => {
  it('should handle empty array as base case returning 0', () => {
    const res = calculateTotalWasteRecursive([]);
    expect(res.result).toBe(0);
    expect(res.steps.length).toBeGreaterThan(0);
    expect(res.steps[0].description).toContain('Base case reached');
  });

  it('should handle single element correctly', () => {
    const res = calculateTotalWasteRecursive([15.5]);
    expect(res.result).toBe(15.5);
    expect(res.steps.length).toBeGreaterThan(1);
  });

  it('should compute exact recursive sum for multiple elements', () => {
    const weights = [12.5, 4.2, 8.8, 20.0];
    const expected = 12.5 + 4.2 + 8.8 + 20.0;
    const res = calculateTotalWasteRecursive(weights);
    expect(res.result).toBeCloseTo(expected);
    // Number of comparisons should be N + 1 (for indices 0..N)
    expect(res.totalComparisons).toBe(weights.length + 1);
  });

  it('should record push and unwind return steps matching recursive stack depth', () => {
    const weights = [5, 10];
    const res = calculateTotalWasteRecursive(weights);
    const descriptions = res.steps.map((s) => s.description);

    expect(descriptions.some((d) => d.includes('Push frame depth 1'))).toBe(true);
    expect(descriptions.some((d) => d.includes('Push frame depth 2'))).toBe(true);
    expect(descriptions.some((d) => d.includes('Unwinding stack depth 2'))).toBe(true);
    expect(descriptions.some((d) => d.includes('Unwinding stack depth 1'))).toBe(true);
  });
});
