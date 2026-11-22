import { describe, it, expect } from 'vitest';
import { selectionSort } from '../../src/dsa/sorting/selectionSort';

describe('Unit 2: Selection Sort', () => {
  it('should handle empty and single-element arrays', () => {
    const emptyRes = selectionSort([]);
    expect(emptyRes.result).toEqual([]);
    expect(emptyRes.totalComparisons).toBe(0);
    expect(emptyRes.totalSwaps).toBe(0);

    const singleRes = selectionSort([55]);
    expect(singleRes.result).toEqual([55]);
    expect(singleRes.totalComparisons).toBe(0);
    expect(singleRes.totalSwaps).toBe(0);
  });

  it('should sort already-sorted array and perform n(n-1)/2 comparisons', () => {
    const arr = [10, 20, 30, 40, 50];
    const res = selectionSort(arr);
    expect(res.result).toEqual([10, 20, 30, 40, 50]);
    // Comparisons = 4 + 3 + 2 + 1 = 10
    expect(res.totalComparisons).toBe(10);
    // Elements were already in place, so 0 swaps
    expect(res.totalSwaps).toBe(0);
  });

  it('should sort reverse-sorted array with at most n-1 swaps', () => {
    const arr = [50, 40, 30, 20, 10];
    const res = selectionSort(arr);
    expect(res.result).toEqual([10, 20, 30, 40, 50]);
    expect(res.totalComparisons).toBe(10);
    // At most n - 1 = 4 swaps
    expect(res.totalSwaps).toBeLessThanOrEqual(4);
  });

  it('should sort array with duplicate elements', () => {
    const arr = [7, 3, 7, 1, 3, 9, 1];
    const res = selectionSort(arr);
    expect(res.result).toEqual([1, 1, 3, 3, 7, 7, 9]);
  });

  it('should sort negative numbers and zero', () => {
    const arr = [-5, 12, -20, 0, 8, -1];
    const res = selectionSort(arr);
    expect(res.result).toEqual([-20, -5, -1, 0, 8, 12]);
  });

  it('should not mutate original array', () => {
    const original = [4, 2, 8];
    selectionSort(original);
    expect(original).toEqual([4, 2, 8]);
  });

  it('should sort object records with keyExtractor', () => {
    const requests = [
      { id: 101, urgencyScore: 85 },
      { id: 102, urgencyScore: 20 },
      { id: 103, urgencyScore: 60 },
    ];
    const res = selectionSort(requests, (r) => r.urgencyScore);
    expect(res.result.map((r) => r.id)).toEqual([102, 103, 101]);
  });
});
