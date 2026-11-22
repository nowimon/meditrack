import React from 'react';
import { Plus, Minus, Eye, RotateCcw, Download, Clock, Info } from 'lucide-react';

export interface PriorityQueuePanelProps {
  pqItems: { item: string; priority: number }[];
  peekedItem: string | null;
  pqInput: string;
  setPqInput: (val: string) => void;
  pqPriority: number;
  setPqPriority: (val: number) => void;
  pqEnqueue: () => void;
  pqDequeue: () => void;
  pqPeek: () => void;
  pqReset: () => void;
  loadPqDemo: () => void;
  pqLog: string[];
}

export const PriorityQueuePanel: React.FC<PriorityQueuePanelProps> = ({
  pqItems,
  peekedItem,
  pqInput,
  setPqInput,
  pqPriority,
  setPqPriority,
  pqEnqueue,
  pqDequeue,
  pqPeek,
  pqReset,
  loadPqDemo,
  pqLog,
}) => {
  return (
    <div className="space-y-4">
      {/* "How to Use" & MediTrack Connection */}
      <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 text-xs text-slate-700 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
          <Info className="h-4 w-4 text-emerald-600" />
          <span>How Priority Queue Works & Why MediTrack Uses It</span>
        </div>
        <p className="leading-relaxed text-slate-600">
          A <strong>Priority Queue (Max-Heap)</strong> ensures the item with the <strong>Highest Priority (P4)</strong> is always at the top and dequeued first, regardless of when it arrived. Items with identical priorities are resolved fairly using <strong>FIFO order</strong>.
        </p>
        <p className="mt-1 leading-relaxed text-emerald-800 font-medium">
          🏥 <strong>MediTrack Real-World Use:</strong> Dispatches <strong>Emergency Hazardous Biohazards</strong> (Infectious Anatomical Waste, Cytotoxic chemotherapy vials, and Sharps) before general low-risk waste.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Visualizer Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Biohazard Emergency Priority Heap</h3>
                <p className="text-[11px] text-slate-400">Max-Heap · Highest priority extracted first</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                {pqItems.length} Triage Requests
              </span>
            </div>

            {/* Priority Queue Items */}
            <div className="min-h-[220px] flex flex-col justify-center">
              {pqItems.length === 0 ? (
                <div className="text-center text-sm text-slate-400 py-10 border-2 border-dashed border-slate-200 rounded-xl">
                  Priority queue is empty. Click <strong>Load Demo Data</strong> or <strong>enqueue()</strong>.
                </div>
              ) : (
                <div className="space-y-2">
                  {pqItems.map((entry, i) => {
                    const isTop = i === 0;
                    const isPeeked = peekedItem === entry.item;
                    const prioColor =
                      entry.priority === 4
                        ? 'bg-amber-50 border-amber-400 text-amber-900'
                        : entry.priority === 3
                        ? 'bg-rose-50 border-rose-400 text-rose-900'
                        : entry.priority === 2
                        ? 'bg-slate-50 border-slate-300 text-slate-700'
                        : 'bg-sky-50 border-sky-300 text-sky-800';

                    const badgeColor =
                      entry.priority === 4
                        ? 'bg-amber-500 text-white'
                        : entry.priority === 3
                        ? 'bg-rose-500 text-white'
                        : entry.priority === 2
                        ? 'bg-slate-600 text-white'
                        : 'bg-sky-600 text-white';

                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold border-2 transition-all ${
                          isPeeked
                            ? 'bg-amber-100 border-amber-500 text-amber-900 ring-2 ring-amber-300 scale-[1.02]'
                            : prioColor
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isTop && (
                            <span className="rounded bg-emerald-700 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                              NEXT TO DISPATCH →
                            </span>
                          )}
                          <span>{entry.item}</span>
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeColor}`}>
                          P{entry.priority}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>P4 = High Biohazard (Yellow)</span>
            <span>P3 = Infectious (Red)</span>
            <span>P2 = Sharps (White)</span>
            <span>P1 = Low (Blue)</span>
          </div>
        </div>

        {/* Controls & Log */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700">Enter Hazardous Waste Item</label>
              <button
                onClick={loadPqDemo}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
              >
                <Download className="h-3 w-3" /> Load Demo Data
              </button>
            </div>

            <input
              value={pqInput}
              onChange={(e) => setPqInput(e.target.value)}
              placeholder="e.g. ICU Viral Cultures or Surgery Needles"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Priority Level: P{pqPriority}</span>
                <span className="text-emerald-700 font-bold">
                  {pqPriority === 4
                    ? 'P4 - Critical / Yellow (Highest)'
                    : pqPriority === 3
                    ? 'P3 - Red Contaminated'
                    : pqPriority === 2
                    ? 'P2 - White Sharps'
                    : 'P1 - Blue Glassware (Lowest)'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={4}
                value={pqPriority}
                onChange={(e) => setPqPriority(parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={pqEnqueue}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition active:scale-95"
                title="Enqueue: Insert with priority into max-heap"
              >
                <Plus className="h-3.5 w-3.5" /> enqueue() [Add with Priority]
              </button>

              <button
                onClick={pqDequeue}
                disabled={pqItems.length === 0}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-40 transition active:scale-95"
                title="Dequeue: Dispatch highest priority request"
              >
                <Minus className="h-3.5 w-3.5" /> dequeue() [Dispatch Highest]
              </button>

              <button
                onClick={pqPeek}
                disabled={pqItems.length === 0}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-600 disabled:opacity-40 transition active:scale-95"
                title="Peek: Check highest priority without removing"
              >
                <Eye className="h-3.5 w-3.5" /> peek() [Inspect Highest]
              </button>

              <button
                onClick={pqReset}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                title="Reset priority queue"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset Queue
              </button>
            </div>
          </div>

          {/* Operation History Log */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Priority Queue Operation History
              </span>
              <span className="text-[10px] text-slate-400">Latest actions at top</span>
            </div>
            <div className="max-h-44 overflow-y-auto space-y-1 rounded-xl bg-slate-50 p-2 border border-slate-100">
              {pqLog.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No actions executed yet</p>
              ) : (
                pqLog.map((e, i) => (
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
