import { describe, it, expect } from 'vitest';
import { quickSort } from '../../src/dsa/sorting/quickSort';

describe('Unit 2: Quick Sort (Lomuto Partition)', () => {
  it('should handle empty and single-element arrays', () => {
    const emptyRes = quickSort([]);
    expect(emptyRes.result).toEqual([]);
    expect(emptyRes.totalComparisons).toBe(0);

    const singleRes = quickSort([88]);
    expect(singleRes.result).toEqual([88]);
    expect(singleRes.totalComparisons).toBe(0);
  });

  it('should correctly sort already-sorted array (worst case for Lomuto partition)', () => {
    const sorted = [10, 20, 30, 40, 50];
    const res = quickSort(sorted);
    expect(res.result).toEqual([10, 20, 30, 40, 50]);
    // On sorted data, Lomuto partition results in n(n-1)/2 comparisons O(n^2)
    expect(res.totalComparisons).toBe(10);
  });

  it('should sort reverse-sorted array correctly', () => {
    const reverse = [50, 40, 30, 20, 10];
    const res = quickSort(reverse);
    expect(res.result).toEqual([10, 20, 30, 40, 50]);
  });

  it('should sort arrays with duplicate elements', () => {
    const duplicates = [7, 2, 7, 1, 9, 2, 7];
    const res = quickSort(duplicates);
    expect(res.result).toEqual([1, 2, 2, 7, 7, 7, 9]);
  });

  it('should sort negative numbers and zero', () => {
    const arr = [-25, 0, 14, -8, 30, -50];
    const res = quickSort(arr);
    expect(res.result).toEqual([-50, -25, -8, 0, 14, 30]);
  });

  it('should sort arbitrary random array correctly', () => {
    const random = [64, 34, 25, 12, 22, 11, 90, 88, 76, 45, 1, 3, 55];
    const res = quickSort(random);
    const expected = [...random].sort((a, b) => a - b);
    expect(res.result).toEqual(expected);
  });

  it('should not mutate original input array', () => {
    const original = [10, 5, 20];
    quickSort(original);
    expect(original).toEqual([10, 5, 20]);
  });

  it('should sort object records with keyExtractor', () => {
    const requests = [
      { id: 'R10', urgency: 95 },
      { id: 'R20', urgency: 30 },
      { id: 'R30', urgency: 75 },
    ];
    const res = quickSort(requests, (r) => r.urgency);
    expect(res.result.map((r) => r.id)).toEqual(['R20', 'R30', 'R10']);
  });
});
