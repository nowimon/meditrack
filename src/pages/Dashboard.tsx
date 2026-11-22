import React, { useMemo } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Activity, Layers, ShieldCheck, TrendingUp, Clock, AlertTriangle, Play, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WASTE_CATEGORIES } from '../models/WasteCategory';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { requests } = useApp();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const pending = requests.filter((r) => r.status === 'PENDING').length;
    const scheduled = requests.filter((r) => r.status === 'SCHEDULED').length;
    const inTransit = requests.filter((r) => r.status === 'IN_TRANSIT').length;
    const urgent = requests.filter((r) => r.urgencyScore >= 75).length;
    const totalWeight = requests.reduce((sum, r) => sum + r.wasteWeightKg, 0);

    const byCategory = {
      YELLOW: requests.filter((r) => r.wasteCategory === 'YELLOW').length,
      RED: requests.filter((r) => r.wasteCategory === 'RED').length,
      WHITE: requests.filter((r) => r.wasteCategory === 'WHITE').length,
      BLUE: requests.filter((r) => r.wasteCategory === 'BLUE').length,
    };

    return { pending, scheduled, inTransit, urgent, totalWeight, byCategory };
  }, [requests]);

  const recentRequests = useMemo(
    () => [...requests].sort((a, b) => b.id - a.id).slice(0, 5),
    [requests],
  );

  return (
    <PageShell
      title="Overview Dashboard"
      subtitle="Live metrics from the medical-waste collection simulator"
    >
      {/* Problem Statement & Demo Launchpad */}
      <div className="rounded-2xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-300">
              Biomedical Waste Logistics Simulator
            </span>
            <p className="text-sm font-medium text-slate-800 leading-relaxed pt-1">
              Hospitals generate dangerous biomedical waste every day — this simulator uses core data structures to prioritize urgent pickups and route collection trucks safely.
            </p>
          </div>
          <button
            onClick={() => navigate('/requests')}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 transition active:scale-95 shrink-0"
          >
            <Play className="h-4 w-4 fill-white" /> Start Demo
          </button>
        </div>

        {/* 3-Step Demo Roadmap */}
        <div className="mt-4 pt-3 border-t border-emerald-200/60 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            onClick={() => navigate('/requests')}
            className="flex items-center gap-2.5 rounded-xl bg-white/80 p-2.5 border border-emerald-100 hover:border-emerald-300 hover:bg-white cursor-pointer transition"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">1</span>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 truncate">Waste Requests</div>
              <div className="text-[11px] text-slate-500 truncate">Review requests & spot urgent pickups</div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400 ml-auto shrink-0" />
          </div>

          <div
            onClick={() => navigate('/route-planner')}
            className="flex items-center gap-2.5 rounded-xl bg-white/80 p-2.5 border border-emerald-100 hover:border-emerald-300 hover:bg-white cursor-pointer transition"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">2</span>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 truncate">Route Planner</div>
              <div className="text-[11px] text-slate-500 truncate">Plan priority-aware collection route</div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400 ml-auto shrink-0" />
          </div>

          <div
            onClick={() => navigate('/route-planner')}
            className="flex items-center gap-2.5 rounded-xl bg-white/80 p-2.5 border border-emerald-100 hover:border-emerald-300 hover:bg-white cursor-pointer transition"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">3</span>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 truncate">Dijkstra Steps</div>
              <div className="text-[11px] text-slate-500 truncate">Explore shortest paths step-by-step</div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400 ml-auto shrink-0" />
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Requests</span>
            <Activity className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{requests.length}</div>
          <p className="mt-1 text-xs text-slate-500">Dynamic 1D array buffer</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">{stats.pending}</div>
          <p className="mt-1 text-xs text-slate-500">Awaiting dispatch</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">High Urgency</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600">{stats.urgent}</div>
          <p className="mt-1 text-xs text-slate-500">Urgency score ≥ 75</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Weight</span>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats.totalWeight.toFixed(1)}</div>
          <p className="mt-1 text-xs text-slate-500">Kilograms total</p>
        </div>
      </div>

      {/* Status + Category breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-500" />
            Status Breakdown
          </h3>
          <div className="space-y-2">
            {(['PENDING', 'SCHEDULED', 'IN_TRANSIT', 'COLLECTED', 'PROCESSED', 'CANCELLED'] as const).map((s) => {
              const count = requests.filter((r) => r.status === s).length;
              const pct = requests.length > 0 ? (count / requests.length) * 100 : 0;
              const colors: Record<string, string> = {
                PENDING: 'bg-amber-400',
                SCHEDULED: 'bg-blue-400',
                IN_TRANSIT: 'bg-sky-500',
                COLLECTED: 'bg-emerald-500',
                PROCESSED: 'bg-teal-600',
                CANCELLED: 'bg-slate-400',
              };
              return (
                <div key={s}>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span className="font-medium">{s.replace('_', ' ')}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${colors[s]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Waste Category Distribution
          </h3>
          <div className="space-y-3">
            {(['YELLOW', 'RED', 'WHITE', 'BLUE'] as const).map((cat) => {
              const count = stats.byCategory[cat];
              const pct = requests.length > 0 ? (count / requests.length) * 100 : 0;
              const meta = WASTE_CATEGORIES[cat];
              return (
                <div key={cat}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`rounded px-2 py-0.5 text-[11px] font-semibold border ${meta.badgeColor}`}>
                      {meta.name}
                    </span>
                    <span className="text-xs text-slate-500">{count} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all bg-emerald-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800">Recent Requests</h3>
          <button
            onClick={() => navigate('/requests')}
            className="text-xs text-emerald-700 font-semibold hover:underline"
          >
            View all →
          </button>
        </div>
        {requests.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No requests yet. Add some from the Waste Requests page.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 pr-3 font-semibold text-slate-500">ID</th>
                  <th className="text-left py-2 pr-3 font-semibold text-slate-500">Facility</th>
                  <th className="text-left py-2 pr-3 font-semibold text-slate-500">Category</th>
                  <th className="text-right py-2 pr-3 font-semibold text-slate-500">Weight</th>
                  <th className="text-right py-2 font-semibold text-slate-500">Urgency</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((r) => {
                  const meta = WASTE_CATEGORIES[r.wasteCategory];
                  return (
                    <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-2 pr-3 font-mono text-slate-600">#{r.id}</td>
                      <td className="py-2 pr-3 text-slate-700 max-w-[160px] truncate">{r.facilityName}</td>
                      <td className="py-2 pr-3">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border ${meta.badgeColor}`}>
                          {r.wasteCategory}
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-right text-slate-600">{r.wasteWeightKg} kg</td>
                      <td className="py-2 text-right">
                        <span className={`font-bold ${r.urgencyScore >= 75 ? 'text-rose-600' : r.urgencyScore >= 50 ? 'text-amber-600' : 'text-slate-600'}`}>
                          {r.urgencyScore}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageShell>
  );
};
