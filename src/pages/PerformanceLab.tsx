import React, { useState, useCallback } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Play, BarChart3 } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { generateSampleWasteRequests } from '../data/dataGenerator';
import { linearSearch } from '../dsa/arrays/linearSearch';
import { binarySearch } from '../dsa/arrays/binarySearch';
import { bubbleSort } from '../dsa/sorting/bubbleSort';
import { selectionSort } from '../dsa/sorting/selectionSort';
import { insertionSort } from '../dsa/sorting/insertionSort';
import { mergeSort } from '../dsa/sorting/mergeSort';
import { quickSort } from '../dsa/sorting/quickSort';

const SIZES = [10, 25, 50, 100, 200];

interface BenchmarkRow {
  n: number;
  linear: number;
  binary: number;
}

interface SortBenchmarkRow {
  n: number;
  bubble: number;
  selection: number;
  insertion: number;
  merge: number;
  quick: number;
}

function runSearchBench(): BenchmarkRow[] {
  return SIZES.map((n) => {
    const data = generateSampleWasteRequests(n, 42);
    const key = (r: typeof data[0]) => r.urgencyScore;
    // Target guaranteed present: use the last element
    const target = data[Math.floor(n / 2)].urgencyScore;

    const linRes = linearSearch(data, target, key);
    const sortedData = [...data].sort((a, b) => a.urgencyScore - b.urgencyScore);
    const binRes = binarySearch(sortedData, target, key);

    return {
      n,
      linear: linRes.totalComparisons,
      binary: binRes.totalComparisons,
    };
  });
}

function runSortBench(): SortBenchmarkRow[] {
  return SIZES.map((n) => {
    const data = generateSampleWasteRequests(n, 42);
    const key = (r: typeof data[0]) => r.urgencyScore;

    return {
      n,
      bubble: bubbleSort(data, key).totalComparisons,
      selection: selectionSort(data, key).totalComparisons,
      insertion: insertionSort(data, key).totalComparisons,
      merge: mergeSort(data, key).totalComparisons,
      quick: quickSort(data, key).totalComparisons,
    };
  });
}

