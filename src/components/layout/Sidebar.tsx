import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  ArrowUpDown,
  Link2,
  Layers,
  Network,
  Share2,
  MapPin,
  LineChart,
  Activity,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { to: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
  { to: '/requests', label: 'Waste Requests', icon: ClipboardList },
  { to: '/search-sort', label: 'Search & Sort', icon: ArrowUpDown },
  { to: '/linked-lists', label: 'Linked Lists', icon: Link2 },
  { to: '/stacks-queues', label: 'Stacks & Queues', icon: Layers },
  { to: '/bst', label: 'BST Facility Index', icon: Network },
  { to: '/graphs', label: 'Graph Routing', icon: Share2 },
  { to: '/route-planner', label: 'Route Planner', icon: MapPin },
  { to: '/benchmarks', label: 'Performance Lab', icon: LineChart },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          <Activity className="h-4 w-4 text-emerald-600" />
          <span>Simulator Modules</span>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 shadow-sm border border-emerald-200/80 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-600" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
        <p className="font-semibold text-slate-800">MediTrack DSA Lab v1.0</p>
        <p className="text-[11px] text-slate-500 leading-normal">
          Pure TypeScript DSA · No external AI · Zero-dependency algorithms
        </p>
      </div>
    </aside>
  );
};
