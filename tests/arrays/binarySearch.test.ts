import { describe, it, expect } from 'vitest';
import { binarySearch } from '../../src/dsa/arrays/binarySearch';

describe('Unit 2: Binary Search', () => {
  it('should handle empty arrays without error', () => {
    const res = binarySearch([], 50);
    expect(res.result.isFound).toBe(false);
    expect(res.result.foundIndex).toBe(-1);
    expect(res.result.sortedPreconditionViolated).toBe(false);
    expect(res.totalComparisons).toBe(0);
  });

  it('should strictly detect and reject unsorted input arrays', () => {
    const unsorted = [10, 50, 20, 80, 40];
    const res = binarySearch(unsorted, 20);
    expect(res.result.sortedPreconditionViolated).toBe(true);
    expect(res.result.isFound).toBe(false);
    expect(res.result.violationMessage).toContain('Precondition Failed: Array is not sorted');
    // Steps should document the violation
    expect(res.steps.some((s) => s.description.includes('Precondition Failed'))).toBe(true);
  });

  it('should find element in single-element sorted array', () => {
    const resFound = binarySearch([100], 100);
    expect(resFound.result.isFound).toBe(true);
    expect(resFound.result.foundIndex).toBe(0);

    const resNotFound = binarySearch([100], 50);
    expect(resNotFound.result.isFound).toBe(false);
    expect(resNotFound.result.foundIndex).toBe(-1);
  });

  it('should find targets at extremes (index 0, middle, and last index)', () => {
    const sorted = [10, 20, 30, 40, 50, 60, 70];

    const first = binarySearch(sorted, 10);
    expect(first.result.isFound).toBe(true);
    expect(first.result.foundIndex).toBe(0);

    const mid = binarySearch(sorted, 40);
    expect(mid.result.isFound).toBe(true);
    expect(mid.result.foundIndex).toBe(3);

    const last = binarySearch(sorted, 70);
    expect(last.result.isFound).toBe(true);
    expect(last.result.foundIndex).toBe(6);
  });

  it('should return -1 when target is missing (less than min, inside range, greater than max)', () => {
    const sorted = [10, 20, 30, 40, 50];

    // Less than min
    const resUnder = binarySearch(sorted, 5);
    expect(resUnder.result.isFound).toBe(false);
    expect(resUnder.result.foundIndex).toBe(-1);

    // Between elements
    const resBetween = binarySearch(sorted, 25);
    expect(resBetween.result.isFound).toBe(false);
    expect(resBetween.result.foundIndex).toBe(-1);

    // Greater than max
    const resOver = binarySearch(sorted, 999);
    expect(resOver.result.isFound).toBe(false);
    expect(resOver.result.foundIndex).toBe(-1);
  });

  it('should return predictable FIRST occurrence when duplicates exist', () => {
    // Indices:      0   1   2   3   4   5   6   7
    const sorted = [10, 20, 20, 20, 30, 40, 40, 50];
    const res = binarySearch(sorted, 20);

    // Must return index 1, which is the first occurrence of 20
    expect(res.result.isFound).toBe(true);
    expect(res.result.foundIndex).toBe(1);

    const res40 = binarySearch(sorted, 40);
    // Must return index 5, which is the first occurrence of 40
    expect(res40.result.isFound).toBe(true);
    expect(res40.result.foundIndex).toBe(5);
  });

  it('should handle sorted arrays with negative numbers', () => {
    const sorted = [-50, -25, -10, 0, 15, 30];
    const resNeg = binarySearch(sorted, -25);
    expect(resNeg.result.isFound).toBe(true);
    expect(resNeg.result.foundIndex).toBe(1);

    const resZero = binarySearch(sorted, 0);
    expect(resZero.result.isFound).toBe(true);
    expect(resZero.result.foundIndex).toBe(3);
  });

  it('should search object records using keyExtractor', () => {
    const sortedRecords = [
      { id: 10, weightKg: 2.5 },
      { id: 25, weightKg: 8.0 },
      { id: 40, weightKg: 15.2 },
      { id: 60, weightKg: 25.0 },
    ];

    const res = binarySearch(sortedRecords, 40, (r) => r.id);
    expect(res.result.isFound).toBe(true);
    expect(res.result.foundIndex).toBe(2);

    const resMissing = binarySearch(sortedRecords, 30, (r) => r.id);
    expect(resMissing.result.isFound).toBe(false);
  });

  it('should record auxiliary pointers (low, mid, high) in steps', () => {
    const sorted = [10, 20, 30, 40, 50];
    const res = binarySearch(sorted, 30);
    const midSteps = res.steps.filter((s) => s.auxiliaryPointers?.mid !== null);

    expect(midSteps.length).toBeGreaterThan(0);
    expect(midSteps[0].auxiliaryPointers?.low).toBe(0);
    expect(midSteps[0].auxiliaryPointers?.high).toBe(4);
    expect(midSteps[0].auxiliaryPointers?.mid).toBe(2);
  });
});
