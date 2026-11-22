import { describe, it, expect } from 'vitest';
import { insertionSort } from '../../src/dsa/sorting/insertionSort';

describe('Unit 2: Insertion Sort', () => {
  it('should handle empty and single-element arrays', () => {
    const emptyRes = insertionSort([]);
    expect(emptyRes.result).toEqual([]);
    expect(emptyRes.totalComparisons).toBe(0);

    const singleRes = insertionSort([77]);
    expect(singleRes.result).toEqual([77]);
    expect(singleRes.totalComparisons).toBe(0);
  });

  it('should sort already-sorted array in O(n) best-case time', () => {
    const arr = [10, 20, 30, 40, 50];
    const res = insertionSort(arr);
    expect(res.result).toEqual([10, 20, 30, 40, 50]);
    // Each element i in 1..4 is compared exactly once with arr[i-1]
    expect(res.totalComparisons).toBe(4);
  });

  it('should sort reverse-sorted array (worst case)', () => {
    const arr = [50, 40, 30, 20, 10];
    const res = insertionSort(arr);
    expect(res.result).toEqual([10, 20, 30, 40, 50]);
    // Maximum comparisons = 1 + 2 + 3 + 4 = 10
    expect(res.totalComparisons).toBe(10);
  });

  it('should preserve stability and sort duplicates', () => {
    const arr = [4, 1, 4, 2, 4, 3];
    const res = insertionSort(arr);
    expect(res.result).toEqual([1, 2, 3, 4, 4, 4]);
  });

  it('should sort arrays with negative numbers and zero', () => {
    const arr = [0, -10, 25, -50, 14, -2];
    const res = insertionSort(arr);
    expect(res.result).toEqual([-50, -10, -2, 0, 14, 25]);
  });

  it('should not mutate original input array', () => {
    const original = [9, 3, 6];
    insertionSort(original);
    expect(original).toEqual([9, 3, 6]);
  });

  it('should sort object records with keyExtractor', () => {
    const batch = [
      { id: 'W1', weightKg: 18.2 },
      { id: 'W2', weightKg: 3.5 },
      { id: 'W3', weightKg: 9.0 },
    ];
    const res = insertionSort(batch, (w) => w.weightKg);
    expect(res.result.map((w) => w.id)).toEqual(['W2', 'W3', 'W1']);
  });
});
