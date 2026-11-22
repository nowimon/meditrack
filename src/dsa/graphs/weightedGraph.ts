/**
 * MediTrack DSA Lab - Weighted Graph & Dijkstra's Shortest Path
 *
 * Data Structures Used:
 * - Adjacency Matrix (weighted): O(V²) space for dense medical facility network
 * - Priority Queue (Min-Heap): O(log V) extract-min for Dijkstra's relaxation
 * - Hospital Priority Scoring: Composite urgency function using waste data
 *
 * Algorithms:
 * - Dijkstra's Shortest Path: O(V²) with array-scan extract-min (suitable for small V)
 * - Greedy Route Construction: Priority-weighted nearest-neighbor heuristic
 * - Hospital Priority Ranking: Multi-factor scoring (waste volume, urgency, capacity fill %)
 *
 * Domain Application:
 *   Given a network of hospitals/clinics and a treatment plant, compute the
 *   optimal waste collection route that prioritizes facilities with the highest
 *   urgency (overflowing storage, hazardous waste categories) while minimizing
 *   total travel distance.
 */

// ──── Types ────

export interface MapNode {
  id: number;
  label: string;
  type: 'HOSPITAL' | 'CLINIC' | 'TREATMENT_PLANT';
  /** Pixel coordinates for SVG map rendering */
  x: number;
  y: number;
  /** GPS coordinates for OpenStreetMap / Leaflet live mapping */
  lat?: number;
  lng?: number;
  /** Current waste fill percentage (0–100). Higher = more urgent. */
  wasteFillPercent: number;
  /** Average daily waste output in kg */
  wasteOutputKg: number;
  /** Storage capacity in kg */
  storageCapacityKg: number;
  /** Whether this facility has hazardous (Yellow/Red) waste pending */
  hasHazardousWaste: boolean;
}

export interface MapEdge {
  from: number;
  to: number;
  distanceKm: number;
  /** Whether the route is approved for biohazard transport */
  isBiohazardApproved: boolean;
}

export interface DijkstraResult {
  dist: number[];
  prev: (number | null)[];
  /** Step-by-step relaxation log for visualization */
  steps: DijkstraStep[];
}

export interface DijkstraStep {
  currentNode: number;
  relaxedEdges: { to: number; newDist: number; oldDist: number }[];
  visited: number[];
  distances: number[];
}

export interface CollectionRoute {
  /** Ordered list of facility IDs to visit */
  visitOrder: number[];
  /** Total distance of the route in km */
  totalDistanceKm: number;
  /** Priority-weighted score (higher = better route) */
  routeScore: number;
  /** Per-hop details */
  hops: { from: number; to: number; distKm: number; cumDistKm: number }[];
}

export interface HospitalPriority {
  facilityId: number;
  label: string;
  /** Composite priority score (0–100). Higher = collect first. */
  priorityScore: number;
  /** Breakdown of score components */
  breakdown: {
    fillUrgency: number;      // 0–40 points: how full the storage is
    hazardBonus: number;       // 0–25 points: hazardous waste present
    outputPressure: number;    // 0–20 points: high daily output relative to capacity
    overflowRisk: number;      // 0–15 points: will overflow within 24h at current rate
  };
}

// ──── Weighted Adjacency Matrix ────

/**
 * Builds a weighted adjacency matrix from edge list.
 * Matrix[i][j] = distance in km, or Infinity if no direct edge.
 *
 * Time:  O(V² + E)
 * Space: O(V²)
 */
export function buildWeightedAdjMatrix(nodeCount: number, edges: MapEdge[]): number[][] {
  const matrix: number[][] = Array.from({ length: nodeCount }, () =>
    new Array(nodeCount).fill(Infinity)
  );
  for (let i = 0; i < nodeCount; i++) matrix[i][i] = 0;
  for (const edge of edges) {
    matrix[edge.from][edge.to] = edge.distanceKm;
    matrix[edge.to][edge.from] = edge.distanceKm; // undirected
  }
  return matrix;
}

// ──── Dijkstra's Algorithm ────

/**
 * Dijkstra's single-source shortest path using array-scan extract-min.
 * Suitable for dense medical facility graphs where V is small (8–15 nodes).
 *
 * Time:  O(V²)
 * Space: O(V)
 */
export function dijkstra(adjMatrix: number[][], source: number): DijkstraResult {
  const V = adjMatrix.length;
  const dist = new Array(V).fill(Infinity);
  const prev: (number | null)[] = new Array(V).fill(null);
  const visited = new Array<boolean>(V).fill(false);
  const steps: DijkstraStep[] = [];

  dist[source] = 0;

  for (let iter = 0; iter < V; iter++) {
    // Extract minimum distance unvisited vertex — O(V) scan
    let u = -1;
    let minDist = Infinity;
    for (let v = 0; v < V; v++) {
      if (!visited[v] && dist[v] < minDist) {
        minDist = dist[v];
        u = v;
      }
    }

    if (u === -1) break; // remaining vertices unreachable
    visited[u] = true;

    const relaxedEdges: DijkstraStep['relaxedEdges'] = [];

    // Relaxation — check all neighbors of u
    for (let v = 0; v < V; v++) {
      if (!visited[v] && adjMatrix[u][v] !== Infinity) {
        const newDist = dist[u] + adjMatrix[u][v];
        const oldDist = dist[v];
        if (newDist < oldDist) {
          dist[v] = newDist;
          prev[v] = u;
          relaxedEdges.push({ to: v, newDist, oldDist });
        }
      }
    }

    steps.push({
      currentNode: u,
      relaxedEdges,
      visited: visited.map((v, i) => (v ? i : -1)).filter((i) => i >= 0),
      distances: [...dist],
    });
  }

  return { dist, prev, steps };
}

