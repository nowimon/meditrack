import { describe, it, expect } from 'vitest';
import { linearSearch } from '../../src/dsa/arrays/linearSearch';

describe('Unit 2: Linear Search', () => {
  it('should handle empty arrays correctly', () => {
    const res = linearSearch([], 10);
    expect(res.result.isFound).toBe(false);
    expect(res.result.foundIndex).toBe(-1);
    expect(res.totalComparisons).toBe(0);
  });

  it('should find element in single-element array', () => {
    const resFound = linearSearch([42], 42);
    expect(resFound.result.isFound).toBe(true);
    expect(resFound.result.foundIndex).toBe(0);
    expect(resFound.totalComparisons).toBe(1);

    const resNotFound = linearSearch([42], 99);
    expect(resNotFound.result.isFound).toBe(false);
    expect(resNotFound.result.foundIndex).toBe(-1);
    expect(resNotFound.totalComparisons).toBe(1);
  });

  it('should locate target at beginning (best case O(1))', () => {
    const arr = [10, 20, 30, 40, 50];
    const res = linearSearch(arr, 10);
    expect(res.result.foundIndex).toBe(0);
    expect(res.totalComparisons).toBe(1);
  });

  it('should locate target at middle and end', () => {
    const arr = [10, 20, 30, 40, 50];
    const resMid = linearSearch(arr, 30);
    expect(resMid.result.foundIndex).toBe(2);
    expect(resMid.totalComparisons).toBe(3);

    const resEnd = linearSearch(arr, 50);
    expect(resEnd.result.foundIndex).toBe(4);
    expect(resEnd.totalComparisons).toBe(5);
  });

  it('should return -1 when target is missing (worst case O(n))', () => {
    const arr = [5, 15, 25, 35];
    const res = linearSearch(arr, 999);
    expect(res.result.isFound).toBe(false);
    expect(res.result.foundIndex).toBe(-1);
    expect(res.totalComparisons).toBe(4);
  });

  it('should return predictable first occurrence for duplicate values', () => {
    const arr = [7, 14, 21, 14, 28, 14];
    const res = linearSearch(arr, 14);
    expect(res.result.foundIndex).toBe(1); // First occurrence is index 1
    expect(res.totalComparisons).toBe(2);
  });

  it('should support arrays with negative numbers and zero', () => {
    const arr = [-20, -5, 0, 15, 30];
    const resNegative = linearSearch(arr, -5);
    expect(resNegative.result.foundIndex).toBe(1);

    const resZero = linearSearch(arr, 0);
    expect(resZero.result.foundIndex).toBe(2);
  });

  it('should search object records using keyExtractor', () => {
    const requests = [
      { id: 101, weight: 12.5, category: 'YELLOW' },
      { id: 102, weight: 4.8, category: 'RED' },
      { id: 103, weight: 25.0, category: 'WHITE' },
    ];

    const res = linearSearch(requests, 102, (r) => r.id);
    expect(res.result.foundIndex).toBe(1);
    expect(res.result.isFound).toBe(true);

    const resWeight = linearSearch(requests, 25.0, (r) => r.weight);
    expect(resWeight.result.foundIndex).toBe(2);
  });
});
