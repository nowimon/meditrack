import React, { useState, useCallback } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Plus, Trash2, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { SinglyLinkedList } from '../dsa/linkedLists/singlyLinkedList';
import { DoublyLinkedList } from '../dsa/linkedLists/doublyLinkedList';
import { CircularLinkedList } from '../dsa/linkedLists/circularLinkedList';

type ListType = 'singly' | 'doubly' | 'circular';

const NODE_COLORS = [
  'bg-emerald-100 border-emerald-400 text-emerald-800',
  'bg-sky-100 border-sky-400 text-sky-800',
  'bg-amber-100 border-amber-400 text-amber-800',
  'bg-purple-100 border-purple-400 text-purple-800',
  'bg-rose-100 border-rose-400 text-rose-800',
];

export const LinkedListExplorer: React.FC = () => {
  const [listType, setListType] = useState<ListType>('singly');
  const [inputVal, setInputVal] = useState('');
  const [inputPos, setInputPos] = useState('0');
  const [nodes, setNodes] = useState<string[]>(['ICU-A', 'Path-Lab', 'OT-4', 'ER']);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [reverseView, setReverseView] = useState(false);

  const addLog = useCallback((msg: string) => {
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 20));
  }, []);

  const syncNodes = useCallback((list: SinglyLinkedList<string> | DoublyLinkedList<string> | CircularLinkedList<string>) => {
    setNodes(list.toArray());
  }, []);

  // Build fresh list each time from nodes
  const buildList = useCallback(() => {
    if (listType === 'singly') {
      const l = new SinglyLinkedList<string>();
      nodes.forEach((n) => l.insertAtEnd(n));
      return l;
    } else if (listType === 'doubly') {
      const l = new DoublyLinkedList<string>();
      nodes.forEach((n) => l.insertAtEnd(n));
      return l;
    } else {
      const l = new CircularLinkedList<string>();
      nodes.forEach((n) => l.insertAtEnd(n));
      return l;
    }
  }, [nodes, listType]);

  const insertAtHead = useCallback(() => {
    const val = inputVal.trim() || `Node-${nodes.length + 1}`;
    const list = buildList();
    list.insertAtBeginning(val);
    syncNodes(list);
    addLog(`insertAtBeginning("${val}") → O(1)`);
    setHighlighted(0);
    setTimeout(() => setHighlighted(null), 1200);
    setInputVal('');
  }, [inputVal, nodes, buildList, syncNodes, addLog]);

  const insertAtEnd = useCallback(() => {
    const val = inputVal.trim() || `Node-${nodes.length + 1}`;
    const list = buildList();
    list.insertAtEnd(val);
    syncNodes(list);
    addLog(`insertAtEnd("${val}") → O(1)`);
    setHighlighted(nodes.length);
    setTimeout(() => setHighlighted(null), 1200);
    setInputVal('');
  }, [inputVal, nodes, buildList, syncNodes, addLog]);

  const insertAtPos = useCallback(() => {
    const val = inputVal.trim() || `Node-${nodes.length + 1}`;
    const pos = parseInt(inputPos);
    if (isNaN(pos) || pos < 0 || pos > nodes.length) {
      addLog(`ERROR: Position ${pos} out of range [0..${nodes.length}]`);
      return;
    }
    const list = buildList();
    const ok = list.insertAtPosition(val, pos);
    if (ok) {
      syncNodes(list);
      addLog(`insertAtPosition("${val}", ${pos}) → O(${pos})`);
      setHighlighted(pos);
      setTimeout(() => setHighlighted(null), 1200);
    } else {
      addLog(`insertAtPosition failed — position ${pos} invalid`);
    }
    setInputVal('');
  }, [inputVal, inputPos, nodes, buildList, syncNodes, addLog]);

  const deleteAtHead = useCallback(() => {
    if (nodes.length === 0) { addLog('ERROR: List is empty'); return; }
    const list = buildList();
    const removed = list.deleteAtBeginning();
    syncNodes(list);
    addLog(`deleteAtBeginning() removed "${removed}" → O(1)`);
  }, [nodes, buildList, syncNodes, addLog]);

  const deleteAtEnd = useCallback(() => {
    if (nodes.length === 0) { addLog('ERROR: List is empty'); return; }
    const list = buildList();
    const removed = list.deleteAtEnd();
    const complexity = listType === 'singly' ? 'O(n)' : 'O(1)';
    syncNodes(list);
    addLog(`deleteAtEnd() removed "${removed}" → ${complexity} (${listType})`);
  }, [nodes, listType, buildList, syncNodes, addLog]);

  const resetList = useCallback(() => {
    setNodes(['ICU-A', 'Path-Lab', 'OT-4', 'ER']);
    setLog([]);
    setHighlighted(null);
    addLog('List reset to default 4 nodes');
  }, [addLog]);

  const displayNodes = reverseView && listType === 'doubly' ? [...nodes].reverse() : nodes;
  const displayIndices = reverseView && listType === 'doubly'
    ? nodes.map((_, i) => nodes.length - 1 - i)
    : nodes.map((_, i) => i);

  return (
    <PageShell
      title="Linked Lists Explorer"
      subtitle="Interactive SLL, DLL, and CLL with real-time pointer visualization and operation logging"
      complexity="Head Insert/Delete: O(1) · Tail Delete SLL: O(n) · Tail Delete DLL: O(1) · Search: O(n)"
    >
      {/* Type Selector */}
      <div className="flex gap-2 flex-wrap">
        {(['singly', 'doubly', 'circular'] as ListType[]).map((t) => (
          <button key={t} onClick={() => { setListType(t); setReverseView(false); }}
            className={`rounded-xl px-4 py-2 text-xs font-semibold border transition ${
              listType === t
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-300 hover:border-emerald-400'
            }`}>
            {t === 'singly' ? '→ Singly' : t === 'doubly' ? '⇄ Doubly' : '↻ Circular'} Linked List
          </button>
        ))}
      </div>

      {/* Node Visualization */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 flex-wrap justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            {listType === 'circular' ? 'Circular' : listType === 'doubly' ? 'Doubly' : 'Singly'} Linked List
            <span className="ml-2 font-normal text-slate-400 text-xs">({nodes.length} nodes)</span>
          </h3>
          {listType === 'doubly' && (
            <button onClick={() => setReverseView(!reverseView)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
              {reverseView ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
              {reverseView ? 'Forward View' : 'Reverse View (DLL prev →)'}
            </button>
          )}
        </div>

        {nodes.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">List is empty. Add a node below.</div>
        ) : (
          <div className="flex items-center gap-1 flex-wrap">
            {/* HEAD label */}
            <div className="text-[10px] font-bold text-emerald-600 mr-1">HEAD</div>
            {displayNodes.map((val, i) => {
              const actualIdx = displayIndices[i];
              const color = NODE_COLORS[actualIdx % NODE_COLORS.length];
              const isHL = highlighted === actualIdx;
              return (
                <React.Fragment key={actualIdx}>
                  <div className={`flex flex-col items-center rounded-xl border-2 px-3 py-2 text-xs font-mono font-bold transition-all duration-300 ${color} ${isHL ? 'ring-4 ring-amber-300 scale-110' : ''}`}>
                    <span className="text-[9px] font-normal opacity-60">[{actualIdx}]</span>
                    {val}
                  </div>
                  {i < displayNodes.length - 1 && (
                    <div className="text-slate-400 text-sm font-bold mx-0.5">
                      {listType === 'doubly' ? (reverseView ? '←' : '⇄') : '→'}
                    </div>
                  )}
                  {i === displayNodes.length - 1 && listType === 'circular' && (
                    <div className="text-slate-400 text-xs ml-1">↻ HEAD</div>
                  )}
                  {i === displayNodes.length - 1 && listType !== 'circular' && (
                    <div className="text-slate-400 text-xs ml-1">→ NULL</div>
                  )}
                </React.Fragment>
              );
            })}
            {/* TAIL label */}
            {listType !== 'circular' && (
              <div className="text-[10px] font-bold text-rose-500 ml-1">TAIL</div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Insert Operations</h4>
          <div className="flex gap-2">
            <input value={inputVal} onChange={(e) => setInputVal(e.target.value)}
              placeholder="Node value…"
              className="flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <input value={inputPos} onChange={(e) => setInputPos(e.target.value)}
              placeholder="Position"
              className="w-20 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={insertAtHead}
              className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition">
              <Plus className="h-3 w-3" /> At Head <span className="opacity-70">(O(1))</span>
            </button>
            <button onClick={insertAtEnd}
              className="flex items-center gap-1 rounded-lg bg-sky-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 transition">
              <Plus className="h-3 w-3" /> At Tail
            </button>
            <button onClick={insertAtPos}
              className="flex items-center gap-1 rounded-lg bg-purple-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-purple-700 transition">
              <Plus className="h-3 w-3" /> At Pos
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Delete & Reset</h4>
          <div className="flex gap-2 flex-wrap">
            <button onClick={deleteAtHead}
              className="flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition">
              <Trash2 className="h-3 w-3" /> Del Head <span className="opacity-70">(O(1))</span>
            </button>
            <button onClick={deleteAtEnd}
              className="flex items-center gap-1 rounded-lg bg-amber-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition">
              <Trash2 className="h-3 w-3" /> Del Tail {listType === 'singly' ? <span className="opacity-70">(O(n))</span> : <span className="opacity-70">(O(1))</span>}
            </button>
            <button onClick={resetList}
              className="flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-100 p-2.5 text-xs text-slate-600">
            <span className="font-semibold">DLL advantage: </span>
            Tail delete is O(1) via <code className="font-mono text-emerald-700">tail.prev</code> pointer.
            SLL tail delete is O(n) — no backward pointer.
          </div>
        </div>
      </div>

      {/* Operation Log */}
      {log.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Operation Log</h4>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {log.map((entry, i) => (
              <div key={i} className={`text-xs font-mono px-2 py-1 rounded ${i === 0 ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500'}`}>
                {entry}
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
};
