import { describe, it, expect } from 'vitest';
import { generateSampleWasteRequests } from '../../src/data/dataGenerator';

describe('Synthetic Data Generator', () => {
  it('should generate exact requested count of medical waste requests', () => {
    const list = generateSampleWasteRequests(25);
    expect(list).toHaveLength(25);
    expect(list[0].id).toBe(1);
    expect(list[24].id).toBe(25);
  });

  it('should be deterministic across runs with identical seed', () => {
    const runA = generateSampleWasteRequests(30, 100);
    const runB = generateSampleWasteRequests(30, 100);
    expect(runA).toEqual(runB);
  });

  it('should generate valid biomedical waste categories and positive weights', () => {
    const list = generateSampleWasteRequests(50, 42);
    const validCategories = new Set(['YELLOW', 'RED', 'WHITE', 'BLUE']);

    for (const req of list) {
      expect(validCategories.has(req.wasteCategory)).toBe(true);
      expect(req.wasteWeightKg).toBeGreaterThan(0);
      expect(req.urgencyScore).toBeGreaterThanOrEqual(1);
      expect(req.urgencyScore).toBeLessThanOrEqual(100);
    }
  });

  it('should be deterministic with default parameters', () => {
    const run1 = generateSampleWasteRequests();
    const run2 = generateSampleWasteRequests();
    expect(run1).toEqual(run2);
    expect(run1).toHaveLength(50);
  });

  it('should handle negative and edge seeds deterministically without crashing', () => {
    const runNegA = generateSampleWasteRequests(20, -999);
    const runNegB = generateSampleWasteRequests(20, -999);
    expect(runNegA).toEqual(runNegB);
    expect(runNegA).toHaveLength(20);
    expect(runNegA[0].facilityName).toBeDefined();
    expect(runNegA[0].wardOrDepartment).toBeDefined();
  });
});
