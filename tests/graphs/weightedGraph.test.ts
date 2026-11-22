import { describe, it, expect } from 'vitest';
import {
  buildWeightedAdjMatrix,
  dijkstra,
  reconstructPath,
  computeHospitalPriorities,
  buildCollectionRoute,
  SAMPLE_MAP_NODES,
  SAMPLE_MAP_EDGES,
} from '../../src/dsa/graphs/weightedGraph';

describe('Weighted Graph — Adjacency Matrix', () => {
  it('builds a symmetric matrix with correct dimensions', () => {
    const matrix = buildWeightedAdjMatrix(8, SAMPLE_MAP_EDGES);
    expect(matrix.length).toBe(8);
    expect(matrix[0].length).toBe(8);
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        expect(matrix[i][j]).toBe(matrix[j][i]);
      }
    }
  });

  it('diagonal entries are 0', () => {
    const matrix = buildWeightedAdjMatrix(8, SAMPLE_MAP_EDGES);
    for (let i = 0; i < 8; i++) {
      expect(matrix[i][i]).toBe(0);
    }
  });

  it('stores correct edge weights', () => {
    const matrix = buildWeightedAdjMatrix(8, SAMPLE_MAP_EDGES);
    expect(matrix[0][1]).toBe(4.2);
    expect(matrix[3][7]).toBe(5.0);
    expect(matrix[4][7]).toBe(3.0);
  });

  it('non-edges are Infinity', () => {
    const matrix = buildWeightedAdjMatrix(8, SAMPLE_MAP_EDGES);
    expect(matrix[0][3]).toBe(Infinity);
    expect(matrix[1][7]).toBe(Infinity);
  });
});

describe("Dijkstra's Shortest Path", () => {
  const matrix = buildWeightedAdjMatrix(8, SAMPLE_MAP_EDGES);

  it('computes zero distance from source to itself', () => {
    const result = dijkstra(matrix, 0);
    expect(result.dist[0]).toBe(0);
  });

  it('finds shortest distances from treatment plant (node 7)', () => {
    const result = dijkstra(matrix, 7);
    expect(result.dist[3]).toBe(5.0);
    expect(result.dist[4]).toBe(3.0);
    expect(result.dist[5]).toBe(8.2);
  });

  it('reconstructs correct shortest path', () => {
    const result = dijkstra(matrix, 7);
    const pathTo0 = reconstructPath(result.prev, 0);
    expect(pathTo0[0]).toBe(7);
    expect(pathTo0[pathTo0.length - 1]).toBe(0);
    expect(pathTo0.length).toBeGreaterThanOrEqual(2);
  });

  it('records step-by-step relaxation log', () => {
    const result = dijkstra(matrix, 0);
    expect(result.steps.length).toBeGreaterThan(0);
    expect(result.steps[0].currentNode).toBe(0);
    for (let i = 1; i < result.steps.length; i++) {
      expect(result.steps[i].visited.length).toBeGreaterThanOrEqual(
        result.steps[i - 1].visited.length
      );
    }
  });
});

