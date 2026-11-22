import { describe, it, expect } from 'vitest';
import { generateSampleWasteRequests } from '../../src/data/dataGenerator';
import { bubbleSort } from '../../src/dsa/sorting/bubbleSort';
import { selectionSort } from '../../src/dsa/sorting/selectionSort';
import { insertionSort } from '../../src/dsa/sorting/insertionSort';
import { mergeSort } from '../../src/dsa/sorting/mergeSort';
import { quickSort } from '../../src/dsa/sorting/quickSort';
import { linearSearch } from '../../src/dsa/arrays/linearSearch';
import { binarySearch } from '../../src/dsa/arrays/binarySearch';
import type { WasteRequest } from '../../src/models/WasteRequest';

describe('Search & Sort Visualizer Integration Verification', () => {
  const requests = generateSampleWasteRequests(15, 42);
  const ke = (r: WasteRequest) => r.urgencyScore;

  it('Bubble Sort produces correct visualization steps with valid auxiliary pointers', () => {
    const res = bubbleSort(requests, ke);
    expect(res.steps.length).toBeGreaterThan(0);
    expect(res.totalComparisons).toBeGreaterThan(0);

    // Verify each step has snapshot and comparisons counter
    for (const step of res.steps) {
      expect(step.state.length).toBe(requests.length);
      expect(step.comparisons).toBeGreaterThanOrEqual(0);
      expect(step.swaps).toBeGreaterThanOrEqual(0);
    }

    // Verify final state is sorted
    const finalScores = res.result.map(ke);
    for (let i = 0; i < finalScores.length - 1; i++) {
      expect(finalScores[i]).toBeLessThanOrEqual(finalScores[i + 1]);
    }
  });

  it('Selection Sort produces correct visualization steps with minIdx pointers', () => {
    const res = selectionSort(requests, ke);
    expect(res.steps.length).toBeGreaterThan(0);
    expect(res.totalComparisons).toBeGreaterThan(0);

    for (const step of res.steps) {
      expect(step.state.length).toBe(requests.length);
      if (step.auxiliaryPointers?.minIdx !== undefined && step.auxiliaryPointers.minIdx !== null) {
        expect(step.auxiliaryPointers.minIdx).toBeGreaterThanOrEqual(0);
        expect(step.auxiliaryPointers.minIdx).toBeLessThan(requests.length);
      }
    }

    const finalScores = res.result.map(ke);
    for (let i = 0; i < finalScores.length - 1; i++) {
      expect(finalScores[i]).toBeLessThanOrEqual(finalScores[i + 1]);
    }
  });

  it('Insertion Sort produces correct visualization steps with keyIndex pointers', () => {
    const res = insertionSort(requests, ke);
    expect(res.steps.length).toBeGreaterThan(0);
    expect(res.totalComparisons).toBeGreaterThan(0);

    for (const step of res.steps) {
      expect(step.state.length).toBe(requests.length);
    }

    const finalScores = res.result.map(ke);
    for (let i = 0; i < finalScores.length - 1; i++) {
      expect(finalScores[i]).toBeLessThanOrEqual(finalScores[i + 1]);
    }
  });

  it('Merge Sort produces correct visualization steps with left, mid, right pointers', () => {
    const res = mergeSort(requests, ke);
    expect(res.steps.length).toBeGreaterThan(0);
    expect(res.totalComparisons).toBeGreaterThan(0);

    for (const step of res.steps) {
      expect(step.state.length).toBe(requests.length);
    }

    const finalScores = res.result.map(ke);
    for (let i = 0; i < finalScores.length - 1; i++) {
      expect(finalScores[i]).toBeLessThanOrEqual(finalScores[i + 1]);
    }
  });

  it('Quick Sort produces correct visualization steps with pivotIndex pointers', () => {
    const res = quickSort(requests, ke);
    expect(res.steps.length).toBeGreaterThan(0);
    expect(res.totalComparisons).toBeGreaterThan(0);

    for (const step of res.steps) {
      expect(step.state.length).toBe(requests.length);
      if (step.auxiliaryPointers?.pivotIndex !== undefined && step.auxiliaryPointers.pivotIndex !== null) {
        expect(step.auxiliaryPointers.pivotIndex).toBeGreaterThanOrEqual(0);
        expect(step.auxiliaryPointers.pivotIndex).toBeLessThan(requests.length);
      }
    }

    const finalScores = res.result.map(ke);
    for (let i = 0; i < finalScores.length - 1; i++) {
      expect(finalScores[i]).toBeLessThanOrEqual(finalScores[i + 1]);
    }
  });

  it('Linear Search sequentially locates existing and absent targets with pointer steps', () => {
    const target = requests[5].urgencyScore;
    const resFound = linearSearch(requests, target, ke);

    expect(resFound.result.isFound).toBe(true);
    expect(resFound.result.foundIndex).toBeGreaterThanOrEqual(0);
    expect(resFound.steps.length).toBeGreaterThan(0);

    // Target not in dataset
    const resNotFound = linearSearch(requests, 99999, ke);
    expect(resNotFound.result.isFound).toBe(false);
    expect(resNotFound.result.foundIndex).toBe(-1);
  });

  it('Binary Search properly bisects sorted data and maintains L, M, H pointer steps', () => {
    const sorted = [...requests].sort((a, b) => ke(a) - ke(b));
    const target = sorted[7].urgencyScore;
    const resFound = binarySearch(sorted, target, ke);

    expect(resFound.result.isFound).toBe(true);
    expect(resFound.result.foundIndex).toBe(7);
    expect(resFound.steps.length).toBeGreaterThan(0);

    // Verify pointer steps
    for (const step of resFound.steps) {
      expect(step.state.length).toBe(sorted.length);
      if (step.auxiliaryPointers) {
        const { low, mid, high } = step.auxiliaryPointers;
        if (low !== null && low !== undefined) expect(low).toBeGreaterThanOrEqual(0);
        if (mid !== null && mid !== undefined) expect(mid).toBeGreaterThanOrEqual(0);
        if (high !== null && high !== undefined) expect(high).toBeLessThan(sorted.length);
      }
    }

    // Absent target
    const resNotFound = binarySearch(sorted, 99999, ke);
    expect(resNotFound.result.isFound).toBe(false);
    expect(resNotFound.result.foundIndex).toBe(-1);
  });
});
