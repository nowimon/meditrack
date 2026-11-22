import React, { useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import type { AlgorithmStep } from '../../dsa/types';
import type { WasteRequest } from '../../models/WasteRequest';

export type SortAlgo = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';
export type SearchField = 'id' | 'urgencyScore' | 'wasteWeightKg';

export interface SortPanelProps {
  sortSource: WasteRequest[];
  sortAlgo: SortAlgo;
  setSortAlgo: (algo: SortAlgo) => void;
  sortField: SearchField;
  setSortField: (field: SearchField) => void;
  sortSteps: AlgorithmStep<WasteRequest[]>[];
  sortStepIdx: number;
  setSortStepIdx: React.Dispatch<React.SetStateAction<number>>;
  sortResult: { comparisons: number; swaps: number; timeMs: number } | null;
  hasRunSort: boolean;
  setHasRunSort: (val: boolean) => void;
  setSortSteps: (steps: AlgorithmStep<WasteRequest[]>[]) => void;
  isPlayingSort: boolean;
  setIsPlayingSort: (val: boolean) => void;
  playSpeedMs: number;
  setPlaySpeedMs: (ms: number) => void;
  runSort: () => void;
  formatVal: (val: number | string | undefined) => string;
  calculateBarHeight: (val: number, maxVal: number) => number;
  sortAlgos: { value: SortAlgo; label: string; complexity: string; desc: string }[];
  searchFields: { value: SearchField; label: string }[];
}

export const SortPanel: React.FC<SortPanelProps> = ({
  sortSource,
  sortAlgo,
  setSortAlgo,
  sortField,
  setSortField,
  sortSteps,
  sortStepIdx,
  setSortStepIdx,
  sortResult,
  hasRunSort,
  setHasRunSort,
  setSortSteps,
  isPlayingSort,
  setIsPlayingSort,
  playSpeedMs,
  setPlaySpeedMs,
  runSort,
  formatVal,
  calculateBarHeight,
  sortAlgos,
  searchFields,
}) => {
  const currentSortStep = sortSteps[sortStepIdx];
  const isSortFinished = hasRunSort && sortStepIdx === sortSteps.length - 1;

  const maxSortVal = useMemo(() => {
    if (sortSource.length === 0) return 100;
    return Math.max(...sortSource.map((r) => Number(r[sortField]) || 1), 1);
  }, [sortSource, sortField]);

  const isCurrentStepSwap = useMemo(() => {
    if (!currentSortStep) return false;
    const desc = currentSortStep.description.toLowerCase();
    return (
      desc.includes('swap') ||
      desc.includes('shift') ||
      desc.includes('inserted') ||
      desc.includes('merged result')
    );
  }, [currentSortStep]);

  return (
    <div className="space-y-5">
      {/* Controls Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap gap-4 items-end justify-between">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Sorting Algorithm</label>
            <select
              value={sortAlgo}
              onChange={(e) => {
                setSortAlgo(e.target.value as SortAlgo);
                setHasRunSort(false);
                setIsPlayingSort(false);
              }}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            >
              {sortAlgos.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label} — {a.complexity}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Sort Key (Bar Height)</label>
            <select
              value={sortField}
              onChange={(e) => {
                setSortField(e.target.value as SearchField);
                setHasRunSort(false);
                setIsPlayingSort(false);
              }}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            >
              {searchFields.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={runSort}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-200 hover:from-emerald-700 hover:to-teal-700 transition active:scale-95"
          >
            <Play className="h-4 w-4 fill-white" /> Run Sort
          </button>

          {hasRunSort && (
            <>
              <button
                onClick={() => {
                  setIsPlayingSort(false);
                  setSortStepIdx(0);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                title="Reset to Step 1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              <button
                onClick={() => {
                  setHasRunSort(false);
                  setSortSteps([]);
                  setIsPlayingSort(false);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 transition"
              >
                Clear
              </button>
            </>
          )}
        </div>

        {hasRunSort && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Speed:</span>
            {[
              { label: 'Slow', ms: 700 },
              { label: 'Normal', ms: 300 },
              { label: 'Fast', ms: 90 },
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => setPlaySpeedMs(s.ms)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  playSpeedMs === s.ms
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {hasRunSort && sortResult && currentSortStep && (
        <>
          {/* Algorithm Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Comparisons</div>
              <div className="text-xl font-extrabold text-slate-800 mt-0.5">
                {currentSortStep.comparisons}
                <span className="text-xs font-normal text-slate-400 ml-1">/ {sortResult.comparisons}</span>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Swaps / Movements</div>
              <div className="text-xl font-extrabold text-emerald-700 mt-0.5">
                {currentSortStep.swaps ?? 0}
                <span className="text-xs font-normal text-emerald-400 ml-1">/ {sortResult.swaps}</span>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Execution Time</div>
              <div className="text-xl font-extrabold text-indigo-700 mt-0.5">{sortResult.timeMs.toFixed(3)} ms</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Step Progress</div>
              <div className="text-xl font-extrabold text-slate-800 mt-0.5">
                {sortStepIdx + 1}
                <span className="text-xs font-normal text-slate-400 ml-1">/ {sortSteps.length}</span>
              </div>
            </div>
          </div>

          {/* Current Step Explanation Banner */}
          <div
            className={`rounded-xl border px-4 py-3 text-xs transition-all flex items-center justify-between gap-3 ${
              isSortFinished
                ? 'border-emerald-300 bg-emerald-100/70 text-emerald-900 font-semibold shadow-sm'
                : isCurrentStepSwap
                ? 'border-purple-200 bg-purple-50 text-purple-900 font-medium'
                : currentSortStep.highlights.length > 0
                ? 'border-amber-200 bg-amber-50 text-amber-900 font-medium'
                : 'border-slate-200 bg-slate-50 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {isSortFinished ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <div
                  className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                    isCurrentStepSwap
                      ? 'bg-purple-600 animate-ping'
                      : currentSortStep.highlights.length > 0
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-slate-400'
                  }`}
                />
              )}
              <span>
                <strong className="text-slate-900">Step {sortStepIdx + 1}: </strong>
                {currentSortStep.description}
              </span>
            </div>
            {isSortFinished && (
              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shrink-0">
                Sorted ✓
              </span>
            )}
          </div>

          {/* Dynamic Bar Graph */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-3 border-b border-slate-100 pb-2 flex-wrap gap-2">
              <span className="font-semibold text-slate-700">
                Array Visualizer ({currentSortStep.state.length} Items)
              </span>
              <div className="flex items-center gap-3 sm:gap-4 text-[11px] flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded bg-amber-400 inline-block" /> Comparing
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded bg-purple-500 inline-block" /> Swapping/Moving
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded bg-blue-500 inline-block" /> Pivot
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded bg-emerald-500 inline-block" /> Sorted/Placed
                </span>
              </div>
            </div>

            <div className="h-64 w-full flex items-end justify-between gap-1 sm:gap-2 px-2 pb-2 bg-slate-50/60 rounded-xl border border-slate-200/60 overflow-x-auto">
              {currentSortStep.state.map((item, i) => {
                const rawVal = item[sortField];
                const numVal = Number(rawVal) || 0;
                const barHeightPx = calculateBarHeight(numVal, maxSortVal);

                const isComparing = currentSortStep.highlights.includes(i);
                const isPivot =
                  currentSortStep.auxiliaryPointers?.pivotIndex === i ||
                  (currentSortStep.auxiliaryPointers?.pivot !== undefined &&
                    currentSortStep.auxiliaryPointers.pivot === numVal);

                const isPlaced =
                  isSortFinished ||
                  (sortAlgo === 'selection' && i < (currentSortStep.auxiliaryPointers?.sortedBoundary ?? -1)) ||
                  (sortAlgo === 'bubble' && i >= (currentSortStep.auxiliaryPointers?.sortedFromRight ?? 999)) ||
                  (sortAlgo === 'insertion' && i <= (currentSortStep.auxiliaryPointers?.sortedLength ?? -1));

                return (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-end h-full flex-1 min-w-[26px] max-w-[48px] group transition-all duration-200"
                  >
                    <div className="h-5 flex items-center justify-center text-[9px] font-bold">
                      {isPivot ? (
                        <span className="rounded bg-blue-600 px-1 py-0.2 text-[8px] text-white">PIVOT</span>
                      ) : isComparing && isCurrentStepSwap ? (
                        <span className="rounded bg-purple-600 px-1 py-0.2 text-[8px] text-white">SWAP</span>
                      ) : isComparing ? (
                        <span className="rounded bg-amber-500 px-1 py-0.2 text-[8px] text-white animate-bounce">CMP</span>
                      ) : null}
                    </div>

                    <div
                      className={`text-[11px] font-mono font-bold transition-all mb-1 ${
                        isComparing && isCurrentStepSwap
                          ? 'text-purple-700 font-black scale-110'
                          : isComparing
                          ? 'text-amber-700 font-black scale-110'
                          : isPivot
                          ? 'text-blue-700 font-bold'
                          : isPlaced
                          ? 'text-emerald-700 font-bold'
                          : 'text-slate-600'
                      }`}
                    >
                      {formatVal(rawVal)}
                    </div>

                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ease-out shadow-sm flex items-end justify-center pb-1 ${
                        isComparing && isCurrentStepSwap
                          ? 'bg-gradient-to-t from-purple-700 via-purple-600 to-fuchsia-400 ring-2 ring-purple-500 ring-offset-1 shadow-md shadow-purple-200 scale-105'
                          : isComparing
                          ? 'bg-gradient-to-t from-amber-500 via-amber-400 to-yellow-300 ring-2 ring-amber-400 ring-offset-1 shadow-md shadow-amber-200 scale-105'
                          : isPivot
                          ? 'bg-gradient-to-t from-blue-600 via-blue-500 to-sky-300 ring-2 ring-blue-400'
                          : isPlaced
                          ? 'bg-gradient-to-t from-emerald-600 to-teal-400'
                          : 'bg-gradient-to-t from-slate-400 to-slate-300'
                      }`}
                      style={{ height: `${barHeightPx}px` }}
                      title={`Req #${item.id} | ${searchFields.find((f) => f.value === sortField)?.label}: ${rawVal}`}
                    >
                      {barHeightPx > 40 && (
                        <span className="text-[8px] font-bold text-white/95 uppercase tracking-tighter truncate px-0.5 drop-shadow-sm">
                          #{item.id}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-col items-center">
                      <span
                        className={`text-[10px] font-mono font-bold ${
                          isComparing
                            ? 'text-amber-700 font-black'
                            : isPlaced
                            ? 'text-emerald-700 font-semibold'
                            : 'text-slate-400'
                        }`}
                      >
                        [{i}]
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
              <span>Bar Height represents: <strong>{searchFields.find((f) => f.value === sortField)?.label}</strong></span>
              <span>[{0}] to [{currentSortStep.state.length - 1}] = Array index positions</span>
            </div>
          </div>

          {/* Controls & Scrubber */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
              <button
                onClick={() => { setIsPlayingSort(false); setSortStepIdx(0); }}
                disabled={sortStepIdx === 0}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition"
                title="Jump to Start"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>

              <button
                onClick={() => { setIsPlayingSort(false); setSortStepIdx(Math.max(0, sortStepIdx - 1)); }}
                disabled={sortStepIdx === 0}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 h-9 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>

              <button
                onClick={() => {
                  if (sortStepIdx >= sortSteps.length - 1) setSortStepIdx(0);
                  setIsPlayingSort(!isPlayingSort);
                }}
                className={`flex items-center gap-1.5 rounded-xl px-4 h-9 text-xs font-bold text-white shadow-sm transition active:scale-95 ${
                  isPlayingSort
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isPlayingSort ? (
                  <>
                    <Pause className="h-4 w-4 fill-white" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" /> {isSortFinished ? 'Replay' : 'Auto Play'}
                  </>
                )}
              </button>

              <button
                onClick={() => { setIsPlayingSort(false); setSortStepIdx(Math.min(sortSteps.length - 1, sortStepIdx + 1)); }}
                disabled={sortStepIdx === sortSteps.length - 1}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 h-9 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => { setIsPlayingSort(false); setSortStepIdx(sortSteps.length - 1); }}
                disabled={sortStepIdx === sortSteps.length - 1}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition"
                title="Jump to End"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => { setIsPlayingSort(false); setSortStepIdx(0); }}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 h-9 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                title="Reset to beginning"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex-1 w-full flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={sortSteps.length - 1}
                value={sortStepIdx}
                onChange={(e) => {
                  setIsPlayingSort(false);
                  setSortStepIdx(Number(e.target.value));
                }}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <span className="text-xs font-mono font-semibold text-slate-600 shrink-0 w-24 text-right">
                Step {sortStepIdx + 1} / {sortSteps.length}
              </span>
            </div>
          </div>
        </>
      )}

      {!hasRunSort && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
            <Sliders className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Ready to Visualize Sorting</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            Choose an algorithm above (e.g. <strong>{sortAlgos.find((a) => a.value === sortAlgo)?.label}</strong>) and click{' '}
            <strong className="text-emerald-700">Run Sort</strong> to view the interactive bar graph step-by-step.
          </p>
        </div>
      )}
    </div>
  );
};