describe('Hospital Priority Scoring', () => {
  it('returns priorities only for hospitals/clinics (excludes treatment plant)', () => {
    const priorities = computeHospitalPriorities(SAMPLE_MAP_NODES);
    expect(priorities.length).toBe(7);
    expect(priorities.every((p) => p.facilityId !== 7)).toBe(true);
  });

  it('sorts by descending priority score', () => {
    const priorities = computeHospitalPriorities(SAMPLE_MAP_NODES);
    for (let i = 1; i < priorities.length; i++) {
      expect(priorities[i - 1].priorityScore).toBeGreaterThanOrEqual(
        priorities[i].priorityScore
      );
    }
  });

  it('assigns highest priority to St. Jude (92% fill + hazardous + high output)', () => {
    const priorities = computeHospitalPriorities(SAMPLE_MAP_NODES);
    expect(priorities[0].facilityId).toBe(3);
    expect(priorities[0].priorityScore).toBeGreaterThanOrEqual(80);
  });

  it('assigns lowest priority to Green Valley (30% fill, no hazard, low output)', () => {
    const priorities = computeHospitalPriorities(SAMPLE_MAP_NODES);
    const greenValley = priorities.find((p) => p.facilityId === 5)!;
    expect(greenValley.priorityScore).toBeLessThan(30);
  });

  it('provides valid breakdown components', () => {
    const priorities = computeHospitalPriorities(SAMPLE_MAP_NODES);
    for (const p of priorities) {
      expect(p.breakdown.fillUrgency).toBeGreaterThanOrEqual(0);
      expect(p.breakdown.fillUrgency).toBeLessThanOrEqual(40);
      expect(p.breakdown.hazardBonus === 0 || p.breakdown.hazardBonus === 25).toBe(true);
      expect(p.breakdown.outputPressure).toBeGreaterThanOrEqual(0);
      expect(p.breakdown.outputPressure).toBeLessThanOrEqual(20);
      expect(p.breakdown.overflowRisk).toBeGreaterThanOrEqual(0);
      expect(p.breakdown.overflowRisk).toBeLessThanOrEqual(15);
    }
  });
});

describe('Collection Route Builder (Greedy Priority-Weighted)', () => {
  it('starts and ends at the treatment plant (depot)', () => {
    const priorities = computeHospitalPriorities(SAMPLE_MAP_NODES);
    const route = buildCollectionRoute(SAMPLE_MAP_NODES, SAMPLE_MAP_EDGES, 7, priorities);
    expect(route.visitOrder[0]).toBe(7);
    expect(route.visitOrder[route.visitOrder.length - 1]).toBe(7);
  });

  it('visits all hospitals/clinics exactly once', () => {
    const priorities = computeHospitalPriorities(SAMPLE_MAP_NODES);
    const route = buildCollectionRoute(SAMPLE_MAP_NODES, SAMPLE_MAP_EDGES, 7, priorities);
    const hospitalIds = SAMPLE_MAP_NODES.filter((n) => n.type !== 'TREATMENT_PLANT').map((n) => n.id);
    const visited = route.visitOrder.filter((id) => id !== 7);
    expect(new Set(visited).size).toBe(hospitalIds.length);
    for (const hId of hospitalIds) {
      expect(visited).toContain(hId);
    }
  });

  it('computes positive total distance', () => {
    const priorities = computeHospitalPriorities(SAMPLE_MAP_NODES);
    const route = buildCollectionRoute(SAMPLE_MAP_NODES, SAMPLE_MAP_EDGES, 7, priorities);
    expect(route.totalDistanceKm).toBeGreaterThan(0);
  });

  it('provides hop-by-hop details with cumulative distances', () => {
    const priorities = computeHospitalPriorities(SAMPLE_MAP_NODES);
    const route = buildCollectionRoute(SAMPLE_MAP_NODES, SAMPLE_MAP_EDGES, 7, priorities);
    expect(route.hops.length).toBeGreaterThan(0);
    for (let i = 1; i < route.hops.length; i++) {
      expect(route.hops[i].cumDistKm).toBeGreaterThan(route.hops[i - 1].cumDistKm);
    }
  });

  it('prioritizes high-urgency hospitals early in the route', () => {
    const priorities = computeHospitalPriorities(SAMPLE_MAP_NODES);
    const route = buildCollectionRoute(SAMPLE_MAP_NODES, SAMPLE_MAP_EDGES, 7, priorities);
    // St. Jude (id=3, highest priority) should be among the first 3 hospitals visited
    const stJudePos = route.visitOrder.indexOf(3);
    expect(stJudePos).toBeGreaterThan(0);
    expect(stJudePos).toBeLessThanOrEqual(3);
  });

  it('computes a positive route score', () => {
    const priorities = computeHospitalPriorities(SAMPLE_MAP_NODES);
    const route = buildCollectionRoute(SAMPLE_MAP_NODES, SAMPLE_MAP_EDGES, 7, priorities);
    expect(route.routeScore).toBeGreaterThan(0);
  });
});

