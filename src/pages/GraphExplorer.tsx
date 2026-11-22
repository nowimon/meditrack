import React, { useState, useCallback, useMemo } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Play, RotateCcw, Plus, Minus, Info } from 'lucide-react';
import { buildAdjList, bfsTraversal, dfsTraversal } from '../dsa/graphs/traversals';

// ─────────── Graph data ───────────
const INITIAL_NODES = [
  { id: 0, label: 'Apex Mem.', x: 100, y: 80 },
  { id: 1, label: 'City Care', x: 250, y: 40 },
  { id: 2, label: 'LifeSpring', x: 380, y: 100 },
  { id: 3, label: 'St. Jude', x: 420, y: 220 },
  { id: 4, label: 'Metro T.', x: 280, y: 260 },
  { id: 5, label: 'Gr. Valley', x: 120, y: 230 },
  { id: 6, label: 'UrbanMed', x: 60, y: 150 },
  { id: 7, label: 'Treatment', x: 340, y: 360 },
];

const INITIAL_EDGES: [number, number][] = [
  [0, 1], [0, 6], [0, 5],
  [1, 2], [1, 4],
  [2, 3],
  [3, 4], [3, 7],
  [4, 5], [4, 7],
  [5, 6],
];

type TraversalAlgo = 'bfs' | 'dfs';

