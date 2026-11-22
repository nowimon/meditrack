import React, { useState, useCallback, useMemo } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Plus, Trash2, Search, RotateCcw, List } from 'lucide-react';
import {
  bstInsert,
  bstDelete,
  bstSearch,
  inorder,
  preorder,
  postorder,
  bstHeight,
} from '../dsa/trees/bst';
import type { BSTNode } from '../dsa/trees/bst';
import { layoutTree } from '../dsa/trees/bstLayout';
import type { NodePos } from '../dsa/trees/bstLayout';

const SAMPLE_FACILITIES = [
  { key: 50, label: 'Apex Memorial' },
  { key: 30, label: 'City Care' },
  { key: 70, label: 'St. Jude' },
  { key: 20, label: 'LifeSpring' },
  { key: 40, label: 'Metro Trauma' },
  { key: 60, label: 'Green Valley' },
  { key: 80, label: 'UrbanMed' },
];

export const BSTExplorer: React.FC = () => {
  const [root, setRoot] = useState<BSTNode | null>(() => {
    let r: BSTNode | null = null;
    SAMPLE_FACILITIES.forEach(({ key, label }) => { r = bstInsert(r, key, label); });
    return r;
  });
  const [keyInput, setKeyInput] = useState('');
  const [labelInput, setLabelInput] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [searchPath, setSearchPath] = useState<number[]>([]);
  const [searchFound, setSearchFound] = useState<boolean | null>(null);
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder'>('inorder');
  const [log, setLog] = useState<string[]>([]);

  const addLog = useCallback((msg: string) => {
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 20));
  }, []);

  const handleInsert = useCallback(() => {
    const key = parseInt(keyInput);
    if (isNaN(key)) { addLog('ERROR: Key must be a number'); return; }
    const label = labelInput.trim() || `Facility-${key}`;
    setRoot((r) => bstInsert(r, key, label));
    setSearchPath([]);
    setSearchFound(null);
    addLog(`insert(key=${key}, label="${label}")`);
    setKeyInput('');
    setLabelInput('');
  }, [keyInput, labelInput, addLog]);

  const handleDelete = useCallback(() => {
    const key = parseInt(keyInput);
    if (isNaN(key)) { addLog('ERROR: Key must be a number'); return; }
    setRoot((r) => bstDelete(r, key));
    setSearchPath([]);
    setSearchFound(null);
    addLog(`delete(key=${key})`);
    setKeyInput('');
  }, [keyInput, addLog]);

  const handleSearch = useCallback(() => {
    const key = parseInt(searchKey);
    if (isNaN(key)) { addLog('ERROR: Search key must be a number'); return; }
    const { found, path } = bstSearch(root, key);
    setSearchPath(path);
    setSearchFound(found);
    addLog(`search(${key}) → ${found ? `FOUND after ${path.length} step(s)` : `NOT FOUND, path: [${path.join('→')}]`}`);
  }, [root, searchKey, addLog]);

  const handleReset = useCallback(() => {
    let r: BSTNode | null = null;
    SAMPLE_FACILITIES.forEach(({ key, label }) => { r = bstInsert(r, key, label); });
    setRoot(r);
    setSearchPath([]);
    setSearchFound(null);
    setLog([]);
    addLog('BST reset to 7 sample facility nodes');
  }, [addLog]);

  // Layout
  const { nodes, edges } = useMemo(() => {
    const n: NodePos[] = [];
    const e: [number, number, number, number][] = [];
    layoutTree(root, 240, 40, 120, n, e);
    return { nodes: n, edges: e };
  }, [root]);

  const traversalResult = useMemo(() => {
    switch (traversalType) {
      case 'inorder': return inorder(root);
      case 'preorder': return preorder(root);
      case 'postorder': return postorder(root);
    }
  }, [root, traversalType]);

  return (
    <PageShell
      title="BST Facility Index"
      subtitle="Interactive Binary Search Tree with insert, search, delete, and all three DFS traversals"
      complexity="Search/Insert/Delete: O(h) · O(log n) avg · O(n) worst · Traversals: O(n)"
    >
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Insert / Delete Node</h4>
          <div className="flex gap-2">
            <input value={keyInput} onChange={(e) => setKeyInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
              placeholder="Key (number)" type="number"
              className="w-28 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <input value={labelInput} onChange={(e) => setLabelInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
              placeholder="Label (optional)"
              className="flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleInsert} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition">
              <Plus className="h-3 w-3" /> Insert
            </button>
            <button onClick={handleDelete} className="flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition">
              <Trash2 className="h-3 w-3" /> Delete
            </button>
            <button onClick={handleReset} className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Search Node</h4>
          <div className="flex gap-2">
            <input value={searchKey} onChange={(e) => setSearchKey(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Key to search" type="number"
              className="flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button onClick={handleSearch} className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition">
              <Search className="h-3 w-3" /> Search
            </button>
          </div>
          {searchFound !== null && (
            <div className={`rounded-lg px-3 py-2 text-xs font-semibold ${searchFound ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-700'}`}>
              {searchFound ? `✓ Found! Path: ${searchPath.join(' → ')}` : `✗ Not found. Searched: ${searchPath.join(' → ')}`}
            </div>
          )}
          <div className="text-[10px] text-slate-400">
            Height: {bstHeight(root)} · Nodes: {nodes.length}
          </div>
        </div>
      </div>

      {/* SVG Tree Visualization */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-auto">
        <div className="p-2">
          {root === null ? (
            <div className="py-16 text-center text-sm text-slate-400">BST is empty. Insert nodes above.</div>
          ) : (
            <svg width="480" height={Math.max(160, bstHeight(root) * 70 + 20)} style={{ minWidth: '480px' }}>
              {edges.map(([x1, y1, x2, y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cbd5e1" strokeWidth="2" />
              ))}
              {nodes.map(({ key, label, x, y }) => {
                const isInPath = searchPath.includes(key);
                const isFound = searchFound && key === searchPath[searchPath.length - 1];
                return (
                  <g key={key} transform={`translate(${x},${y})`}>
                    <circle r={22}
                      fill={isFound ? '#d1fae5' : isInPath ? '#fef3c7' : '#f1f5f9'}
                      stroke={isFound ? '#10b981' : isInPath ? '#f59e0b' : '#94a3b8'}
                      strokeWidth={isInPath ? 2.5 : 1.5} />
                    <text textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="bold" fill={isInPath ? '#78350f' : '#1e293b'} y={-4}>{key}</text>
                    <text textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="#64748b" y={8} >{label.slice(0, 8)}</text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
        {searchPath.length > 0 && (
          <div className="px-4 pb-3 text-[10px] text-slate-400">
            🟡 = search path · 🟢 = found node
          </div>
        )}
      </div>

      {/* Traversals */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <List className="h-4 w-4 text-indigo-500" />
          <h4 className="text-sm font-bold text-slate-800">DFS Traversals</h4>
          <div className="flex gap-1 ml-auto">
            {(['inorder', 'preorder', 'postorder'] as const).map((t) => (
              <button key={t} onClick={() => setTraversalType(t)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${traversalType === t ? 'bg-indigo-600 text-white' : 'border border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {traversalResult.map((item, i) => (
            <span key={i} className="rounded-lg bg-indigo-50 border border-indigo-200 px-2 py-1 text-xs font-mono text-indigo-800">
              {item}
            </span>
          ))}
        </div>
        {traversalType === 'inorder' && (
          <p className="text-[10px] text-slate-400 mt-2">✓ Inorder traversal of a BST always produces a sorted sequence (keys in ascending order).</p>
        )}
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <h4 className="text-xs font-bold text-slate-700 mb-2">Operation Log</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {log.map((e, i) => <div key={i} className={`text-xs font-mono ${i === 0 ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>{e}</div>)}
          </div>
        </div>
      )}
    </PageShell>
  );
};
