import React, { useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Info,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import type { AlgorithmStep } from '../../dsa/types';
import type { WasteRequest } from '../../models/WasteRequest';
import type { SearchField } from './SortPanel';

export type SearchAlgo = 'linear' | 'binary';

export interface SearchPanelProps {
  requests: WasteRequest[];
  searchAlgo: SearchAlgo;
  setSearchAlgo: (algo: SearchAlgo) => void;
  searchField: SearchField;
  setSearchField: (field: SearchField) => void;
  searchTarget: string;
  setSearchTarget: (target: string) => void;
  searchSteps: AlgorithmStep<WasteRequest[]>[];
  searchStepIdx: number;
  setSearchStepIdx: React.Dispatch<React.SetStateAction<number>>;
  searchResult: { found: boolean; index: number; comparisons: number } | null;
  searchError: string;
  hasRunSearch: boolean;
  setHasRunSearch: (val: boolean) => void;
  setSearchSteps: (steps: AlgorithmStep<WasteRequest[]>[]) => void;
  isPlayingSearch: boolean;
  setIsPlayingSearch: (val: boolean) => void;
  searchSpeedMs: number;
  setSearchSpeedMs: (ms: number) => void;
  runSearch: () => void;
  runSearchWithTarget: (targetVal: string) => void;
  formatVal: (val: number | string | undefined) => string;
  calculateBarHeight: (val: number, maxVal: number) => number;
  searchFields: { value: SearchField; label: string }[];
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  requests,
  searchAlgo,
  setSearchAlgo,
  searchField,
  setSearchField,
  searchTarget,
  setSearchTarget,
  searchSteps,
  searchStepIdx,
  setSearchStepIdx,
  searchResult,
  searchError,
  hasRunSearch,
  setHasRunSearch,
  setSearchSteps,
  isPlayingSearch,
  setIsPlayingSearch,
  searchSpeedMs,
  setSearchSpeedMs,
  runSearch,
  runSearchWithTarget,
  formatVal,
  calculateBarHeight,
  searchFields,
}) => {
  const currentSearchStep = searchSteps[searchStepIdx];
  const isSearchFinished = hasRunSearch && searchStepIdx === searchSteps.length - 1;

  const maxSearchVal = useMemo(() => {
    const items = currentSearchStep?.state ?? requests.slice(0, 15);
    if (items.length === 0) return 100;
    return Math.max(...items.map((r) => Number(r[searchField]) || 1), 1);
  }, [currentSearchStep, requests, searchField]);

  return (
    <div className="space-y-5">
      {/* Controls Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap gap-4 items-end justify-between">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Search Algorithm</label>
            <select
              value={searchAlgo}
              onChange={(e) => {
                setSearchAlgo(e.target.value as SearchAlgo);
                setHasRunSearch(false);
                setIsPlayingSearch(false);
              }}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            >
              <option value="linear">Linear Search — O(n) (Sequential)</option>
              <option value="binary">Binary Search — O(log n) (Divide & Conquer, Auto-sorted)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Search Field</label>
            <select
              value={searchField}
              onChange={(e) => {
                setSearchField(e.target.value as SearchField);
                setHasRunSearch(false);
                setIsPlayingSearch(false);
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

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Target Numeric Value</label>
            <input
              value={searchTarget}
              onChange={(e) => {
                setSearchTarget(e.target.value);
                setHasRunSearch(false);
                setIsPlayingSearch(false);
              }}
              placeholder="e.g. 45 or 80"
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 w-36 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>

          <button
            onClick={runSearch}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-200 hover:from-emerald-700 hover:to-teal-700 transition active:scale-95"
          >
            <Search className="h-4 w-4" /> Search
          </button>

          {hasRunSearch && (
            <>
              <button
                onClick={() => {
                  setIsPlayingSearch(false);
                  setSearchStepIdx(0);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                title="Reset to Step 1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              <button
                onClick={() => {
                  setHasRunSearch(false);
                  setSearchSteps([]);
                  setIsPlayingSearch(false);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 transition"
              >
                Clear
              </button>
            </>
          )}
        </div>

        {/* Quick Presets for Demo */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium">Quick Demo:</span>
          {requests.slice(0, 3).map((r) => {
            const targetVal = String(r[searchField]);
            return (
              <button
                key={r.id}
                onClick={() => {
                  setSearchTarget(targetVal);
                  runSearchWithTarget(targetVal);
                }}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 transition"
              >
                Val: {targetVal}
              </button>
            );
          })}
        </div>
      </div>

      {searchError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs text-rose-700">
          {searchError}
        </div>
      )}

      {hasRunSearch && searchResult && currentSearchStep && (
        <>
          {/* Search Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Comparisons</div>
              <div className="text-xl font-extrabold text-slate-800 mt-0.5">
                {currentSearchStep.comparisons}
                <span className="text-xs font-normal text-slate-400 ml-1">/ {searchResult.comparisons}</span>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Search Outcome</div>
              <div
                className={`text-sm font-extrabold mt-1.5 truncate ${
                  searchResult.found ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {searchResult.found ? `Found at Index [${searchResult.index}]` : 'Not Found'}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Target Value</div>
              <div className="text-xl font-extrabold text-indigo-700 mt-0.5">{searchTarget}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Step Progress</div>
              <div className="text-xl font-extrabold text-slate-800 mt-0.5">
                {searchStepIdx + 1}
                <span className="text-xs font-normal text-slate-400 ml-1">/ {searchSteps.length}</span>
              </div>
            </div>
          </div>

          {/* Search Result Banner */}
          <div
            className={`rounded-2xl border p-4 text-xs shadow-sm flex items-center justify-between ${
              searchResult.found
                ? 'border-emerald-200 bg-emerald-50/80 text-emerald-900'
                : 'border-rose-200 bg-rose-50/80 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {searchResult.found ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              ) : (
                <Info className="h-5 w-5 text-rose-600 shrink-0" />
              )}
              <div>
                <div className="font-bold text-sm">
                  {searchResult.found
                    ? `Target value "${searchTarget}" found at index [${searchResult.index}]`
                    : `Target value "${searchTarget}" not found in current dataset`}
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Required <strong>{searchResult.comparisons} comparison(s)</strong> using{' '}
                  {searchAlgo === 'binary' ? 'Binary Search' : 'Linear Search'}.
                  {searchAlgo === 'binary' && ' (Data was automatically sorted ascending for binary search).'}
                </div>
              </div>
            </div>
          </div>

          {/* Current Step Description */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs text-indigo-900 flex items-center justify-between">
            <div>
              <span className="font-bold text-indigo-950">
                Step {searchStepIdx + 1} of {searchSteps.length}:{' '}
              </span>
              {currentSearchStep.description}
            </div>
            {isSearchFinished && searchResult.found && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-900 shrink-0">
                <Sparkles className="h-3 w-3" /> Match Located!
              </span>
            )}
          </div>

          {/* Dynamic Bar Graph for Search */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-3 border-b border-slate-100 pb-2 flex-wrap gap-2">
              <span className="font-semibold text-slate-700">
                Search Space Graph ({currentSearchStep.state.length} Elements)
              </span>
              <div className="flex items-center gap-3 sm:gap-4 text-[11px] flex-wrap">
                {searchAlgo === 'binary' ? (
                  <>
                    <span className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded bg-blue-500 inline-block" /> Low (L)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded bg-amber-500 inline-block" /> Mid (M)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded bg-rose-500 inline-block" /> High (H)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded bg-emerald-500 inline-block" /> Found Match
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <span className="h-3 w-3 rounded bg-slate-200 inline-block" /> Eliminated
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1 font-semibold text-amber-600">
                      <span className="h-3 w-3 rounded bg-amber-400 inline-block" /> Current Scan
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                      <span className="h-3 w-3 rounded bg-emerald-500 inline-block" /> Found Match
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <span className="h-3 w-3 rounded bg-slate-200 inline-block" /> Already Checked
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="h-64 w-full flex items-end justify-between gap-1 sm:gap-2 px-2 pb-2 bg-slate-50/60 rounded-xl border border-slate-200/60 overflow-x-auto">
              {currentSearchStep.state.map((item, i) => {
                const rawVal = item[searchField];
                const numVal = Number(rawVal) || 0;
                const barHeightPx = calculateBarHeight(numVal, maxSearchVal);
                const pointers = currentSearchStep.auxiliaryPointers ?? {};

                const isLow = pointers.low === i;
                const isMid = pointers.mid === i;
                const isHigh = pointers.high === i;
                const isCurrent = pointers.currentIndex === i;

                const isMatchFound =
                  searchResult.found &&
                  (searchResult.index === i &&
                    (isMid || isCurrent || isSearchFinished || currentSearchStep.description.toLowerCase().includes('match found')));

                const isEliminated =
                  searchAlgo === 'binary' &&
                  pointers.low !== null &&
                  pointers.low !== undefined &&
                  pointers.high !== null &&
                  pointers.high !== undefined &&
                  (i < Number(pointers.low) || i > Number(pointers.high));

                const isPastLinear =
                  searchAlgo === 'linear' &&
                  pointers.currentIndex !== null &&
                  pointers.currentIndex !== undefined &&
                  i < Number(pointers.currentIndex);

                let pointerBadge: React.ReactNode = null;
                if (isMatchFound) {
                  pointerBadge = (
                    <span className="rounded bg-emerald-600 px-1.5 py-0.2 text-[9px] font-extrabold text-white shadow-sm ring-1 ring-emerald-700 animate-bounce">
                      MATCH ✓
                    </span>
                  );
                } else if (isLow && isMid && isHigh) {
                  pointerBadge = (
                    <span className="rounded bg-indigo-600 px-1 py-0.2 text-[9px] font-bold text-white shadow-sm">
                      L · M · H
                    </span>
                  );
                } else if (isLow && isMid) {
                  pointerBadge = (
                    <span className="rounded bg-cyan-600 px-1 py-0.2 text-[9px] font-bold text-white shadow-sm">
                      L · M
                    </span>
                  );
                } else if (isMid && isHigh) {
                  pointerBadge = (
                    <span className="rounded bg-orange-600 px-1 py-0.2 text-[9px] font-bold text-white shadow-sm">
                      M · H
                    </span>
                  );
                } else if (isMid) {
                  pointerBadge = (
                    <span className="rounded bg-amber-500 px-1.5 py-0.2 text-[9px] font-bold text-white shadow-sm animate-bounce">
                      MID
                    </span>
                  );
                } else if (isLow) {
                  pointerBadge = (
                    <span className="rounded bg-blue-500 px-1.5 py-0.2 text-[9px] font-bold text-white">
                      LOW
                    </span>
                  );
                } else if (isHigh) {
                  pointerBadge = (
                    <span className="rounded bg-rose-500 px-1.5 py-0.2 text-[9px] font-bold text-white">
                      HIGH
                    </span>
                  );
                } else if (isCurrent) {
                  pointerBadge = (
                    <span className="rounded bg-amber-500 px-1.5 py-0.2 text-[9px] font-bold text-white shadow-sm animate-bounce">
                      SCAN ↓
                    </span>
                  );
                }

                return (
                  <div
                    key={i}
                    className={`flex flex-col items-center justify-end h-full flex-1 min-w-[26px] max-w-[48px] group transition-all duration-200 ${
                      isEliminated || isPastLinear ? 'opacity-35 grayscale' : 'opacity-100'
                    }`}
                  >
                    <div className="h-6 flex items-center justify-center text-[9px] font-bold pb-0.5">
                      {pointerBadge}
                    </div>

                    <div
                      className={`text-[11px] font-mono font-bold transition-all mb-1 ${
                        isMatchFound
                          ? 'text-emerald-700 scale-110 font-black'
                          : isMid || isCurrent
                          ? 'text-amber-800 scale-110 font-black'
                          : 'text-slate-600'
                      }`}
                    >
                      {formatVal(rawVal)}
                    </div>

                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ease-out shadow-sm flex items-end justify-center pb-1 ${
                        isMatchFound
                          ? 'bg-gradient-to-t from-emerald-600 via-emerald-500 to-teal-400 ring-2 ring-emerald-500 ring-offset-1 shadow-md shadow-emerald-200 scale-105'
                          : isMid || isCurrent
                          ? 'bg-gradient-to-t from-amber-500 via-amber-400 to-amber-300 ring-2 ring-amber-400 ring-offset-1 shadow-md shadow-amber-200 scale-105'
                          : isLow
                          ? 'bg-gradient-to-t from-blue-600 to-blue-400 ring-2 ring-blue-400'
                          : isHigh
                          ? 'bg-gradient-to-t from-rose-600 to-rose-400 ring-2 ring-rose-400'
                          : isEliminated || isPastLinear
                          ? 'bg-slate-300'
                          : 'bg-gradient-to-t from-teal-600 to-emerald-400'
                      }`}
                      style={{ height: `${barHeightPx}px` }}
                      title={`Req #${item.id} | ${searchFields.find((f) => f.value === searchField)?.label}: ${rawVal}`}
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
                          isMatchFound
                            ? 'text-emerald-700 font-black'
                            : isMid || isCurrent
                            ? 'text-amber-700 font-black'
                            : 'text-slate-500'
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
              <span>Bar Height represents: <strong>{searchFields.find((f) => f.value === searchField)?.label}</strong></span>
              <span>[{0}] to [{currentSearchStep.state.length - 1}] = Memory array index positions</span>
            </div>
          </div>

          {/* Array Memory State */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm overflow-x-auto">
            <div className="text-xs font-semibold text-slate-700 mb-4 flex items-center justify-between flex-wrap gap-2">
              <span>Array Memory State (Pointer Movements)</span>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                {searchAlgo === 'binary' ? (
                  <>
                    <span className="flex items-center gap-1 font-semibold text-blue-600">L = Low pointer</span>
                    <span className="flex items-center gap-1 font-semibold text-amber-600">M = Mid candidate</span>
                    <span className="flex items-center gap-1 font-semibold text-rose-600">H = High pointer</span>
                  </>
                ) : (
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">↓ Current Index Inspected</span>
                )}
              </div>
            </div>

            <div className="flex gap-2 min-w-max pb-2">
              {currentSearchStep.state.map((item, i) => {
                const val = item[searchField];
                const pointers = currentSearchStep.auxiliaryPointers ?? {};
                const isLow = pointers.low === i;
                const isMid = pointers.mid === i;
                const isHigh = pointers.high === i;
                const isCurrent = pointers.currentIndex === i;

                const isMatchFound =
                  searchResult.found &&
                  (searchResult.index === i &&
                    (isMid || isCurrent || isSearchFinished || currentSearchStep.description.toLowerCase().includes('match found')));

                const isEliminated =
                  searchAlgo === 'binary' &&
                  pointers.low !== null &&
                  pointers.low !== undefined &&
                  pointers.high !== null &&
                  pointers.high !== undefined &&
                  (i < Number(pointers.low) || i > Number(pointers.high));

                return (
                  <div
                    key={i}
                    className={`flex flex-col items-center min-w-[50px] transition-all ${
                      isEliminated ? 'opacity-35 grayscale' : 'opacity-100'
                    }`}
                  >
                    <div className="h-6 flex items-center justify-center text-[10px] font-bold">
                      {isMatchFound ? (
                        <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-white shadow-sm animate-bounce">
                          MATCH
                        </span>
                      ) : isLow && isMid && isHigh ? (
                        <span className="rounded bg-indigo-600 px-1.5 py-0.5 text-white">L·M·H</span>
                      ) : isLow && isMid ? (
                        <span className="rounded bg-cyan-600 px-1.5 py-0.5 text-white">L·M</span>
                      ) : isMid && isHigh ? (
                        <span className="rounded bg-orange-600 px-1.5 py-0.5 text-white">M·H</span>
                      ) : isMid ? (
                        <span className="rounded bg-amber-500 px-1.5 py-0.5 text-white shadow-sm animate-bounce">
                          MID
                        </span>
                      ) : isLow ? (
                        <span className="rounded bg-blue-500 px-1.5 py-0.5 text-white">LOW</span>
                      ) : isHigh ? (
                        <span className="rounded bg-rose-500 px-1.5 py-0.5 text-white">HIGH</span>
                      ) : isCurrent ? (
                        <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-white">↓</span>
                      ) : null}
                    </div>

                    <div
                      className={`w-full rounded-xl border-2 p-3 text-center transition-all ${
                        isMatchFound
                          ? 'border-emerald-500 bg-emerald-100 text-emerald-950 font-extrabold shadow-md scale-105'
                          : isMid || isCurrent
                          ? 'border-amber-400 bg-amber-50 text-amber-900 font-extrabold shadow-md scale-105'
                          : isLow
                          ? 'border-blue-400 bg-blue-50 text-blue-900 font-bold'
                          : isHigh
                          ? 'border-rose-400 bg-rose-50 text-rose-900 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-700 font-semibold'
                      }`}
                    >
                      <div className="text-sm font-mono">{formatVal(val)}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">#{item.id}</div>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400 mt-1">[{i}]</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scrubber & Controls */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
              <button
                onClick={() => { setIsPlayingSearch(false); setSearchStepIdx(0); }}
                disabled={searchStepIdx === 0}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition"
                title="Jump to Start"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>

              <button
                onClick={() => { setIsPlayingSearch(false); setSearchStepIdx(Math.max(0, searchStepIdx - 1)); }}
                disabled={searchStepIdx === 0}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 h-9 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>

              <button
                onClick={() => {
                  if (searchStepIdx >= searchSteps.length - 1) setSearchStepIdx(0);
                  setIsPlayingSearch(!isPlayingSearch);
                }}
                className={`flex items-center gap-1.5 rounded-xl px-4 h-9 text-xs font-bold text-white shadow-sm transition active:scale-95 ${
                  isPlayingSearch
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isPlayingSearch ? (
                  <>
                    <Pause className="h-4 w-4 fill-white" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" /> {isSearchFinished ? 'Replay' : 'Auto Play'}
                  </>
                )}
              </button>

              <button
                onClick={() => { setIsPlayingSearch(false); setSearchStepIdx(Math.min(searchSteps.length - 1, searchStepIdx + 1)); }}
                disabled={searchStepIdx === searchSteps.length - 1}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 h-9 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => { setIsPlayingSearch(false); setSearchStepIdx(searchSteps.length - 1); }}
                disabled={searchStepIdx === searchSteps.length - 1}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition"
                title="Jump to End"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => { setIsPlayingSearch(false); setSearchStepIdx(0); }}
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
                max={searchSteps.length - 1}
                value={searchStepIdx}
                onChange={(e) => {
                  setIsPlayingSearch(false);
                  setSearchStepIdx(Number(e.target.value));
                }}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <span className="text-xs font-mono font-semibold text-slate-600 shrink-0 w-24 text-right">
                Step {searchStepIdx + 1} / {searchSteps.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs text-slate-400 font-medium">Speed:</span>
              {[
                { label: 'Slow', ms: 800 },
                { label: 'Normal', ms: 400 },
                { label: 'Fast', ms: 150 },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSearchSpeedMs(s.ms)}
                  className={`rounded-lg px-2 py-1 text-xs font-semibold transition ${
                    searchSpeedMs === s.ms
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {!hasRunSearch && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
            <Search className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Ready to Search Data</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            Enter a target number above or click one of the quick test presets (e.g.{' '}
            <strong className="text-emerald-700">Val: {requests[0]?.urgencyScore ?? 50}</strong>) to see pointer movements and dynamic graph updates.
          </p>
        </div>
      )}
    </div>
  );
};