export const GraphExplorer: React.FC = () => {
  const [nodes] = useState(INITIAL_NODES);
  const [edges, setEdges] = useState<[number, number][]>(INITIAL_EDGES);
  const [algo, setAlgo] = useState<TraversalAlgo>('bfs');
  const [startNode, setStartNode] = useState(0);
  const [stepIdx, setStepIdx] = useState(-1);
  const [traversalResult, setTraversalResult] = useState<{ order: number[]; steps: { visited: number[]; queue?: number[]; stack?: number[]; current: number }[] } | null>(null);
  const [viewMode, setViewMode] = useState<'graph' | 'matrix' | 'list'>('graph');
  const [addEdgeFrom, setAddEdgeFrom] = useState('');
  const [addEdgeTo, setAddEdgeTo] = useState('');

  const adj = useMemo(() => buildAdjList(nodes.length, edges), [edges, nodes.length]);

  const runTraversal = useCallback(() => {
    if (algo === 'bfs') {
      const result = bfsTraversal(adj, startNode, nodes.length);
      setTraversalResult(result);
    } else {
      const result = dfsTraversal(adj, startNode, nodes.length);
      setTraversalResult(result);
    }
    setStepIdx(0);
  }, [adj, algo, startNode, nodes.length]);

  const reset = useCallback(() => {
    setTraversalResult(null);
    setStepIdx(-1);
  }, []);

  const addEdge = useCallback(() => {
    const u = parseInt(addEdgeFrom);
    const v = parseInt(addEdgeTo);
    if (isNaN(u) || isNaN(v) || u === v || u >= nodes.length || v >= nodes.length || u < 0 || v < 0) return;
    if (edges.some(([a, b]) => (a === u && b === v) || (a === v && b === u))) return;
    setEdges((prev) => [...prev, [u, v]]);
    reset();
  }, [addEdgeFrom, addEdgeTo, edges, nodes.length, reset]);

  const removeLastEdge = useCallback(() => {
    setEdges((prev) => prev.slice(0, -1));
    reset();
  }, [reset]);

  const currentStep = traversalResult && stepIdx >= 0 ? traversalResult.steps[stepIdx] : null;

  // Which nodes are currently highlighted
  const visitedInStep = currentStep ? new Set(currentStep.visited) : new Set<number>();
  const currentNode = currentStep ? currentStep.current : -1;

  // Adjacency Matrix display
  const adjMatrix = useMemo(() => {
    const m = Array.from({ length: nodes.length }, () => new Array(nodes.length).fill(0));
    for (const [u, v] of edges) { m[u][v] = 1; m[v][u] = 1; }
    return m;
  }, [edges, nodes.length]);

  return (
    <PageShell
      title="Graph Facility Routing"
      subtitle="8-node hospital network with BFS and DFS traversals, adjacency matrix, and adjacency list representations"
      complexity="BFS/DFS: O(V + E) time · Matrix: O(V²) space · List: O(V + E) space"
    >
      {/* Traversal definition bar */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs text-slate-600 flex items-center gap-2">
        <Info className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>
          <strong>BFS (Breadth-First Search)</strong> explores all immediate neighbors level-by-level using a FIFO Queue. <strong>DFS (Depth-First Search)</strong> explores deeply down each path using a LIFO Stack.
        </span>
      </div>

      {/* View mode + controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-1">
          {(['graph', 'matrix', 'list'] as const).map((v) => (
            <button key={v} onClick={() => setViewMode(v)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${viewMode === v ? 'bg-emerald-600 text-white' : 'border border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
              {v === 'graph' ? '📊 Visual Graph' : v === 'matrix' ? '⬜ Adj. Matrix' : '📋 Adj. List'}
            </button>
          ))}
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <select value={algo} onChange={(e) => { setAlgo(e.target.value as TraversalAlgo); reset(); }}
            className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="bfs">BFS — Breadth-First (Queue)</option>
            <option value="dfs">DFS — Depth-First (Stack)</option>
          </select>
          <select value={startNode} onChange={(e) => { setStartNode(parseInt(e.target.value)); reset(); }}
            className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {nodes.map((n) => <option key={n.id} value={n.id}>{n.id}: {n.label}</option>)}
          </select>
          <button onClick={runTraversal}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition">
            <Play className="h-3 w-3" /> Run {algo.toUpperCase()}
          </button>
          <button onClick={reset}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
      </div>

      {/* Step Controls */}
      {traversalResult && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1">
            <button onClick={() => setStepIdx(Math.max(0, stepIdx - 1))} disabled={stepIdx <= 0}
              className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition">‹ Prev</button>
            <button onClick={() => setStepIdx(Math.min(traversalResult.steps.length - 1, stepIdx + 1))} disabled={stepIdx >= traversalResult.steps.length - 1}
              className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition">Next ›</button>
          </div>
          <span className="text-xs text-slate-500">Step {stepIdx + 1}/{traversalResult.steps.length}</span>
          {currentStep && (
            <div className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${algo === 'bfs' ? 'bg-sky-50 border border-sky-200 text-sky-800' : 'bg-purple-50 border border-purple-200 text-purple-800'}`}>
              {algo === 'bfs' ? '🔵' : '🟣'} Visiting: <strong>{nodes[currentNode]?.label}</strong> (node {currentNode})
              {' · '}
              {algo === 'bfs' ? `Queue: [${(currentStep as { queue?: number[] }).queue?.join(', ') ?? ''}]`
                : `Stack: [${(currentStep as { stack?: number[] }).stack?.join(', ') ?? ''}]`}
            </div>
          )}
        </div>
      )}

      {/* Visualization */}
      {viewMode === 'graph' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <svg width="480" height="400" style={{ width: '100%', maxWidth: '480px', display: 'block' }}>
            {edges.map(([u, v], i) => {
              const nu = nodes[u]; const nv = nodes[v];
              return <line key={i} x1={nu.x} y1={nu.y} x2={nv.x} y2={nv.y} stroke="#cbd5e1" strokeWidth="2" />;
            })}
            {nodes.map((node) => {
              const isVisited = visitedInStep.has(node.id);
              const isCurrent = node.id === currentNode;
              return (
                <g key={node.id} transform={`translate(${node.x},${node.y})`}>
                  <circle r={26}
                    fill={isCurrent ? '#6d28d9' : isVisited ? (algo === 'bfs' ? '#bae6fd' : '#ddd6fe') : '#f1f5f9'}
                    stroke={isCurrent ? '#4c1d95' : isVisited ? (algo === 'bfs' ? '#0284c7' : '#7c3aed') : '#94a3b8'}
                    strokeWidth={isCurrent ? 3 : 2} />
                  <text textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="bold"
                    fill={isCurrent ? 'white' : '#1e293b'} y={-6}>{node.id}</text>
                  <text textAnchor="middle" dominantBaseline="middle" fontSize="7" fill={isCurrent ? '#e9d5ff' : '#64748b'} y={6}>
                    {node.label.slice(0, 7)}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="p-3 text-[10px] text-slate-400 border-t border-slate-100">
            {algo === 'bfs' ? '🔵 = BFS visited · 🟣 = currently processing' : '🟣 = DFS visited'}
            {' · '}V = {nodes.length}, E = {edges.length}
          </div>
        </div>
      )}

      {viewMode === 'matrix' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm overflow-auto">
          <h4 className="text-sm font-bold text-slate-800 mb-3">Adjacency Matrix ({nodes.length} × {nodes.length}) · O(V²) space</h4>
          <table className="border-collapse text-xs font-mono">
            <thead>
              <tr>
                <th className="border border-slate-300 px-2 py-1 bg-slate-100 text-slate-500"></th>
                {nodes.map((n) => <th key={n.id} className="border border-slate-300 px-2 py-1 bg-slate-100 text-slate-600">{n.id}</th>)}
              </tr>
            </thead>
            <tbody>
              {adjMatrix.map((row, i) => (
                <tr key={i}>
                  <th className="border border-slate-300 px-2 py-1 bg-slate-100 text-slate-600">{i}</th>
                  {row.map((cell, j) => (
                    <td key={j} className={`border border-slate-200 px-3 py-1 text-center ${cell ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-300'}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-slate-400 mt-2">1 = edge exists · 0 = no edge · Symmetric matrix (undirected graph)</p>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-3">Adjacency List · O(V + E) space</h4>
          <div className="space-y-2">
            {adj.map((neighbors, i) => (
              <div key={i} className="flex items-center gap-2 font-mono text-xs">
                <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 font-bold text-emerald-800 min-w-[80px] text-center">
                  {i}: {nodes[i].label.slice(0, 7)}
                </span>
                <span className="text-slate-400">→</span>
                {neighbors.length === 0
                  ? <span className="text-slate-400">NULL</span>
                  : neighbors.map((nb, j) => (
                    <React.Fragment key={nb}>
                      <span className="rounded border border-slate-300 px-2 py-1 text-slate-700">{nb}</span>
                      {j < neighbors.length - 1 && <span className="text-slate-400">→</span>}
                    </React.Fragment>
                  ))
                }
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-3">Compact representation · Memory efficient for sparse graphs · Edge query: O(degree)</p>
        </div>
      )}

      {/* Add/Remove Edge */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Modify Graph</h4>
        <div className="flex gap-2 items-center flex-wrap">
          <input value={addEdgeFrom} onChange={(e) => setAddEdgeFrom(e.target.value)}
            placeholder="Node A" type="number" min={0} max={nodes.length - 1}
            className="w-24 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <span className="text-slate-400 text-xs">↔</span>
          <input value={addEdgeTo} onChange={(e) => setAddEdgeTo(e.target.value)}
            placeholder="Node B" type="number" min={0} max={nodes.length - 1}
            className="w-24 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <button onClick={addEdge}
            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition">
            <Plus className="h-3 w-3" /> Add Edge
          </button>
          <button onClick={removeLastEdge}
            className="flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition">
            <Minus className="h-3 w-3" /> Remove Last Edge
          </button>
          <span className="text-xs text-slate-400">Total edges: {edges.length}</span>
        </div>
      </div>

      {/* Traversal result */}
      {traversalResult && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <h4 className="text-sm font-bold text-slate-800">{algo.toUpperCase()} Traversal Order from Node {startNode}</h4>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1">
              Starting from {nodes[startNode].label}, the {algo.toUpperCase()} search visited {traversalResult.order.length} connected facilities in {traversalResult.steps.length} steps.
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {traversalResult.order.map((nodeId, i) => (
              <div key={i} className={`flex items-center gap-1 rounded-lg border-2 px-2 py-1.5 text-xs font-semibold ${i < stepIdx + 1 ? (algo === 'bfs' ? 'bg-sky-50 border-sky-400 text-sky-800' : 'bg-purple-50 border-purple-400 text-purple-800')
                  : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                <span className="text-[9px] opacity-60">{i + 1}.</span>
                {nodeId}: {nodes[nodeId].label}
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
};
