import React from 'react';
import { Plus, Minus, Eye, RotateCcw, Download, Clock, Info } from 'lucide-react';

export interface StackPanelProps {
  capacity: number;
  stackItems: string[];
  peekedItem: string | null;
  stackInput: string;
  setStackInput: (val: string) => void;
  stackPush: () => void;
  stackPop: () => void;
  stackPeek: () => void;
  stackReset: () => void;
  loadStackDemo: () => void;
  stackLog: string[];
}

export const StackPanel: React.FC<StackPanelProps> = ({
  capacity,
  stackItems,
  peekedItem,
  stackInput,
  setStackInput,
  stackPush,
  stackPop,
  stackPeek,
  stackReset,
  loadStackDemo,
  stackLog,
}) => {
  return (
    <div className="space-y-4">
      {/* "How to Use" & MediTrack Connection */}
      <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 text-xs text-slate-700 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
          <Info className="h-4 w-4 text-emerald-600" />
          <span>How Stack Works & Why MediTrack Uses It</span>
        </div>
        <p className="leading-relaxed text-slate-600">
          A <strong>Stack</strong> is a <strong>LIFO (Last-In, First-Out)</strong> data structure — the last item added is always the first one to be removed (like a stack of clean plates).
        </p>
        <p className="mt-1 leading-relaxed text-emerald-800 font-medium">
          🏥 <strong>MediTrack Real-World Use:</strong> Stores the <strong>Undo / Rollback History</strong> of operator actions. If a dispatcher accidentally marks a waste batch or dispatches a truck, clicking <strong>Pop</strong> reverts the most recent action first.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Visualizer Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Undo Action Stack</h3>
                <p className="text-[11px] text-slate-400">LIFO Order · Top of stack is undone first</p>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  stackItems.length === capacity
                    ? 'bg-rose-100 text-rose-700 font-bold border border-rose-200'
                    : stackItems.length === 0
                    ? 'bg-slate-100 text-slate-500'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {stackItems.length} / {capacity} Items {stackItems.length === capacity && '(FULL)'}
              </span>
            </div>

            {/* Stack Elements (Top is at the top) */}
            <div className="space-y-1.5 min-h-[220px] flex flex-col justify-end">
              {stackItems.length === 0 ? (
                <div className="text-center text-sm text-slate-400 py-12 border-2 border-dashed border-slate-200 rounded-xl">
                  Stack is empty. Click <strong>Load Demo Data</strong> or <strong>push()</strong> to add actions.
                </div>
              ) : (
                [...stackItems].reverse().map((item, i) => {
                  const isTop = i === 0;
                  const isPeeked = peekedItem === item;
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold border-2 transition-all ${
                        isPeeked
                          ? 'bg-amber-100 border-amber-500 text-amber-900 ring-2 ring-amber-300 scale-[1.02]'
                          : isTop
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isTop && (
                          <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                            TOP (Next Pop)
                          </span>
                        )}
                        {isPeeked && (
                          <span className="rounded bg-amber-600 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                            PEEKED
                          </span>
                        )}
                        <span>{item}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Level #{stackItems.length - i}
                      </span>
                    </div>
                  );
                })
              )}
              <div className="border-t-4 border-slate-400 mt-2 text-center text-[10px] font-mono text-slate-500 pt-1">
                ⊥ STACK BASE (First item added stays here)
              </div>
            </div>
          </div>

          {stackItems.length === capacity && (
            <div className="mt-3 rounded-lg bg-rose-50 p-2 text-center text-[11px] font-semibold text-rose-700 border border-rose-200">
              ⚠️ Stack Overflow condition: Bounded capacity reached!
            </div>
          )}
        </div>

        {/* Controls & Log */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700">Enter Action / Item</label>
              <button
                onClick={loadStackDemo}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
              >
                <Download className="h-3 w-3" /> Load Demo Data
              </button>
            </div>

            <input
              value={stackInput}
              onChange={(e) => setStackInput(e.target.value)}
              placeholder="e.g. Dispatched Van #3 to ICU Ward (or leave blank)"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={stackPush}
                disabled={stackItems.length >= capacity}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-40 transition active:scale-95"
                title="Push: Add item to the top of stack"
              >
                <Plus className="h-3.5 w-3.5" /> push() [Add to Top]
              </button>

              <button
                onClick={stackPop}
                disabled={stackItems.length === 0}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-40 transition active:scale-95"
                title="Pop: Remove and return top item"
              >
                <Minus className="h-3.5 w-3.5" /> pop() [Undo Top]
              </button>

              <button
                onClick={stackPeek}
                disabled={stackItems.length === 0}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-600 disabled:opacity-40 transition active:scale-95"
                title="Peek: Inspect top item without removing"
              >
                <Eye className="h-3.5 w-3.5" /> peek() [Inspect Top]
              </button>

              <button
                onClick={stackReset}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                title="Clear entire stack"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset Stack
              </button>
            </div>
          </div>

          {/* Operation History Log */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Stack Operation History
              </span>
              <span className="text-[10px] text-slate-400">Latest actions at top</span>
            </div>
            <div className="max-h-44 overflow-y-auto space-y-1 rounded-xl bg-slate-50 p-2 border border-slate-100">
              {stackLog.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No actions executed yet</p>
              ) : (
                stackLog.map((e, i) => (
                  <div
                    key={i}
                    className={`text-xs font-mono py-0.5 px-1.5 rounded ${
                      i === 0
                        ? 'bg-emerald-100/70 text-emerald-900 font-bold'
                        : 'text-slate-600'
                    }`}
                  >
                    {e}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
