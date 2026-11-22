import React, { useState, useMemo, useCallback } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Play, RotateCcw, MapPin, Truck, AlertTriangle, ArrowRight } from 'lucide-react';
import { LeafletMap } from '../components/visualization/LeafletMap';
import {
  SAMPLE_MAP_NODES,
  SAMPLE_MAP_EDGES,
  computeHospitalPriorities,
  buildCollectionRoute,
  dijkstra,
  buildWeightedAdjMatrix,
  reconstructPath,
} from '../dsa/graphs/weightedGraph';
import type { MapNode, MapEdge, CollectionRoute, HospitalPriority, DijkstraStep } from '../dsa/graphs/weightedGraph';

// ──── SVG Map Constants ────
const SVG_W = 620;
const SVG_H = 460;
const NODE_R = 24;

// ──── Color helpers ────
function fillColor(node: MapNode, isOnRoute: boolean, _routeIdx: number): string {
  if (node.type === 'TREATMENT_PLANT') return '#ecfdf5';
  if (isOnRoute) {
    if (node.wasteFillPercent >= 80) return '#fef2f2';
    if (node.wasteFillPercent >= 50) return '#fff7ed';
    return '#f0fdf4';
  }
  return '#f8fafc';
}

function strokeColor(node: MapNode, isOnRoute: boolean): string {
  if (node.type === 'TREATMENT_PLANT') return '#059669';
  if (isOnRoute) {
    if (node.wasteFillPercent >= 80) return '#dc2626';
    if (node.wasteFillPercent >= 50) return '#ea580c';
    return '#16a34a';
  }
  return '#94a3b8';
}

function priorityBadgeColor(score: number): string {
  if (score >= 80) return 'bg-rose-100 text-rose-800 border-rose-300';
  if (score >= 60) return 'bg-amber-100 text-amber-800 border-amber-300';
  if (score >= 40) return 'bg-sky-100 text-sky-800 border-sky-300';
  return 'bg-slate-100 text-slate-600 border-slate-300';
}

function fillBarColor(pct: number): string {
  if (pct >= 80) return 'bg-rose-500';
  if (pct >= 50) return 'bg-amber-500';
  return 'bg-emerald-500';
}

