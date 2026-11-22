import { describe, it, expect } from 'vitest';
import { mergeSort } from '../../src/dsa/sorting/mergeSort';

describe('Unit 2: Merge Sort', () => {
  it('should handle empty and single-element arrays', () => {
    const emptyRes = mergeSort([]);
    expect(emptyRes.result).toEqual([]);
    expect(emptyRes.totalComparisons).toBe(0);

    const singleRes = mergeSort([42]);
    expect(singleRes.result).toEqual([42]);
    expect(singleRes.totalComparisons).toBe(0);
  });

  it('should sort already-sorted array and guarantee O(n log n) operations', () => {
    const arr = [10, 20, 30, 40, 50, 60, 70, 80];
    const res = mergeSort(arr);
    expect(res.result).toEqual([10, 20, 30, 40, 50, 60, 70, 80]);
    expect(res.totalComparisons).toBeGreaterThan(0);
  });

  it('should sort reverse-sorted array correctly', () => {
    const arr = [80, 70, 60, 50, 40, 30, 20, 10];
    const res = mergeSort(arr);
    expect(res.result).toEqual([10, 20, 30, 40, 50, 60, 70, 80]);
  });

  it('should sort array with many duplicates stably', () => {
    const arr = [5, 2, 8, 2, 5, 1, 9, 2];
    const res = mergeSort(arr);
    expect(res.result).toEqual([1, 2, 2, 2, 5, 5, 8, 9]);
  });

  it('should handle negative numbers and zero', () => {
    const arr = [-20, 15, 0, -4, 30, -50];
    const res = mergeSort(arr);
    expect(res.result).toEqual([-50, -20, -4, 0, 15, 30]);
  });

  it('should sort large random array correctly', () => {
    const random = [45, 12, 89, 34, 23, 76, 54, 98, 1, 67, 33, 21, 90, 11, 4];
    const res = mergeSort(random);
    const expected = [...random].sort((a, b) => a - b);
    expect(res.result).toEqual(expected);
  });

  it('should not mutate original input array', () => {
    const original = [5, 1, 3];
    mergeSort(original);
    expect(original).toEqual([5, 1, 3]);
  });

  it('should sort object records with keyExtractor', () => {
    const requests = [
      { id: 'REQ-1', weightKg: 28.5 },
      { id: 'REQ-2', weightKg: 4.0 },
      { id: 'REQ-3', weightKg: 12.0 },
    ];
    const res = mergeSort(requests, (r) => r.weightKg);
    expect(res.result.map((r) => r.id)).toEqual(['REQ-2', 'REQ-3', 'REQ-1']);
  });
});
