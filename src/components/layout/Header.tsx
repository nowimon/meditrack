import React from 'react';
import { Activity, ShieldAlert, Sparkles } from 'lucide-react';

interface HeaderProps {
  onResetData?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onResetData }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm shadow-emerald-200">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-900 m-0 leading-tight">
            MediTrack DSA Lab
          </h1>
          <p className="text-xs text-slate-500 m-0 leading-tight">
            Smart Medical-Waste Collection & Segregation Simulator
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Simulator Engine Active
        </div>

        <div className="hidden md:flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 border border-amber-200">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
          <span>Biomedical Rules 2016 Compliant</span>
        </div>

        {onResetData && (
          <button
            onClick={onResetData}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
            title="Reset synthetic data to default state"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            Reset Data
          </button>
        )}
      </div>
    </header>
  );
};
