import { describe, it, expect } from 'vitest';
import { buildAdjList, bfsTraversal, dfsTraversal } from '../../src/dsa/graphs/traversals';

describe('Graph Traversals', () => {
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 4],
  ];

  it('builds an undirected adjacency list', () => {
    const adj = buildAdjList(5, edges);
    expect(adj[0]).toContain(1);
    expect(adj[0]).toContain(2);
    expect(adj[1]).toContain(0);
    expect(adj[1]).toContain(3);
  });

  it('runs BFS traversal in level-by-level queue order', () => {
    const adj = buildAdjList(5, edges);
    const { order, steps } = bfsTraversal(adj, 0, 5);

    expect(order[0]).toBe(0);
    expect(order.slice(1, 3)).toEqual(expect.arrayContaining([1, 2]));
    expect(steps.length).toBe(5);
  });

  it('runs DFS traversal exploring depth using stack', () => {
    const adj = buildAdjList(5, edges);
    const { order, steps } = dfsTraversal(adj, 0, 5);

    expect(order[0]).toBe(0);
    expect(order.length).toBe(5);
    expect(steps.length).toBe(5);
  });
});
