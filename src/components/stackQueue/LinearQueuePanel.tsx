import React from 'react';
import { Plus, Minus, Eye, RotateCcw, Download, Clock, Info } from 'lucide-react';

export interface LinearQueuePanelProps {
  lqItems: string[];
  peekedItem: string | null;
  lqInput: string;
  setLqInput: (val: string) => void;
  lqEnqueue: () => void;
  lqDequeue: () => void;
  lqPeek: () => void;
  lqReset: () => void;
  loadLqDemo: () => void;
  lqLog: string[];
}

export const LinearQueuePanel: React.FC<LinearQueuePanelProps> = ({
  lqItems,
  peekedItem,
  lqInput,
  setLqInput,
  lqEnqueue,
  lqDequeue,
  lqPeek,
  lqReset,
  loadLqDemo,
  lqLog,
}) => {
  return (
    <div className="space-y-4">
      {/* "How to Use" & MediTrack Connection */}
      <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 text-xs text-slate-700 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
          <Info className="h-4 w-4 text-emerald-600" />
          <span>How Linear Queue Works & Why MediTrack Uses It</span>
        </div>
        <p className="leading-relaxed text-slate-600">
          A <strong>Linear Queue</strong> is a <strong>FIFO (First-In, First-Out)</strong> data structure — requests enter at the <strong>REAR</strong> and leave from the <strong>FRONT</strong> (like a ticket counter queue).
        </p>
        <p className="mt-1 leading-relaxed text-emerald-800 font-medium">
          🏥 <strong>MediTrack Real-World Use:</strong> Manages <strong>Standard Routine Waste Pickups</strong>. Hospital wards that submit requests earlier are visited earlier by the collection truck.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Visualizer Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Routine Pickup Queue (FIFO)</h3>
                <p className="text-[11px] text-slate-400">First-In First-Out · Serviced in order of submission</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                {lqItems.length} Waiting Requests
              </span>
            </div>

            {/* Queue Elements */}
            <div className="min-h-[200px] flex flex-col justify-center">
              {lqItems.length === 0 ? (
                <div className="text-center text-sm text-slate-400 py-10 border-2 border-dashed border-slate-200 rounded-xl">
                  Queue is currently empty. Click <strong>Load Demo Data</strong> or <strong>enqueue()</strong>.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {lqItems.map((item, i) => {
                    const isFront = i === 0;
                    const isRear = i === lqItems.length - 1 && i !== 0;
                    const isPeeked = peekedItem === item;

                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold border-2 transition-all ${
                          isPeeked
                            ? 'bg-amber-100 border-amber-500 text-amber-900 ring-2 ring-amber-300'
                            : isFront
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isFront && (
                            <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                              FRONT (Next Pickup)
                            </span>
                          )}
                          {isRear && (
                            <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                              REAR (Last In)
                            </span>
                          )}
                          <span>{item}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Position #{i + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
            <span>dequeue() from FRONT ←</span>
            <span>← enqueue() to REAR</span>
          </div>
        </div>

        {/* Controls & Log */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700">Enter Waste Pickup Request</label>
              <button
                onClick={loadLqDemo}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
              >
                <Download className="h-3 w-3" /> Load Demo Data
              </button>
            </div>

            <input
              value={lqInput}
              onChange={(e) => setLqInput(e.target.value)}
              placeholder="e.g. Ward 4 General Solid Waste (or leave blank)"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={lqEnqueue}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition active:scale-95"
                title="Enqueue: Add request to the end of line"
              >
                <Plus className="h-3.5 w-3.5" /> enqueue() [Join Line]
              </button>

              <button
                onClick={lqDequeue}
                disabled={lqItems.length === 0}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-40 transition active:scale-95"
                title="Dequeue: Service the first request in line"
              >
                <Minus className="h-3.5 w-3.5" /> dequeue() [Service First]
              </button>

              <button
                onClick={lqPeek}
                disabled={lqItems.length === 0}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-600 disabled:opacity-40 transition active:scale-95"
                title="Peek: Check who is next in line"
              >
                <Eye className="h-3.5 w-3.5" /> peek() [Inspect Front]
              </button>

              <button
                onClick={lqReset}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                title="Reset linear queue"
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
                Linear Queue Operation History
              </span>
              <span className="text-[10px] text-slate-400">Latest actions at top</span>
            </div>
            <div className="max-h-44 overflow-y-auto space-y-1 rounded-xl bg-slate-50 p-2 border border-slate-100">
              {lqLog.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No actions executed yet</p>
              ) : (
                lqLog.map((e, i) => (
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
