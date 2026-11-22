import React from 'react';
import { Plus, Minus, Eye, RotateCcw, Download, Clock, Info } from 'lucide-react';

export interface CircularQueuePanelProps {
  capacity: number;
  cqItems: string[];
  cqRawBuffer: (string | null)[];
  cqFront: number;
  cqRear: number;
  peekedItem: string | null;
  cqInput: string;
  setCqInput: (val: string) => void;
  cqEnqueue: () => void;
  cqDequeue: () => void;
  cqPeek: () => void;
  cqReset: () => void;
  loadCqDemo: () => void;
  cqLog: string[];
}

export const CircularQueuePanel: React.FC<CircularQueuePanelProps> = ({
  capacity,
  cqItems,
  cqRawBuffer,
  cqFront,
  cqRear,
  peekedItem,
  cqInput,
  setCqInput,
  cqEnqueue,
  cqDequeue,
  cqPeek,
  cqReset,
  loadCqDemo,
  cqLog,
}) => {
  return (
    <div className="space-y-4">
      {/* "How to Use" & MediTrack Connection */}
      <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 text-xs text-slate-700 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
          <Info className="h-4 w-4 text-emerald-600" />
          <span>How Circular Queue Works & Why MediTrack Uses It</span>
        </div>
        <p className="leading-relaxed text-slate-600">
          A <strong>Circular Queue (Ring Buffer)</strong> wraps around from the end of the array back to index 0 using modulo arithmetic: <code>(rear + 1) % Capacity</code>. It eliminates memory wastage from standard array shifts.
        </p>
        <p className="mt-1 leading-relaxed text-emerald-800 font-medium">
          🏥 <strong>MediTrack Real-World Use:</strong> Models a <strong>Mobile Waste Van with 8 Fixed Compartments</strong>. As the van visits wards and unloads at the central incinerator, slots are continuously reused in a circular ring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Visualizer Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Van Collection Ring Buffer</h3>
                <p className="text-[11px] text-slate-400">Fixed Capacity: {capacity} Bins · Circular Wrap-Around</p>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  cqItems.length === capacity
                    ? 'bg-rose-100 text-rose-700 font-bold border border-rose-200'
                    : cqItems.length === 0
                    ? 'bg-slate-100 text-slate-500'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {cqItems.length} / {capacity} Bins Loaded {cqItems.length === capacity && '(FULL)'}
              </span>
            </div>

            {/* 8-Slot Ring Buffer Grid */}
            <div className="grid grid-cols-4 gap-2.5 my-3">
              {cqRawBuffer.map((item, i) => {
                const isFront = cqItems.length > 0 && cqFront === i;
                const isRear = cqItems.length > 0 && cqRear === i;
                const isOccupied = item !== null;
                const isPeeked = item !== null && peekedItem === item;

                return (
                  <div
                    key={i}
                    className={`rounded-xl border-2 p-2.5 text-center transition-all ${
                      isPeeked
                        ? 'bg-amber-100 border-amber-500 text-amber-900 ring-2 ring-amber-300'
                        : isOccupied
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold shadow-sm'
                        : 'bg-slate-50 border-dashed border-slate-300 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono mb-1">
                      <span className="font-bold text-slate-500">Slot [{i}]</span>
                      {isFront && (
                        <span className="rounded bg-emerald-600 px-1 text-white font-bold text-[8px]">
                          FRONT
                        </span>
                      )}
                      {isRear && !isFront && (
                        <span className="rounded bg-rose-600 px-1 text-white font-bold text-[8px]">
                          REAR
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-medium truncate" title={item ?? 'Empty slot'}>
                      {item ?? '— Empty —'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl bg-slate-50 p-2.5 text-[11px] text-slate-600 border border-slate-100 flex items-center justify-between">
              <span>Front Pointer: <strong>[{cqFront}]</strong></span>
              <span>Rear Pointer: <strong>[{cqRear === -1 ? 'None' : cqRear}]</strong></span>
              <span>Formula: <code>(rear + 1) % {capacity}</code></span>
            </div>
          </div>

          {cqItems.length === capacity && (
            <div className="mt-3 rounded-lg bg-rose-50 p-2 text-center text-[11px] font-semibold text-rose-700 border border-rose-200">
              ⚠️ Circular Queue Overflow: Van compartments completely full!
            </div>
          )}
        </div>

        {/* Controls & Log */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700">Enter Van Waste Bin</label>
              <button
                onClick={loadCqDemo}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
              >
                <Download className="h-3 w-3" /> Load Demo Data
              </button>
            </div>

            <input
              value={cqInput}
              onChange={(e) => setCqInput(e.target.value)}
              placeholder="e.g. ICU Sharps Bin #2 (or leave blank)"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={cqEnqueue}
                disabled={cqItems.length >= capacity}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-40 transition active:scale-95"
                title="Enqueue: Load bin into van compartment"
              >
                <Plus className="h-3.5 w-3.5" /> enqueue() [Load Bin]
              </button>

              <button
                onClick={cqDequeue}
                disabled={cqItems.length === 0}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-40 transition active:scale-95"
                title="Dequeue: Unload front bin from van"
              >
                <Minus className="h-3.5 w-3.5" /> dequeue() [Unload Front]
              </button>

              <button
                onClick={cqPeek}
                disabled={cqItems.length === 0}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-600 disabled:opacity-40 transition active:scale-95"
                title="Peek: Check next bin to be unloaded"
              >
                <Eye className="h-3.5 w-3.5" /> peek() [Inspect Front]
              </button>

              <button
                onClick={cqReset}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                title="Clear van buffer"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset Van
              </button>
            </div>
          </div>

          {/* Operation History Log */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Circular Buffer Operation History
              </span>
              <span className="text-[10px] text-slate-400">Latest actions at top</span>
            </div>
            <div className="max-h-44 overflow-y-auto space-y-1 rounded-xl bg-slate-50 p-2 border border-slate-100">
              {cqLog.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No actions executed yet</p>
              ) : (
                cqLog.map((e, i) => (
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
