import React, { useState, useMemo } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { PlusCircle, RefreshCw, Trash2, Search, ChevronUp, ChevronDown, X, AlertTriangle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WASTE_CATEGORIES } from '../models/WasteCategory';
import type { WasteColorCode } from '../models/WasteCategory';
import type { WasteRequest } from '../models/WasteRequest';
import { useNavigate } from 'react-router-dom';

const WARDS = [
  'ICU Ward A', 'Pathology Lab 2', 'Operation Theater 4',
  'Emergency Casualty', 'Dialysis Unit', 'Biochemistry Lab',
  'Chemotherapy Ward', 'General Surgery Ward',
];

const HOSPITALS = [
  'Apex Memorial Hospital', 'City Care Diagnostic Center',
  'LifeSpring Children Clinic', 'St. Jude Research Hospital',
  'Metro Trauma & Orthopedic Center', 'Green Valley Health Center',
];

type SortField = 'id' | 'urgencyScore' | 'wasteWeightKg' | 'facilityName' | 'wasteCategory';

export const WasteRequests: React.FC = () => {
  const { requests, addRequest, deleteRequest, updateStatus, resetRequests } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<WasteColorCode | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<WasteRequest['status'] | 'ALL'>('ALL');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortAsc, setSortAsc] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const mostUrgentRequest = useMemo(() => {
    if (requests.length === 0) return null;
    return [...requests].reduce((max, r) => (r.urgencyScore > max.urgencyScore ? r : max), requests[0]);
  }, [requests]);

  const urgentCount = useMemo(() => {
    return requests.filter((r) => r.urgencyScore >= 75).length;
  }, [requests]);

  // Form state
  const [form, setForm] = useState({
    facilityName: HOSPITALS[0],
    wardOrDepartment: WARDS[0],
    wasteCategory: 'YELLOW' as WasteColorCode,
    wasteWeightKg: 5.0,
    urgencyScore: 50,
    status: 'PENDING' as WasteRequest['status'],
    hazardNote: '',
  });

  const filtered = useMemo(() => {
    let data = [...requests];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.facilityName.toLowerCase().includes(q) ||
          r.wardOrDepartment.toLowerCase().includes(q) ||
          String(r.id).includes(q),
      );
    }
    if (filterCat !== 'ALL') data = data.filter((r) => r.wasteCategory === filterCat);
    if (filterStatus !== 'ALL') data = data.filter((r) => r.status === filterStatus);
    data.sort((a, b) => {
      const av = a[sortField] as string | number;
      const bv = b[sortField] as string | number;
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
    return data;
  }, [requests, search, filterCat, filterStatus, sortField, sortAsc]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="opacity-25">↕</span>;
    return sortAsc ? <ChevronUp className="h-3 w-3 inline" /> : <ChevronDown className="h-3 w-3 inline" />;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRequest({
      facilityId: HOSPITALS.indexOf(form.facilityName) + 1,
      facilityName: form.facilityName,
      wardOrDepartment: form.wardOrDepartment,
      wasteCategory: form.wasteCategory,
      wasteWeightKg: form.wasteWeightKg,
      urgencyScore: form.urgencyScore,
      status: form.status,
      hazardNote: form.hazardNote || undefined,
    });
    setShowForm(false);
  };

  return (
    <PageShell
      title="Waste Collection Requests"
      subtitle={`Dynamic 1D array buffer · ${requests.length} records · ${filtered.length} shown`}
      complexity="Access: O(1) · Search: O(n) · Append: O(1) amortized · Insert/Delete: O(n)"
      actions={
        <>
          <button
            onClick={() => { if (window.confirm('Reset to 20 sample records?')) resetRequests(); }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Data
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            New Request
          </button>
        </>
      }
    >
      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">New Waste Collection Request</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Facility</label>
                  <select value={form.facilityName} onChange={(e) => setForm({ ...form, facilityName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {HOSPITALS.map((h) => <option key={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Ward / Dept</label>
                  <select value={form.wardOrDepartment} onChange={(e) => setForm({ ...form, wardOrDepartment: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {WARDS.map((w) => <option key={w}>{w}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Waste Category</label>
                  <select value={form.wasteCategory} onChange={(e) => setForm({ ...form, wasteCategory: e.target.value as WasteColorCode })}
                    className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {(['YELLOW', 'RED', 'WHITE', 'BLUE'] as WasteColorCode[]).map((c) => (
                      <option key={c} value={c}>{WASTE_CATEGORIES[c].name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as WasteRequest['status'] })}
                    className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {['PENDING', 'SCHEDULED', 'IN_TRANSIT', 'COLLECTED', 'PROCESSED', 'CANCELLED'].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Weight (kg): {form.wasteWeightKg}</label>
                  <input type="range" min={0.5} max={50} step={0.5} value={form.wasteWeightKg}
                    onChange={(e) => setForm({ ...form, wasteWeightKg: parseFloat(e.target.value) })}
                    className="w-full" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Urgency Score: {form.urgencyScore}</label>
                  <input type="range" min={1} max={100} step={1} value={form.urgencyScore}
                    onChange={(e) => setForm({ ...form, urgencyScore: parseInt(e.target.value) })}
                    className="w-full" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Hazard Note (optional)</label>
                <input type="text" value={form.hazardNote}
                  onChange={(e) => setForm({ ...form, hazardNote: e.target.value })}
                  placeholder="e.g. Cytotoxic drugs, sharps container sealed"
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                  Add Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Demo Guidance: What a request contains & How to spot urgent pickup */}
      <div className="rounded-2xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white shrink-0">1</span>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                Demo Step 1: Waste Requests & Urgency Spotting
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Each collection record contains facility, ward, waste category, weight, and an <strong>Urgency Score (0–100)</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/route-planner')}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition shrink-0"
          >
            <span>Next: Plan collection route</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {mostUrgentRequest && (
          <div className="flex items-center gap-3 rounded-xl bg-white/90 border border-emerald-200 p-3 text-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600 shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-rose-700">How to spot urgent pickups: </span>
              <span className="text-slate-700">
                Scores <strong>≥ 75</strong> require immediate dispatch. Request <strong>#{mostUrgentRequest.id}</strong> from <strong>{mostUrgentRequest.facilityName}</strong> ({mostUrgentRequest.wardOrDepartment}) is highest with <strong>{mostUrgentRequest.urgencyScore}/100</strong> ({mostUrgentRequest.wasteWeightKg} kg of {mostUrgentRequest.wasteCategory} waste).
              </span>
            </div>
            <span className="rounded-lg bg-rose-50 border border-rose-200 px-2 py-1 text-[11px] font-bold text-rose-700 shrink-0">
              {urgentCount} Urgent (≥75)
            </span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs flex-1 min-w-[200px]">
          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by facility, ward, or ID…"
            className="flex-1 outline-none bg-transparent text-slate-700 placeholder-slate-400"
          />
          {search && <button onClick={() => setSearch('')}><X className="h-3.5 w-3.5 text-slate-400" /></button>}
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value as WasteColorCode | 'ALL')}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="ALL">All Categories</option>
          {(['YELLOW', 'RED', 'WHITE', 'BLUE'] as WasteColorCode[]).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as WasteRequest['status'] | 'ALL')}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="ALL">All Statuses</option>
          {(['PENDING', 'SCHEDULED', 'IN_TRANSIT', 'COLLECTED', 'PROCESSED', 'CANCELLED'] as const).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">No requests match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {([
                    ['id', 'ID'],
                    ['facilityName', 'Facility'],
                    ['wasteCategory', 'Category'],
                    ['wasteWeightKg', 'Weight'],
                    ['urgencyScore', 'Urgency'],
                  ] as [SortField, string][]).map(([field, label]) => (
                    <th key={field}
                      onClick={() => toggleSort(field)}
                      className="text-left px-4 py-2.5 font-semibold text-slate-500 cursor-pointer select-none hover:text-slate-700 whitespace-nowrap">
                      {label} <SortIcon field={field} />
                    </th>
                  ))}
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-500">Status</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const meta = WASTE_CATEGORIES[r.wasteCategory];
                  return (
                    <tr key={r.id} className={`border-b border-slate-50 transition-colors ${r.id === mostUrgentRequest?.id ? 'bg-rose-50/40 hover:bg-rose-50/60' : 'hover:bg-emerald-50/30'}`}>
                      <td className="px-4 py-2.5 font-mono text-slate-500">
                        #{r.id}
                        {r.id === mostUrgentRequest?.id && (
                          <span className="ml-1.5 rounded bg-rose-600 px-1 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">Top</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-slate-800 max-w-[180px] truncate">{r.facilityName}</div>
                        <div className="text-[11px] text-slate-400">{r.wardOrDepartment}</div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border ${meta.badgeColor}`}>
                          {r.wasteCategory}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">{r.wasteWeightKg} kg</td>
                      <td className="px-4 py-2.5">
                        <span className={`font-bold ${r.urgencyScore >= 75 ? 'text-rose-600' : r.urgencyScore >= 50 ? 'text-amber-600' : 'text-slate-600'}`}>
                          {r.urgencyScore}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <select
                          value={r.status}
                          onChange={(e) => updateStatus(r.id, e.target.value as WasteRequest['status'])}
                          className="rounded border border-slate-200 text-[11px] text-slate-600 px-1.5 py-0.5 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                          {(['PENDING', 'SCHEDULED', 'IN_TRANSIT', 'COLLECTED', 'PROCESSED', 'CANCELLED'] as const).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2.5">
                        <button onClick={() => {
                          if (window.confirm(`Delete request #${r.id}?`)) deleteRequest(r.id);
                        }}
                          className="text-slate-300 hover:text-rose-500 transition">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-400">
        Array index range: [0…{requests.length - 1}] · Filter result: {filtered.length} of {requests.length} records
      </p>
    </PageShell>
  );
};