// ──── Page Component ────
export const RoutePlanner: React.FC = () => {
  const [nodes] = useState<MapNode[]>(SAMPLE_MAP_NODES);
  const [edges] = useState<MapEdge[]>(SAMPLE_MAP_EDGES);
  const [priorityWeight, setPriorityWeight] = useState(2.0);
  const [distanceWeight, setDistanceWeight] = useState(1.0);
  const [route, setRoute] = useState<CollectionRoute | null>(null);
  const [priorities, setPriorities] = useState<HospitalPriority[]>([]);
  const [animStep, setAnimStep] = useState(-1);
  const [showDijkstra, setShowDijkstra] = useState(false);
  const [dijkstraSource, setDijkstraSource] = useState(7);
  const [dijkstraStepIdx, setDijkstraStepIdx] = useState(-1);
  const [viewTab, setViewTab] = useState<'live-map' | 'map' | 'dijkstra' | 'matrix'>('live-map');

  const depotId = 7; // Treatment plant

  // Compute priorities
  const computedPriorities = useMemo(() => computeHospitalPriorities(nodes), [nodes]);

  // Adjacency matrix for display
  const adjMatrix = useMemo(() => buildWeightedAdjMatrix(nodes.length, edges), [nodes, edges]);

  // Run route optimization
  const runOptimization = useCallback(() => {
    const p = computeHospitalPriorities(nodes);
    setPriorities(p);
    const r = buildCollectionRoute(nodes, edges, depotId, p, priorityWeight, distanceWeight);
    setRoute(r);
    setAnimStep(0);
  }, [nodes, edges, priorityWeight, distanceWeight]);

  // Run Dijkstra visualization
  const dijkstraResult = useMemo(() => {
    if (!showDijkstra) return null;
    return dijkstra(adjMatrix, dijkstraSource);
  }, [adjMatrix, dijkstraSource, showDijkstra]);

  const runDijkstra = useCallback(() => {
    setShowDijkstra(true);
    setDijkstraStepIdx(0);
    setViewTab('dijkstra');
  }, []);

  const reset = useCallback(() => {
    setRoute(null);
    setPriorities([]);
    setAnimStep(-1);
    setShowDijkstra(false);
    setDijkstraStepIdx(-1);
  }, []);

  // Determine which nodes are on the animated route so far
  const routeNodesSet = useMemo(() => {
    if (!route || animStep < 0) return new Set<number>();
    return new Set(route.visitOrder.slice(0, animStep + 1));
  }, [route, animStep]);

  // Data-driven first-stop explanation derived strictly from actual scoring logic
  const firstStopInfo = useMemo(() => {
    if (!route || route.visitOrder.length < 2) return null;
    const firstFacilityId = route.visitOrder[1];
    const firstNode = nodes.find((n) => n.id === firstFacilityId);
    const activePriorities = priorities.length > 0 ? priorities : computedPriorities;
    const firstPrio = activePriorities.find((p) => p.facilityId === firstFacilityId);
    if (!firstNode || !firstPrio) return null;

    const firstHop = route.hops[0];
    const dist = firstHop ? firstHop.distKm : 0;

    const reasons: string[] = [];
    reasons.push(`${firstNode.wasteFillPercent}% storage fill (+${firstPrio.breakdown.fillUrgency} pts)`);
    if (firstPrio.breakdown.hazardBonus > 0) {
      reasons.push(`active biohazard presence (+${firstPrio.breakdown.hazardBonus} pts)`);
    }
    if (firstPrio.breakdown.outputPressure > 0) {
      reasons.push(`daily output of ${firstNode.wasteOutputKg} kg/day (+${firstPrio.breakdown.outputPressure} pts)`);
    }
    if (firstPrio.breakdown.overflowRisk > 0) {
      reasons.push(`critical overflow risk (+${firstPrio.breakdown.overflowRisk} pts)`);
    }

    return {
      facilityName: firstNode.label,
      nodeId: firstNode.id,
      priorityScore: firstPrio.priorityScore,
      distanceKm: dist,
      totalTripKm: route.totalDistanceKm,
      facilitiesCount: route.visitOrder.length - 2,
      reasonsSummary: reasons.join(', '),
    };
  }, [route, nodes, priorities, computedPriorities]);

  // Route edges for SVG
  const routeEdgesForSvg = useMemo(() => {
    if (!route || animStep < 0) return [];
    const result: { from: MapNode; to: MapNode; idx: number }[] = [];
    const count = Math.min(animStep, route.hops.length);
    for (let i = 0; i < count; i++) {
      const hop = route.hops[i];
      result.push({ from: nodes[hop.from], to: nodes[hop.to], idx: i });
    }
    return result;
  }, [route, animStep, nodes]);

  // Dijkstra current step data
  const dijkStep: DijkstraStep | null = dijkstraResult && dijkstraStepIdx >= 0 && dijkstraStepIdx < dijkstraResult.steps.length
    ? dijkstraResult.steps[dijkstraStepIdx]
    : null;

  const dijkVisited = dijkStep ? new Set(dijkStep.visited) : new Set<number>();

  return (
    <PageShell
      title="Route Planner — Priority-Aware Collection Route"
      subtitle="Priority-aware collection route heuristic + Dijkstra's shortest path for optimal hospital waste collection"
      complexity="Dijkstra: O(V²) · Priority Scoring: O(V) · Route Builder: O(V⁴) · Adj. Matrix: O(V²) space"
    >
      {/* ── Controls ── */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-1">
          {(['live-map', 'map', 'dijkstra', 'matrix'] as const).map((v) => (
            <button key={v} onClick={() => setViewTab(v)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${viewTab === v ? 'bg-emerald-600 text-white' : 'border border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
              {v === 'live-map' ? '🌍 Live Geographic Map' : v === 'map' ? '🗺️ Schematic Graph' : v === 'dijkstra' ? '📐 Dijkstra Steps' : '⬜ Weight Matrix'}
            </button>
          ))}
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <div className="flex gap-1 items-center">
            <label className="text-xs text-slate-500">Priority ×</label>
            <input type="number" step={0.5} min={0} max={10} value={priorityWeight}
              onChange={(e) => setPriorityWeight(parseFloat(e.target.value) || 1)}
              className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex gap-1 items-center">
            <label className="text-xs text-slate-500">Distance ×</label>
            <input type="number" step={0.5} min={0} max={10} value={distanceWeight}
              onChange={(e) => setDistanceWeight(parseFloat(e.target.value) || 1)}
              className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <button onClick={runOptimization}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 transition active:scale-95">
            <Play className="h-3.5 w-3.5 fill-white" /> Plan collection route
          </button>
          <button onClick={runDijkstra}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition">
            <MapPin className="h-3 w-3" /> Run Dijkstra
          </button>
          <button onClick={reset}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
      </div>

      {/* ── First Stop Selection Decision (Data-Driven Demo Callout) ── */}
      {route && firstStopInfo && (
        <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
              <Truck className="h-5 w-5" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="font-bold text-emerald-950 text-sm">
                Why did the truck choose {firstStopInfo.facilityName} first?
              </div>
              <p className="text-slate-700 leading-relaxed">
                The truck departs from Treatment Plant depot and visits <strong>{firstStopInfo.facilityName}</strong> (Node {firstStopInfo.nodeId}) first because it scored <strong>{firstStopInfo.priorityScore}/100</strong> on collection priority — driven by {firstStopInfo.reasonsSummary}, located <strong>{firstStopInfo.distanceKm} km</strong> away.
              </p>
              <p className="text-emerald-800 font-semibold pt-0.5">
                ✓ Priority-aware collection route: <strong>{firstStopInfo.totalTripKm} km total trip</strong> visiting <strong>{firstStopInfo.facilitiesCount} facilities</strong> before returning to the treatment plant.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Route Animation Stepper ── */}
      {route && (viewTab === 'map' || viewTab === 'live-map') && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1">
            <button onClick={() => setAnimStep(Math.max(0, animStep - 1))} disabled={animStep <= 0}
              className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition">‹ Prev</button>
            <button onClick={() => setAnimStep(Math.min(route.visitOrder.length - 1, animStep + 1))} disabled={animStep >= route.visitOrder.length - 1}
              className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition">Next ›</button>
          </div>
          <span className="text-xs text-slate-500">Stop {animStep + 1} / {route.visitOrder.length}</span>
          <div className="flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800">
            <Truck className="h-3 w-3 inline mr-1" />
            Visiting: <strong>{nodes[route.visitOrder[animStep]]?.label}</strong>
            {animStep > 0 && route.hops[animStep - 1] && (
              <> · {route.hops[animStep - 1].distKm} km from previous · Cumulative: {route.hops[animStep - 1].cumDistKm} km</>
            )}
          </div>
        </div>
      )}

      {/* ── Dijkstra Step Controls ── */}
      {showDijkstra && dijkstraResult && viewTab === 'dijkstra' && (
        <div className="space-y-3">
          <div className="rounded-xl bg-indigo-50 border border-indigo-200 px-3.5 py-2 text-xs text-indigo-900">
            <strong>What did Dijkstra calculate?</strong> Dijkstra's Algorithm calculated the single-source shortest path (minimum road distance in km) from <strong>{nodes[dijkstraSource].label}</strong> (Node {dijkstraSource}) to all other facilities along biohazard-approved road segments.
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-2 items-center">
              <label className="text-xs text-slate-500">Source:</label>
              <select value={dijkstraSource} onChange={(e) => { setDijkstraSource(parseInt(e.target.value)); setDijkstraStepIdx(0); setShowDijkstra(false); setTimeout(() => setShowDijkstra(true), 0); }}
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {nodes.map((n) => <option key={n.id} value={n.id}>{n.id}: {n.label}</option>)}
              </select>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setDijkstraStepIdx(Math.max(0, dijkstraStepIdx - 1))} disabled={dijkstraStepIdx <= 0}
                className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition">‹ Prev</button>
              <button onClick={() => setDijkstraStepIdx(Math.min(dijkstraResult.steps.length - 1, dijkstraStepIdx + 1))} disabled={dijkstraStepIdx >= dijkstraResult.steps.length - 1}
                className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition">Next ›</button>
            </div>
            <span className="text-xs text-slate-500">Step {dijkstraStepIdx + 1} / {dijkstraResult.steps.length}</span>
            {dijkStep && (
              <div className="flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-800">
                Processing: <strong>{nodes[dijkStep.currentNode]?.label}</strong> (node {dijkStep.currentNode})
                {dijkStep.relaxedEdges.length > 0 && (
                  <> · Relaxed {dijkStep.relaxedEdges.length} edge(s):
                    {dijkStep.relaxedEdges.map((e, i) => (
                      <span key={i} className="ml-1 font-mono">
                        {nodes[e.to]?.label.split(' ').slice(0, 2).join(' ')} (node {e.to}): {e.oldDist === Infinity ? '∞' : e.oldDist.toFixed(1)} → {e.newDist.toFixed(1)} km
                      </span>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── LIVE GEOGRAPHIC MAP VIEW ── */}
      {viewTab === 'live-map' && (
        <LeafletMap
          nodes={nodes}
          edges={edges}
          route={route}
          animStep={animStep}
          priorities={priorities.length > 0 ? priorities : computedPriorities}
        />
      )}

      {/* ── MAP VIEW ── */}
      {viewTab === 'map' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <svg width={SVG_W} height={SVG_H} style={{ width: '100%', maxWidth: `${SVG_W}px`, display: 'block' }}>
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* All edges (grey) */}
            {edges.map((edge, i) => {
              const from = nodes[edge.from];
              const to = nodes[edge.to];
              return (
                <g key={`edge-${i}`}>
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={edge.isBiohazardApproved ? '#cbd5e1' : '#fecaca'}
                    strokeWidth="1.5" strokeDasharray={edge.isBiohazardApproved ? '' : '4,3'} />
                  {/* Distance label */}
                  <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 6}
                    textAnchor="middle" fontSize="8" fill="#94a3b8" fontWeight="500">{edge.distanceKm}km</text>
                </g>
              );
            })}

            {/* Route path (animated overlay) */}
            {routeEdgesForSvg.map((re, i) => (
              <line key={`route-${i}`}
                x1={re.from.x} y1={re.from.y} x2={re.to.x} y2={re.to.y}
                stroke="#059669" strokeWidth="3" markerEnd="url(#arrowhead)"
                opacity={0.9}>
                <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />
              </line>
            ))}

            {/* Arrow marker */}
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#059669" />
              </marker>
            </defs>

            {/* Route order numbers along path */}
            {route && routeEdgesForSvg.map((re, i) => {
              const mx = (re.from.x + re.to.x) / 2;
              const my = (re.from.y + re.to.y) / 2 + 10;
              return (
                <g key={`route-num-${i}`}>
                  <circle cx={mx} cy={my} r={8} fill="#059669" />
                  <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="white" fontWeight="bold">{i + 1}</text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isOnRoute = routeNodesSet.has(node.id);
              const isCurrent = route && animStep >= 0 && route.visitOrder[animStep] === node.id;
              const prio = computedPriorities.find((p) => p.facilityId === node.id);
              return (
                <g key={node.id} transform={`translate(${node.x},${node.y})`}>
                  {/* Urgency ring for high-priority */}
                  {prio && prio.priorityScore >= 70 && (
                    <circle r={NODE_R + 5} fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" opacity={0.6}>
                      <animate attributeName="r" values={`${NODE_R + 4};${NODE_R + 7};${NODE_R + 4}`} dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Main circle */}
                  <circle r={NODE_R}
                    fill={isCurrent ? '#059669' : fillColor(node, isOnRoute, 0)}
                    stroke={isCurrent ? '#065f46' : strokeColor(node, isOnRoute)}
                    strokeWidth={isCurrent ? 3 : isOnRoute ? 2.5 : 1.5} />
                  {/* Fill level indicator (small arc) */}
                  {node.type !== 'TREATMENT_PLANT' && (
                    <circle r={NODE_R} fill="none"
                      stroke={node.wasteFillPercent >= 80 ? '#ef4444' : node.wasteFillPercent >= 50 ? '#f97316' : '#22c55e'}
                      strokeWidth="3"
                      strokeDasharray={`${(node.wasteFillPercent / 100) * 2 * Math.PI * NODE_R} ${2 * Math.PI * NODE_R}`}
                      strokeDashoffset={2 * Math.PI * NODE_R * 0.25}
                      opacity={0.4} />
                  )}
                  {/* Icon */}
                  <text textAnchor="middle" dominantBaseline="middle" fontSize="11" y={-5}
                    fill={isCurrent ? 'white' : '#1e293b'} fontWeight="bold">
                    {node.type === 'TREATMENT_PLANT' ? '♻️' : node.type === 'HOSPITAL' ? '🏥' : '🏨'}
                  </text>
                  {/* Label */}
                  <text textAnchor="middle" dominantBaseline="middle" fontSize="7" y={8}
                    fill={isCurrent ? '#d1fae5' : '#64748b'}>
                    {node.label.split(' ').slice(0, 2).join(' ')}
                  </text>
                  {/* Fill % badge */}
                  {node.type !== 'TREATMENT_PLANT' && (
                    <g transform={`translate(${NODE_R - 2}, ${-NODE_R + 2})`}>
                      <rect x={-10} y={-6} width={20} height={12} rx={3}
                        fill={node.wasteFillPercent >= 80 ? '#fef2f2' : node.wasteFillPercent >= 50 ? '#fff7ed' : '#f0fdf4'}
                        stroke={node.wasteFillPercent >= 80 ? '#fca5a5' : node.wasteFillPercent >= 50 ? '#fdba74' : '#86efac'}
                        strokeWidth="0.5" />
                      <text textAnchor="middle" dominantBaseline="middle" fontSize="7" fontWeight="bold"
                        fill={node.wasteFillPercent >= 80 ? '#dc2626' : node.wasteFillPercent >= 50 ? '#ea580c' : '#16a34a'}>
                        {node.wasteFillPercent}%
                      </text>
                    </g>
                  )}
                  {/* Hazard icon */}
                  {node.hasHazardousWaste && (
                    <text x={-NODE_R + 2} y={-NODE_R + 6} fontSize="9">⚠️</text>
                  )}
                </g>
              );
            })}
          </svg>
          <div className="p-3 text-[10px] text-slate-400 border-t border-slate-100 flex gap-4">
            <span>🏥 Hospital</span> <span>🏨 Clinic</span> <span>♻️ Treatment Plant</span>
            <span>⚠️ Hazardous waste</span>
            <span className="text-rose-400">— — Non-biohazard route</span>
            <span className="text-emerald-600">━━ Collection route</span>
          </div>
        </div>
      )}

      {/* ── DIJKSTRA STEP VIEW ── */}
      {viewTab === 'dijkstra' && showDijkstra && dijkstraResult && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <svg width={SVG_W} height={SVG_H} style={{ width: '100%', maxWidth: `${SVG_W}px`, display: 'block' }}>
            <defs>
              <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid2)" />

            {/* Edges with weights */}
            {edges.map((edge, i) => {
              const from = nodes[edge.from];
              const to = nodes[edge.to];
              const isRelaxed = dijkStep?.relaxedEdges.some((r) => (r.to === edge.to && dijkStep.currentNode === edge.from) || (r.to === edge.from && dijkStep.currentNode === edge.to));
              return (
                <g key={`de-${i}`}>
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={isRelaxed ? '#6366f1' : '#e2e8f0'} strokeWidth={isRelaxed ? 3 : 1.5} />
                  <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 6}
                    textAnchor="middle" fontSize="8" fill={isRelaxed ? '#4338ca' : '#94a3b8'} fontWeight={isRelaxed ? 'bold' : '500'}>
                    {edge.distanceKm}
                  </text>
                </g>
              );
            })}

            {/* Nodes with distance labels */}
            {nodes.map((node) => {
              const isVisited = dijkVisited.has(node.id);
              const isCurrent = dijkStep?.currentNode === node.id;
              const dist = dijkStep?.distances[node.id] ?? Infinity;
              const isSource = node.id === dijkstraSource;
              return (
                <g key={node.id} transform={`translate(${node.x},${node.y})`}>
                  <circle r={NODE_R}
                    fill={isCurrent ? '#4f46e5' : isSource ? '#dbeafe' : isVisited ? '#e0e7ff' : '#f8fafc'}
                    stroke={isCurrent ? '#312e81' : isSource ? '#3b82f6' : isVisited ? '#818cf8' : '#94a3b8'}
                    strokeWidth={isCurrent ? 3 : 1.5} />
                  <text textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="bold"
                    fill={isCurrent ? 'white' : '#1e293b'} y={-5}>{node.id}</text>
                  <text textAnchor="middle" dominantBaseline="middle" fontSize="7"
                    fill={isCurrent ? '#c7d2fe' : '#64748b'} y={6}>
                    {node.label.split(' ').slice(0, 2).join(' ')}
                  </text>
                  {/* Distance badge */}
                  <g transform={`translate(0, ${NODE_R + 10})`}>
                    <rect x={-16} y={-7} width={32} height={14} rx={4}
                      fill={isCurrent ? '#4f46e5' : isVisited ? '#e0e7ff' : '#f1f5f9'}
                      stroke={isCurrent ? '#312e81' : '#c7d2fe'} strokeWidth="0.5" />
                    <text textAnchor="middle" dominantBaseline="middle" fontSize="8" fontWeight="bold"
                      fill={isCurrent ? 'white' : isVisited ? '#4338ca' : '#94a3b8'}>
                      {dist === Infinity ? '∞' : dist.toFixed(1)}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
          <div className="p-3 text-[10px] text-slate-400 border-t border-slate-100">
            🔵 Source · 🟣 Currently processing · Distance labels show dist[] values · Purple edges = relaxed in this step
          </div>
        </div>
      )}

      {/* ── WEIGHT MATRIX VIEW ── */}
      {viewTab === 'matrix' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm overflow-auto">
          <h4 className="text-sm font-bold text-slate-800 mb-3">Weighted Adjacency Matrix ({nodes.length} × {nodes.length}) · O(V²) space</h4>
          <table className="border-collapse text-xs font-mono">
            <thead>
              <tr>
                <th className="border border-slate-300 px-2 py-1 bg-slate-100 text-slate-500"></th>
                {nodes.map((n) => (
                  <th key={n.id} className="border border-slate-300 px-2 py-1 bg-slate-100 text-slate-600">{n.id}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adjMatrix.map((row, i) => (
                <tr key={i}>
                  <th className="border border-slate-300 px-2 py-1 bg-slate-100 text-slate-600">{i}</th>
                  {row.map((cell, j) => (
                    <td key={j} className={`border border-slate-200 px-2 py-1 text-center ${
                      cell === 0 ? 'bg-slate-50 text-slate-300' :
                      cell === Infinity ? 'text-slate-300' :
                      'bg-emerald-50 text-emerald-700 font-bold'
                    }`}>
                      {cell === Infinity ? '∞' : cell === 0 ? '0' : cell.toFixed(1)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-slate-400 mt-2">
            Values = distance in km · ∞ = no direct edge · 0 = self · Symmetric matrix (undirected graph)
          </p>
        </div>
      )}

      {/* ── Hospital Priority Rankings ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Hospital Priority Rankings (Collection Order)
        </h4>
        <p className="text-[10px] text-slate-400 mb-3">
          Priority = Fill Urgency (0–40) + Hazard Bonus (0–25) + Output Pressure (0–20) + Overflow Risk (0–15)
        </p>
        <div className="space-y-2">
          {(priorities.length > 0 ? priorities : computedPriorities).map((p, idx) => {
            const node = nodes.find((n) => n.id === p.facilityId)!;
            return (
              <div key={p.facilityId} className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2 hover:bg-slate-50 transition">
                <span className="text-xs font-bold text-slate-400 w-5">#{idx + 1}</span>
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold border ${priorityBadgeColor(p.priorityScore)}`}>
                  {p.priorityScore}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-800 truncate">{p.label}</div>
                  <div className="text-[10px] text-slate-400">
                    Fill: {p.breakdown.fillUrgency} · Hazard: {p.breakdown.hazardBonus} · Output: {p.breakdown.outputPressure} · Overflow: {p.breakdown.overflowRisk}
                  </div>
                </div>
                <div className="w-24">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-2 rounded-full transition-all ${fillBarColor(node.wasteFillPercent)}`}
                      style={{ width: `${node.wasteFillPercent}%` }} />
                  </div>
                  <div className="text-[9px] text-slate-400 text-right mt-0.5">{node.wasteFillPercent}% full</div>
                </div>
                {node.hasHazardousWaste && (
                  <span className="text-[9px] rounded bg-rose-50 border border-rose-200 text-rose-700 px-1.5 py-0.5 font-semibold">☣ HAZARD</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Priority-Aware Collection Route Summary ── */}
      {route && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Truck className="h-4 w-4 text-emerald-600" />
            Priority-Aware Collection Route
          </h4>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-xl border border-slate-200 p-3 text-center">
              <div className="text-lg font-extrabold text-slate-900">{route.totalDistanceKm} km</div>
              <div className="text-[10px] text-slate-500">Total Distance</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 text-center">
              <div className="text-lg font-extrabold text-emerald-700">{route.visitOrder.length - 2}</div>
              <div className="text-[10px] text-slate-500">Facilities Visited</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 text-center">
              <div className="text-lg font-extrabold text-indigo-700">{route.routeScore}</div>
              <div className="text-[10px] text-slate-500">Route Score (priority/km)</div>
            </div>
          </div>

          {/* Route sequence */}
          <div className="flex flex-wrap items-center gap-1.5">
            {route.visitOrder.map((nodeId, i) => {
              const isActive = i <= animStep;
              return (
                <React.Fragment key={i}>
                  <div className={`flex items-center gap-1 rounded-lg border-2 px-2 py-1.5 text-xs font-semibold ${
                    isActive ? 'bg-emerald-50 border-emerald-400 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <span className="text-[9px] opacity-60">{i + 1}.</span>
                    {nodes[nodeId].type === 'TREATMENT_PLANT' ? '♻️' : '🏥'}{' '}
                    {nodes[nodeId].label.split(' ').slice(0, 2).join(' ')}
                  </div>
                  {i < route.visitOrder.length - 1 && (
                    <ArrowRight className="h-3 w-3 text-slate-300" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Hop table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 pr-3 font-semibold text-slate-500">Hop</th>
                  <th className="text-left py-2 pr-3 font-semibold text-slate-500">From</th>
                  <th className="text-left py-2 pr-3 font-semibold text-slate-500">To</th>
                  <th className="text-right py-2 pr-3 font-semibold text-slate-500">Distance</th>
                  <th className="text-right py-2 font-semibold text-slate-500">Cumulative</th>
                </tr>
              </thead>
              <tbody>
                {route.hops.map((hop, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-2 pr-3 font-mono text-slate-500">#{i + 1}</td>
                    <td className="py-2 pr-3 text-slate-700">{nodes[hop.from].label.split(' ').slice(0, 2).join(' ')}</td>
                    <td className="py-2 pr-3 text-slate-700 font-semibold">{nodes[hop.to].label.split(' ').slice(0, 2).join(' ')}</td>
                    <td className="py-2 pr-3 text-right text-slate-600">{hop.distKm} km</td>
                    <td className="py-2 text-right font-bold text-emerald-700">{hop.cumDistKm} km</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Dijkstra Distance Table ── */}
      {showDijkstra && dijkstraResult && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-3">
            Shortest Distances from Node {dijkstraSource}: {nodes[dijkstraSource].label}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 pr-3 font-semibold text-slate-500">Node</th>
                  <th className="text-left py-2 pr-3 font-semibold text-slate-500">Facility</th>
                  <th className="text-right py-2 pr-3 font-semibold text-slate-500">Shortest Distance</th>
                  <th className="text-left py-2 font-semibold text-slate-500">Path</th>
                </tr>
              </thead>
              <tbody>
                {dijkstraResult.dist.map((d, i) => {
                  const path = reconstructPath(dijkstraResult.prev, i);
                  const pathWithNames = path.length > 1
                    ? path.map((id) => `${nodes[id].label.split(' ').slice(0, 2).join(' ')} (${id})`).join(' → ')
                    : (i === dijkstraSource ? `Origin: ${nodes[i].label} (${i})` : 'Unreachable');
                  return (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-2 pr-3 font-mono text-slate-600">{i}</td>
                      <td className="py-2 pr-3 text-slate-700 font-medium">{nodes[i].label}</td>
                      <td className="py-2 pr-3 text-right font-bold text-indigo-700">{d === Infinity ? '∞' : d.toFixed(1)} km</td>
                      <td className="py-2 font-mono text-slate-600 text-[11px]">
                        {pathWithNames}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-3 rounded-xl bg-indigo-50 border border-indigo-200 p-3 text-xs text-indigo-900 leading-relaxed">
            <strong>What did Dijkstra calculate?</strong> Dijkstra's algorithm determined the absolute minimum road distance (in km) from <strong>{nodes[dijkstraSource].label}</strong> to each facility across biohazard-compliant edges, computing the mathematically optimal shortest path for each facility.
          </div>
        </div>
      )}

      {/* ── Algorithm DSA Reference ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">DSA Concepts Used</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3">
            <div className="text-xs font-bold text-indigo-800 mb-1">Dijkstra's Algorithm</div>
            <div className="text-[10px] text-indigo-600">
              Single-source shortest path · O(V²) with array scan · Greedy + relaxation · Non-negative edge weights
            </div>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
            <div className="text-xs font-bold text-emerald-800 mb-1">Weighted Adjacency Matrix</div>
            <div className="text-[10px] text-emerald-600">
              O(V²) space · O(1) edge lookup · Dense graph representation · Undirected & symmetric
            </div>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
            <div className="text-xs font-bold text-amber-800 mb-1">Greedy Heuristic (TSP variant)</div>
            <div className="text-[10px] text-amber-600">
              Priority-weighted nearest neighbor · Composite scoring function · O(V⁴) for small V · NP-hard approximation
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};