/**
 * Reconstructs the shortest path from source to target using the prev[] array.
 * Time: O(V)
 */
export function reconstructPath(prev: (number | null)[], target: number): number[] {
  const path: number[] = [];
  let current: number | null = target;
  while (current !== null) {
    path.unshift(current);
    current = prev[current];
  }
  return path;
}

// ──── Hospital Priority Scoring ────

/**
 * Computes a composite priority score for each hospital/clinic.
 * Uses a weighted multi-factor formula:
 *
 *   Priority = fillUrgency(0–40) + hazardBonus(0–25) + outputPressure(0–20) + overflowRisk(0–15)
 *
 * This scoring is used by the greedy route planner to decide which
 * hospital to collect from first.
 *
 * Time: O(V)
 */
export function computeHospitalPriorities(nodes: MapNode[]): HospitalPriority[] {
  return nodes
    .filter((n) => n.type !== 'TREATMENT_PLANT')
    .map((node) => {
      // Factor 1: Storage fill urgency (0–40 points)
      const fillUrgency = Math.min(40, (node.wasteFillPercent / 100) * 40);

      // Factor 2: Hazardous waste bonus (0 or 25 points)
      const hazardBonus = node.hasHazardousWaste ? 25 : 0;

      // Factor 3: Output pressure — daily output relative to remaining capacity (0–20 pts)
      const remainingCapacity = node.storageCapacityKg * (1 - node.wasteFillPercent / 100);
      const outputRatio = remainingCapacity > 0 ? node.wasteOutputKg / remainingCapacity : 1;
      const outputPressure = Math.min(20, outputRatio * 20);

      // Factor 4: Overflow risk — will overflow within 24h? (0–15 pts)
      const hoursUntilFull =
        remainingCapacity > 0 ? (remainingCapacity / (node.wasteOutputKg / 24)) : 0;
      const overflowRisk = hoursUntilFull <= 24 ? Math.min(15, ((24 - hoursUntilFull) / 24) * 15) : 0;

      const priorityScore = Math.round(
        Math.min(100, fillUrgency + hazardBonus + outputPressure + overflowRisk)
      );

      return {
        facilityId: node.id,
        label: node.label,
        priorityScore,
        breakdown: {
          fillUrgency: Math.round(fillUrgency * 10) / 10,
          hazardBonus,
          outputPressure: Math.round(outputPressure * 10) / 10,
          overflowRisk: Math.round(overflowRisk * 10) / 10,
        },
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

// ──── Greedy Route Construction (Priority-Weighted Nearest Neighbor) ────

/**
 * Constructs an optimized waste collection route using a priority-weighted
 * greedy nearest-neighbor heuristic:
 *
 *   1. Start at the treatment plant (depot).
 *   2. Among unvisited hospitals, pick the one that maximizes:
 *        score = priorityWeight × priorityScore  −  distanceWeight × distance
 *   3. Travel to it via shortest path (Dijkstra).
 *   4. Repeat until all hospitals are visited.
 *   5. Return to the treatment plant.
 *
 * This is a variant of the Traveling Salesman Problem (TSP) heuristic
 * adapted for waste collection where urgency matters more than pure distance.
 *
 * Time:  O(V² × V²) = O(V⁴) — Dijkstra from each node × greedy selection
 *        Acceptable for V ≤ 15 in a lab/demo setting.
 * Space: O(V²)
 */
export function buildCollectionRoute(
  nodes: MapNode[],
  edges: MapEdge[],
  depotId: number,
  priorities: HospitalPriority[],
  priorityWeight = 2.0,
  distanceWeight = 1.0,
): CollectionRoute {
  const V = nodes.length;
  const adjMatrix = buildWeightedAdjMatrix(V, edges);
  const priorityMap = new Map(priorities.map((p) => [p.facilityId, p.priorityScore]));

  const hospitalsToVisit = new Set(
    nodes.filter((n) => n.type !== 'TREATMENT_PLANT').map((n) => n.id)
  );

  const visitOrder: number[] = [depotId];
  const hops: CollectionRoute['hops'] = [];
  let totalDist = 0;
  let current = depotId;

  while (hospitalsToVisit.size > 0) {
    const { dist } = dijkstra(adjMatrix, current);

    let bestNext = -1;
    let bestScore = -Infinity;

    for (const candidateId of hospitalsToVisit) {
      if (dist[candidateId] === Infinity) continue;

      const prio = priorityMap.get(candidateId) ?? 0;
      const score = priorityWeight * prio - distanceWeight * dist[candidateId];

      if (score > bestScore) {
        bestScore = score;
        bestNext = candidateId;
      }
    }

    if (bestNext === -1) break;

    const hopDist = dist[bestNext];
    totalDist += hopDist;
    hops.push({ from: current, to: bestNext, distKm: Math.round(hopDist * 10) / 10, cumDistKm: Math.round(totalDist * 10) / 10 });
    visitOrder.push(bestNext);
    hospitalsToVisit.delete(bestNext);
    current = bestNext;
  }

  // Return to depot
  if (current !== depotId) {
    const { dist } = dijkstra(adjMatrix, current);
    const returnDist = dist[depotId];
    if (returnDist !== Infinity) {
      totalDist += returnDist;
      hops.push({ from: current, to: depotId, distKm: Math.round(returnDist * 10) / 10, cumDistKm: Math.round(totalDist * 10) / 10 });
      visitOrder.push(depotId);
    }
  }

  const totalPriority = visitOrder
    .filter((id) => id !== depotId)
    .reduce((sum, id) => sum + (priorityMap.get(id) ?? 0), 0);
  const routeScore = totalDist > 0 ? Math.round((totalPriority / totalDist) * 100) / 100 : 0;

  return { visitOrder, totalDistanceKm: Math.round(totalDist * 10) / 10, routeScore, hops };
}

// ──── Sample Network Data ────

export const SAMPLE_MAP_NODES: MapNode[] = [
  { id: 0, label: 'Apex Memorial Hospital', type: 'HOSPITAL', x: 180, y: 80, lat: 12.9780, lng: 77.5850, wasteFillPercent: 85, wasteOutputKg: 35, storageCapacityKg: 200, hasHazardousWaste: true },
  { id: 1, label: 'City Care Diagnostic', type: 'CLINIC', x: 350, y: 60, lat: 12.9900, lng: 77.6150, wasteFillPercent: 45, wasteOutputKg: 12, storageCapacityKg: 80, hasHazardousWaste: false },
  { id: 2, label: 'LifeSpring Children Clinic', type: 'CLINIC', x: 500, y: 120, lat: 12.9800, lng: 77.6400, wasteFillPercent: 70, wasteOutputKg: 18, storageCapacityKg: 100, hasHazardousWaste: true },
  { id: 3, label: 'St. Jude Research Hospital', type: 'HOSPITAL', x: 520, y: 260, lat: 12.9450, lng: 77.6450, wasteFillPercent: 92, wasteOutputKg: 42, storageCapacityKg: 250, hasHazardousWaste: true },
  { id: 4, label: 'Metro Trauma Center', type: 'HOSPITAL', x: 350, y: 300, lat: 12.9350, lng: 77.6100, wasteFillPercent: 60, wasteOutputKg: 28, storageCapacityKg: 180, hasHazardousWaste: false },
  { id: 5, label: 'Green Valley Health Center', type: 'CLINIC', x: 150, y: 260, lat: 12.9300, lng: 77.5700, wasteFillPercent: 30, wasteOutputKg: 8, storageCapacityKg: 60, hasHazardousWaste: false },
  { id: 6, label: 'UrbanMed Polyclinic', type: 'CLINIC', x: 80, y: 160, lat: 12.9550, lng: 77.5600, wasteFillPercent: 55, wasteOutputKg: 15, storageCapacityKg: 90, hasHazardousWaste: true },
  { id: 7, label: 'Central Treatment Plant', type: 'TREATMENT_PLANT', x: 320, y: 400, lat: 12.9100, lng: 77.6050, wasteFillPercent: 10, wasteOutputKg: 0, storageCapacityKg: 1000, hasHazardousWaste: false },
];

export const SAMPLE_MAP_EDGES: MapEdge[] = [
  { from: 0, to: 1, distanceKm: 4.2, isBiohazardApproved: true },
  { from: 0, to: 6, distanceKm: 2.8, isBiohazardApproved: true },
  { from: 0, to: 5, distanceKm: 5.5, isBiohazardApproved: false },
  { from: 1, to: 2, distanceKm: 3.6, isBiohazardApproved: true },
  { from: 1, to: 4, distanceKm: 6.0, isBiohazardApproved: true },
  { from: 2, to: 3, distanceKm: 3.8, isBiohazardApproved: true },
  { from: 3, to: 4, distanceKm: 4.5, isBiohazardApproved: true },
  { from: 3, to: 7, distanceKm: 5.0, isBiohazardApproved: true },
  { from: 4, to: 5, distanceKm: 5.2, isBiohazardApproved: false },
  { from: 4, to: 7, distanceKm: 3.0, isBiohazardApproved: true },
  { from: 5, to: 6, distanceKm: 3.5, isBiohazardApproved: false },
  { from: 6, to: 7, distanceKm: 7.2, isBiohazardApproved: true },
];

