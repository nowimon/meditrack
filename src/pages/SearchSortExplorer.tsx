import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Info, Sliders, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { linearSearch } from '../dsa/arrays/linearSearch';
import { binarySearch } from '../dsa/arrays/binarySearch';
import { bubbleSort } from '../dsa/sorting/bubbleSort';
import { selectionSort } from '../dsa/sorting/selectionSort';
import { insertionSort } from '../dsa/sorting/insertionSort';
import { mergeSort } from '../dsa/sorting/mergeSort';
import { quickSort } from '../dsa/sorting/quickSort';
import type { AlgorithmStep } from '../dsa/types';
import type { WasteRequest } from '../models/WasteRequest';
import { SortPanel } from '../components/searchSort/SortPanel';
import type { SortAlgo, SearchField } from '../components/searchSort/SortPanel';
import { SearchPanel } from '../components/searchSort/SearchPanel';
import type { SearchAlgo } from '../components/searchSort/SearchPanel';

const SORT_ALGOS: { value: SortAlgo; label: string; complexity: string; desc: string }[] = [
  { value: 'selection', label: 'Selection Sort', complexity: 'O(n²)', desc: 'Finds minimum in unsorted portion and moves it to front' },
  { value: 'bubble', label: 'Bubble Sort', complexity: 'O(n²)', desc: 'Repeatedly swaps adjacent elements if out of order' },
  { value: 'insertion', label: 'Insertion Sort', complexity: 'O(n²)', desc: 'Builds sorted array one element at a time like cards' },
  { value: 'merge', label: 'Merge Sort', complexity: 'O(n log n)', desc: 'Divides array in halves, sorts recursively, then merges' },
  { value: 'quick', label: 'Quick Sort', complexity: 'O(n log n)', desc: 'Partitions around a pivot element into smaller & larger' },
];

const SEARCH_FIELDS: { value: SearchField; label: string }[] = [
  { value: 'urgencyScore', label: 'Urgency Score (0 - 100)' },
  { value: 'wasteWeightKg', label: 'Weight (kg)' },
  { value: 'id', label: 'Request ID' },
];

const formatVal = (val: number | string | undefined): string => {
  if (val === undefined || val === null) return '-';
  const num = Number(val);
  if (isNaN(num)) return String(val);
  return Number.isInteger(num) ? String(num) : num.toFixed(1);
};

// Proportional bar height helper (24px min, 160px max)
const calculateBarHeight = (val: number, maxVal: number): number => {
  const safeMax = maxVal > 0 ? maxVal : 1;
  const pct = Math.max(0.06, Math.min(1, val / safeMax));
  return Math.round(pct * 135) + 24;
};

