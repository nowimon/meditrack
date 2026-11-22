import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapNode, MapEdge, CollectionRoute, HospitalPriority } from '../../dsa/graphs/weightedGraph';

interface LeafletMapProps {
  nodes: MapNode[];
  edges: MapEdge[];
  route: CollectionRoute | null;
  animStep: number;
  priorities: HospitalPriority[];
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  nodes,
  edges,
  route,
  animStep,
  priorities,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center map around average coordinates
    const defaultCenter: [number, number] = [12.95, 77.60];
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layersRef.current = layerGroup;
    mapInstanceRef.current = map;

    // Leaflet needs invalidateSize after rendering in container
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      layersRef.current = null;
    };
  }, []);

  // Update markers, edges, and route overlay
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layers = layersRef.current;
    if (!map || !layers) return;

    layers.clearLayers();

    const priorityMap = new Map(priorities.map((p) => [p.facilityId, p]));

    // 1. Draw base road network (edges)
    edges.forEach((edge) => {
      const fromNode = nodes[edge.from];
      const toNode = nodes[edge.to];
      if (!fromNode?.lat || !fromNode?.lng || !toNode?.lat || !toNode?.lng) return;

      const polyline = L.polyline(
        [
          [fromNode.lat, fromNode.lng],
          [toNode.lat, toNode.lng],
        ],
        {
          color: edge.isBiohazardApproved ? '#94a3b8' : '#f87171',
          weight: 2,
          dashArray: edge.isBiohazardApproved ? undefined : '5, 5',
          opacity: 0.6,
        }
      );
      polyline.bindTooltip(
        `${fromNode.label.split(' ')[0]} ↔ ${toNode.label.split(' ')[0]}: ${edge.distanceKm} km ${
          edge.isBiohazardApproved ? '(Biohazard Approved)' : '(Standard Only)'
        }`,
        { sticky: true }
      );
      polyline.addTo(layers);
    });

    // 2. Draw Collection Route (if optimized)
    if (route && route.hops.length > 0) {
      const activeHopsCount = animStep >= 0 ? Math.min(animStep, route.hops.length) : route.hops.length;

      for (let i = 0; i < activeHopsCount; i++) {
        const hop = route.hops[i];
        const from = nodes[hop.from];
        const to = nodes[hop.to];
        if (!from?.lat || !from?.lng || !to?.lat || !to?.lng) continue;

        // Animated bold green route line
        const routeLine = L.polyline(
          [
            [from.lat, from.lng],
            [to.lat, to.lng],
          ],
          {
            color: '#059669',
            weight: 5,
            opacity: 0.9,
          }
        );
        routeLine.bindTooltip(
          `Stop #${i + 1}: ${from.label.split(' ')[0]} → ${to.label.split(' ')[0]} (${hop.distKm} km, Cum: ${hop.cumDistKm} km)`,
          { permanent: false, sticky: true }
        );
        routeLine.addTo(layers);

        // Midpoint badge with stop number
        const midLat = (from.lat + to.lat) / 2;
        const midLng = (from.lng + to.lng) / 2;
        const hopMarker = L.marker([midLat, midLng], {
          icon: L.divIcon({
            className: 'custom-hop-icon',
            html: `<div style="background-color:#059669; color:white; border-radius:9999px; width:20px; height:20px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold; border:2px solid white; box-shadow:0 1px 3px rgba(0,0,0,0.3);">${i + 1}</div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          }),
        });
        hopMarker.addTo(layers);
      }
    }

    // 3. Draw Facility Markers
    nodes.forEach((node) => {
      if (!node.lat || !node.lng) return;

      const prio = priorityMap.get(node.id);
      const isDepot = node.type === 'TREATMENT_PLANT';
      const isUrgent = prio && prio.priorityScore >= 70;

      const borderColor = isDepot ? '#059669' : isUrgent ? '#dc2626' : node.wasteFillPercent >= 50 ? '#ea580c' : '#2563eb';
      const bgColor = isDepot ? '#ecfdf5' : isUrgent ? '#fef2f2' : '#ffffff';
      const iconEmoji = isDepot ? '♻️' : node.type === 'HOSPITAL' ? '🏥' : '🏨';

      const customHtml = `
        <div style="position:relative; display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -50%);">
          <div style="background:${bgColor}; border:2.5px solid ${borderColor}; border-radius:9999px; width:38px; height:38px; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);">
            ${iconEmoji}
          </div>
          ${
            !isDepot
              ? `<div style="position:absolute; top:-6px; right:-8px; background:${
                  node.wasteFillPercent >= 80 ? '#ef4444' : node.wasteFillPercent >= 50 ? '#f97316' : '#10b981'
                }; color:white; border-radius:6px; font-size:9px; font-weight:800; padding:1px 4px; border:1px solid white; box-shadow:0 1px 2px rgba(0,0,0,0.2);">
                  ${node.wasteFillPercent}%
                </div>`
              : ''
          }
          <div style="background:rgba(15,23,42,0.85); color:white; font-size:9px; font-weight:600; padding:1px 6px; border-radius:4px; margin-top:2px; white-space:nowrap; text-align:center; max-width:110px; overflow:hidden; text-overflow:ellipsis;">
            ${node.label.split(' ').slice(0, 2).join(' ')}
          </div>
        </div>
      `;

      const marker = L.marker([node.lat, node.lng], {
        icon: L.divIcon({
          className: 'custom-node-icon',
          html: customHtml,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        }),
      });

      const popupContent = `
        <div style="font-family:sans-serif; min-width:180px;">
          <h4 style="margin:0 0 4px; font-size:13px; font-weight:700; color:#0f172a;">${node.label}</h4>
          <div style="font-size:11px; color:#64748b; margin-bottom:6px;">Type: <strong>${node.type}</strong></div>
          ${
            !isDepot && prio
              ? `
              <div style="margin-bottom:6px; padding:6px; background:#f8fafc; border-radius:6px; border:1px solid #e2e8f0;">
                <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                  <span style="font-size:11px; color:#475569;">Priority Score:</span>
                  <strong style="font-size:11px; color:${prio.priorityScore >= 70 ? '#dc2626' : '#059669'};">${prio.priorityScore}/100</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                  <span style="font-size:10px; color:#64748b;">Fill Level:</span>
                  <strong style="font-size:10px; color:#0f172a;">${node.wasteFillPercent}%</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                  <span style="font-size:10px; color:#64748b;">Daily Output:</span>
                  <strong style="font-size:10px; color:#0f172a;">${node.wasteOutputKg} kg/day</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span style="font-size:10px; color:#64748b;">Biohazard:</span>
                  <strong style="font-size:10px; color:${node.hasHazardousWaste ? '#dc2626' : '#16a34a'};">${node.hasHazardousWaste ? 'YES ⚠️' : 'No'}</strong>
                </div>
              </div>
            `
              : `
              <div style="font-size:11px; color:#059669; font-weight:600; padding:4px 0;">
                Central Biohazard Processing & Disposal Depot
              </div>
            `
          }
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(layers);
    });
  }, [nodes, edges, route, animStep, priorities]);

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-[480px] z-0" />
      <div className="p-3 text-[11px] text-slate-500 border-t border-slate-100 flex flex-wrap gap-4 items-center bg-slate-50">
        <span className="flex items-center gap-1 font-medium">🏥 Hospital</span>
        <span className="flex items-center gap-1 font-medium">🏨 Clinic</span>
        <span className="flex items-center gap-1 font-medium text-emerald-700">♻️ Central Plant (Depot)</span>
        <span className="flex items-center gap-1 text-rose-600 font-medium">⚠️ Priority ≥ 70 (Red Ring)</span>
        <span className="text-slate-400">|</span>
        <span className="text-emerald-700 font-semibold flex items-center gap-1">━━ Optimized Route</span>
        <span className="text-slate-400 flex items-center gap-1">━━ Approved Edge</span>
        <span className="text-rose-400 flex items-center gap-1">- - Non-Approved Edge</span>
      </div>
    </div>
  );
};

