// Graph Traversals (BFS and DFS) for Hospital Waste Routing Network

export interface BFSStep {
  visited: number[];
  queue: number[];
  current: number;
}

export interface DFSStep {
  visited: number[];
  stack: number[];
  current: number;
}

export interface TraversalResult<TStep> {
  order: number[];
  steps: TStep[];
}

/**
 * Builds an adjacency list from node count and undirected edge pairs.
 */
export function buildAdjList(n: number, edges: [number, number][]): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  return adj;
}

/**
 * Breadth-First Search (BFS): Visits neighbors level by level using a FIFO Queue.
 */
export function bfsTraversal(
  adj: number[][],
  start: number,
  n: number,
): TraversalResult<BFSStep> {
  const visited = new Array<boolean>(n).fill(false);
  const queue: number[] = [start];
  visited[start] = true;
  const order: number[] = [];
  const steps: BFSStep[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    steps.push({ visited: [...order], queue: [...queue], current: node });
    for (const neighbor of adj[node]) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        queue.push(neighbor);
      }
    }
  }
  return { order, steps };
}

/**
 * Depth-First Search (DFS): Explores as deep as possible along each branch using a LIFO Stack.
 */
export function dfsTraversal(
  adj: number[][],
  start: number,
  n: number,
): TraversalResult<DFSStep> {
  const visited = new Array<boolean>(n).fill(false);
  const stack: number[] = [start];
  const order: number[] = [];
  const steps: DFSStep[] = [];

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (visited[node]) continue;
    visited[node] = true;
    order.push(node);
    steps.push({ visited: [...order], stack: [...stack], current: node });
    const neighbors = [...adj[node]].reverse();
    for (const neighbor of neighbors) {
      if (!visited[neighbor]) stack.push(neighbor);
    }
  }
  return { order, steps };
}