export const SearchSortExplorer: React.FC = () => {
  const { requests } = useApp();
  const [tab, setTab] = useState<'sort' | 'search'>('sort');
  const [showInstructions, setShowInstructions] = useState(true);

  // --- SORT STATE ---
  const [sortAlgo, setSortAlgo] = useState<SortAlgo>('selection');
  const [sortField, setSortField] = useState<SearchField>('urgencyScore');
  const [sortSteps, setSortSteps] = useState<AlgorithmStep<WasteRequest[]>[]>([]);
  const [sortStepIdx, setSortStepIdx] = useState(0);
  const [sortResult, setSortResult] = useState<{ comparisons: number; swaps: number; timeMs: number } | null>(null);
  const [hasRunSort, setHasRunSort] = useState(false);
  const [isPlayingSort, setIsPlayingSort] = useState(false);
  const [playSpeedMs, setPlaySpeedMs] = useState(300);

  // --- SEARCH STATE ---
  const [searchAlgo, setSearchAlgo] = useState<SearchAlgo>('linear');
  const [searchField, setSearchField] = useState<SearchField>('urgencyScore');
  const [searchTarget, setSearchTarget] = useState('');
  const [searchSteps, setSearchSteps] = useState<AlgorithmStep<WasteRequest[]>[]>([]);
  const [searchStepIdx, setSearchStepIdx] = useState(0);
  const [searchResult, setSearchResult] = useState<{ found: boolean; index: number; comparisons: number } | null>(null);
  const [searchError, setSearchError] = useState('');
  const [hasRunSearch, setHasRunSearch] = useState(false);
  const [isPlayingSearch, setIsPlayingSearch] = useState(false);
  const [searchSpeedMs, setSearchSpeedMs] = useState(400);

  // 15 items for clear, readable visualization without overflow
  const sortSource = useMemo(() => requests.slice(0, 15), [requests]);

  // Execute Sort
  const runSort = useCallback(() => {
    if (sortSource.length === 0) return;
    setIsPlayingSort(false);
    const ke = (item: WasteRequest) => Number(item[sortField]) || 0;
    let res;
    switch (sortAlgo) {
      case 'bubble': res = bubbleSort(sortSource, ke); break;
      case 'selection': res = selectionSort(sortSource, ke); break;
      case 'insertion': res = insertionSort(sortSource, ke); break;
      case 'merge': res = mergeSort(sortSource, ke); break;
      case 'quick': res = quickSort(sortSource, ke); break;
    }
    setSortSteps(res.steps as AlgorithmStep<WasteRequest[]>[]);
    setSortStepIdx(0);
    setSortResult({ comparisons: res.totalComparisons, swaps: res.totalSwaps ?? 0, timeMs: res.timeMs });
    setHasRunSort(true);
  }, [sortSource, sortAlgo, sortField]);

  // Auto-play timer for Sort
  const sortTimerRef = useRef<number | null>(null);
  useEffect(() => {
    if (!isPlayingSort) {
      if (sortTimerRef.current) clearInterval(sortTimerRef.current);
      return;
    }

    sortTimerRef.current = window.setInterval(() => {
      setSortStepIdx((prev) => {
        if (prev >= sortSteps.length - 1) {
          setIsPlayingSort(false);
          return prev;
        }
        return prev + 1;
      });
    }, playSpeedMs);

    return () => {
      if (sortTimerRef.current) clearInterval(sortTimerRef.current);
    };
  }, [isPlayingSort, sortSteps.length, playSpeedMs]);

  // Execute Search
  const runSearchWithTarget = useCallback(
    (targetVal: string) => {
      const target = parseFloat(targetVal);
      if (isNaN(target)) {
        setSearchError('Please enter a valid numeric value to search.');
        return;
      }
      setSearchError('');
      setIsPlayingSearch(false);

      const ke = (item: WasteRequest) => Number(item[searchField]) || 0;
      let data = [...requests.slice(0, 15)];

      if (searchAlgo === 'binary') {
        data = [...data].sort((a, b) => ke(a) - ke(b));
      }

      let res;
      if (searchAlgo === 'linear') {
        res = linearSearch(data, target, ke);
      } else {
        res = binarySearch(data, target, ke);
      }

      setSearchResult({
        found: res.result.isFound,
        index: res.result.foundIndex,
        comparisons: res.totalComparisons,
      });
      setSearchSteps(res.steps as AlgorithmStep<WasteRequest[]>[]);
      setSearchStepIdx(0);
      setHasRunSearch(true);
    },
    [searchField, searchAlgo, requests]
  );

  const runSearch = useCallback(() => {
    runSearchWithTarget(searchTarget);
  }, [runSearchWithTarget, searchTarget]);

  // Auto-play timer for Search
  const searchTimerRef = useRef<number | null>(null);
  useEffect(() => {
    if (!isPlayingSearch) {
      if (searchTimerRef.current) clearInterval(searchTimerRef.current);
      return;
    }

    searchTimerRef.current = window.setInterval(() => {
      setSearchStepIdx((prev) => {
        if (prev >= searchSteps.length - 1) {
          setIsPlayingSearch(false);
          return prev;
        }
        return prev + 1;
      });
    }, searchSpeedMs);

    return () => {
      if (searchTimerRef.current) clearInterval(searchTimerRef.current);
    };
  }, [isPlayingSearch, searchSteps.length, searchSpeedMs]);

  return (
    <PageShell
      title="Search & Sort Algorithm Visualizer"
      subtitle="Interactive step-by-step visualizer for hospital waste prioritization and sorting"
      complexity="Linear: O(n) · Binary: O(log n) · Selection/Bubble/Insertion: O(n²) · Merge/Quick: O(n log n)"
    >
      {/* Subtle Instructions Banner */}
      <div className="mb-5 rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-900">
            <Info className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>How This Visualizer Works (Quick Guide)</span>
          </div>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
          >
            {showInstructions ? 'Hide Guide' : 'Show Guide'}
          </button>
        </div>

        {showInstructions && (
          <div className="mt-3 grid gap-3 sm:grid-cols-3 text-xs text-slate-700 border-t border-emerald-200/60 pt-3">
            <div className="space-y-1">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">1</span>
                Configure & Run
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Choose an algorithm and a property (e.g., <strong>Urgency Score</strong>), then click <strong className="text-emerald-700">Run Sort</strong> or <strong className="text-emerald-700">Search</strong>.
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">2</span>
                Observe Dynamic Bars
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Bar height = property value. <strong className="text-amber-700">Amber bars</strong> = compared; <strong className="text-purple-700">Purple bars</strong> = swapped; <strong className="text-sky-700">Blue</strong> = pivot/pointers; <strong className="text-emerald-700">Green bars</strong> = placed.
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">3</span>
                Auto-Play, Scrub or Step
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Click <strong>Play ▶</strong> to watch the execution automatically, drag the scrubber slider back and forth, or step through with Prev/Next buttons.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 mb-5">
        <button
          onClick={() => { setTab('sort'); setIsPlayingSearch(false); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            tab === 'sort'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="h-4 w-4" /> Sort Visualizer (Bar Graphs)
        </button>
        <button
          onClick={() => { setTab('search'); setIsPlayingSort(false); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            tab === 'search'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="h-4 w-4" /> Search Visualizer (Pointers)
        </button>
      </div>

      {/* Panels */}
      {tab === 'sort' && (
        <SortPanel
          sortSource={sortSource}
          sortAlgo={sortAlgo}
          setSortAlgo={setSortAlgo}
          sortField={sortField}
          setSortField={setSortField}
          sortSteps={sortSteps}
          sortStepIdx={sortStepIdx}
          setSortStepIdx={setSortStepIdx}
          sortResult={sortResult}
          hasRunSort={hasRunSort}
          setHasRunSort={setHasRunSort}
          setSortSteps={setSortSteps}
          isPlayingSort={isPlayingSort}
          setIsPlayingSort={setIsPlayingSort}
          playSpeedMs={playSpeedMs}
          setPlaySpeedMs={setPlaySpeedMs}
          runSort={runSort}
          formatVal={formatVal}
          calculateBarHeight={calculateBarHeight}
          sortAlgos={SORT_ALGOS}
          searchFields={SEARCH_FIELDS}
        />
      )}

      {tab === 'search' && (
        <SearchPanel
          requests={requests}
          searchAlgo={searchAlgo}
          setSearchAlgo={setSearchAlgo}
          searchField={searchField}
          setSearchField={setSearchField}
          searchTarget={searchTarget}
          setSearchTarget={setSearchTarget}
          searchSteps={searchSteps}
          searchStepIdx={searchStepIdx}
          setSearchStepIdx={setSearchStepIdx}
          searchResult={searchResult}
          searchError={searchError}
          hasRunSearch={hasRunSearch}
          setHasRunSearch={setHasRunSearch}
          setSearchSteps={setSearchSteps}
          isPlayingSearch={isPlayingSearch}
          setIsPlayingSearch={setIsPlayingSearch}
          searchSpeedMs={searchSpeedMs}
          setSearchSpeedMs={setSearchSpeedMs}
          runSearch={runSearch}
          runSearchWithTarget={runSearchWithTarget}
          formatVal={formatVal}
          calculateBarHeight={calculateBarHeight}
          searchFields={SEARCH_FIELDS}
        />
      )}
    </PageShell>
  );
};
