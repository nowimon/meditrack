import { describe, it, expect } from 'vitest';
import { bubbleSort } from '../../src/dsa/sorting/bubbleSort';

describe('Unit 2: Bubble Sort', () => {
  it('should handle empty and single-element arrays', () => {
    const emptyRes = bubbleSort([]);
    expect(emptyRes.result).toEqual([]);
    expect(emptyRes.totalComparisons).toBe(0);
    expect(emptyRes.totalSwaps).toBe(0);

    const singleRes = bubbleSort([99]);
    expect(singleRes.result).toEqual([99]);
    expect(singleRes.totalComparisons).toBe(0);
    expect(singleRes.totalSwaps).toBe(0);
  });

  it('should sort an already-sorted array with early-exit in O(n) best case', () => {
    const arr = [10, 20, 30, 40, 50];
    const res = bubbleSort(arr);
    expect(res.result).toEqual([10, 20, 30, 40, 50]);
    // Early exit after pass 1: (n - 1) comparisons and 0 swaps
    expect(res.totalComparisons).toBe(4);
    expect(res.totalSwaps).toBe(0);
    expect(res.steps.some((s) => s.description.includes('Early Exit'))).toBe(true);
  });

  it('should correctly sort a reverse-sorted array (worst case)', () => {
    const arr = [50, 40, 30, 20, 10];
    const res = bubbleSort(arr);
    expect(res.result).toEqual([10, 20, 30, 40, 50]);
    expect(res.totalSwaps).toBe(10); // 4 + 3 + 2 + 1 = 10 swaps
    expect(res.totalComparisons).toBe(10);
  });

  it('should correctly sort arrays containing duplicates', () => {
    const arr = [5, 2, 8, 2, 5, 1, 8];
    const res = bubbleSort(arr);
    expect(res.result).toEqual([1, 2, 2, 5, 5, 8, 8]);
  });

  it('should handle negative numbers and zero', () => {
    const arr = [-15, 4, -2, 0, 18, -30];
    const res = bubbleSort(arr);
    expect(res.result).toEqual([-30, -15, -2, 0, 4, 18]);
  });

  it('should not mutate original input array', () => {
    const original = [3, 1, 2];
    bubbleSort(original);
    expect(original).toEqual([3, 1, 2]);
  });

  it('should sort objects using keyExtractor', () => {
    const items = [
      { id: 'A', weightKg: 14.5 },
      { id: 'B', weightKg: 2.1 },
      { id: 'C', weightKg: 8.9 },
    ];
    const res = bubbleSort(items, (item) => item.weightKg);
    expect(res.result.map((i) => i.id)).toEqual(['B', 'C', 'A']);
  });
});