export const PerformanceLab: React.FC = () => {
  const [searchData, setSearchData] = useState<BenchmarkRow[] | null>(null);
  const [sortData, setSortData] = useState<SortBenchmarkRow[] | null>(null);
  const [running, setRunning] = useState(false);

  const runAll = useCallback(() => {
    setRunning(true);
    // Use setTimeout to let React render the loading state
    setTimeout(() => {
      setSearchData(runSearchBench());
      setSortData(runSortBench());
      setRunning(false);
    }, 10);
  }, []);

  return (
    <PageShell
      title="Performance Lab & Big-O Analysis"
      subtitle="Empirical benchmarks comparing search and sort algorithms across dataset sizes"
      complexity="O(1) · O(log n) · O(n) · O(n log n) · O(n²)"
      actions={
        <button onClick={runAll} disabled={running}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60 transition">
          <Play className="h-3.5 w-3.5" />
          {running ? 'Running…' : 'Run All Benchmarks'}
        </button>
      }
    >
      {!searchData && !sortData && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
          <BarChart3 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-semibold">Click <strong>Run All Benchmarks</strong> to measure comparison counts across dataset sizes n = {SIZES.join(', ')}.</p>
          <p className="text-xs text-slate-400 mt-1">Uses the deterministic LCG seed=42 dataset for reproducible results.</p>
        </div>
      )}

      {searchData && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="text-emerald-600">📊</span> Linear Search vs Binary Search
          </h3>
          <p className="text-xs text-slate-500 mb-4">Comparisons required to find the same target. Binary search precondition: pre-sorted array.</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={searchData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="n" label={{ value: 'n (dataset size)', position: 'insideBottom', offset: -3, fontSize: 11 }} tick={{ fontSize: 11 }} />
              <YAxis label={{ value: 'Comparisons', angle: -90, position: 'insideLeft', fontSize: 11 }} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="linear" name="Linear O(n)" stroke="#f59e0b" strokeWidth={2} dot />
              <Line type="monotone" dataKey="binary" name="Binary O(log n)" stroke="#10b981" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-200 px-3 py-1.5 font-semibold text-slate-600">n</th>
                  <th className="border border-slate-200 px-3 py-1.5 font-semibold text-amber-700">Linear O(n)</th>
                  <th className="border border-slate-200 px-3 py-1.5 font-semibold text-emerald-700">Binary O(log n)</th>
                  <th className="border border-slate-200 px-3 py-1.5 font-semibold text-slate-500">Speedup</th>
                </tr>
              </thead>
              <tbody>
                {searchData.map((row) => (
                  <tr key={row.n} className="hover:bg-slate-50">
                    <td className="border border-slate-200 px-3 py-1">{row.n}</td>
                    <td className="border border-slate-200 px-3 py-1 text-amber-700 font-mono">{row.linear}</td>
                    <td className="border border-slate-200 px-3 py-1 text-emerald-700 font-mono">{row.binary}</td>
                    <td className="border border-slate-200 px-3 py-1 text-slate-600 font-mono">{row.binary > 0 ? (row.linear / row.binary).toFixed(1) + 'x' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {sortData && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="text-indigo-600">📈</span> Sort Algorithm Comparison
          </h3>
          <p className="text-xs text-slate-500 mb-4">Total comparisons for sorting waste records by urgency score. Bubble/Selection/Insertion = O(n²), Merge/Quick = O(n log n).</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={sortData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="n" label={{ value: 'n (dataset size)', position: 'insideBottom', offset: -3, fontSize: 11 }} tick={{ fontSize: 11 }} />
              <YAxis label={{ value: 'Comparisons', angle: -90, position: 'insideLeft', fontSize: 11 }} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="bubble" name="Bubble O(n²)" stroke="#f43f5e" strokeWidth={2} dot />
              <Line type="monotone" dataKey="selection" name="Selection O(n²)" stroke="#f97316" strokeWidth={2} dot />
              <Line type="monotone" dataKey="insertion" name="Insertion O(n²)" stroke="#eab308" strokeWidth={2} dot />
              <Line type="monotone" dataKey="merge" name="Merge O(n log n)" stroke="#10b981" strokeWidth={2} dot />
              <Line type="monotone" dataKey="quick" name="Quick O(n log n)" stroke="#6366f1" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-200 px-2 py-1.5 font-semibold text-slate-600">n</th>
                  <th className="border border-slate-200 px-2 py-1.5 font-semibold text-rose-600">Bubble</th>
                  <th className="border border-slate-200 px-2 py-1.5 font-semibold text-orange-600">Selection</th>
                  <th className="border border-slate-200 px-2 py-1.5 font-semibold text-yellow-700">Insertion</th>
                  <th className="border border-slate-200 px-2 py-1.5 font-semibold text-emerald-700">Merge</th>
                  <th className="border border-slate-200 px-2 py-1.5 font-semibold text-indigo-700">Quick</th>
                </tr>
              </thead>
              <tbody>
                {sortData.map((row) => (
                  <tr key={row.n} className="hover:bg-slate-50">
                    <td className="border border-slate-200 px-2 py-1 font-semibold">{row.n}</td>
                    <td className="border border-slate-200 px-2 py-1 font-mono text-rose-700">{row.bubble}</td>
                    <td className="border border-slate-200 px-2 py-1 font-mono text-orange-700">{row.selection}</td>
                    <td className="border border-slate-200 px-2 py-1 font-mono text-yellow-700">{row.insertion}</td>
                    <td className="border border-slate-200 px-2 py-1 font-mono text-emerald-700">{row.merge}</td>
                    <td className="border border-slate-200 px-2 py-1 font-mono text-indigo-700">{row.quick}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Theory cards */}
      {(searchData || sortData) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Measurement Methodology',
              body: 'Comparison counts are exact operation counts, not wall-clock time, making them hardware-independent and reproducible across runs with the same seed.',
              icon: '🔬',
            },
            {
              title: 'Binary Search Precondition',
              body: 'Binary search requires the array to be sorted. The benchmark explicitly sorts the data first, then measures O(log n) search comparisons.',
              icon: '⚠️',
            },
            {
              title: 'Best vs Worst Case',
              body: 'Insertion Sort is O(n) on already-sorted data (adaptive). Quicksort degrades to O(n²) on sorted data with naive pivot — always evaluate both cases.',
              icon: '📐',
            },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-1.5">
              <div className="text-xl">{c.icon}</div>
              <h4 className="text-xs font-bold text-slate-800">{c.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
};
