import React from 'react';

interface PageShellProps {
  title: string;
  subtitle: string;
  unitBadge?: string;
  complexity?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({
  title,
  subtitle,
  unitBadge,
  complexity,
  children,
  actions,
}) => {
  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {unitBadge && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                {unitBadge}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 m-0 leading-tight">
            {title}
          </h2>
          <p className="text-sm text-slate-500 m-0 mt-1">
            {subtitle}
          </p>
          {complexity && (
            <details className="mt-2.5 group">
              <summary className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 cursor-pointer transition select-none">
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-mono font-medium text-indigo-700 border border-indigo-200 hover:bg-indigo-100/70">
                  How it works · Complexity ▾
                </span>
              </summary>
              <div className="mt-1.5 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs font-mono text-slate-700">
                {complexity}
              </div>
            </details>
          )}
        </div>

        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>

      <div>{children}</div>
    </div>
  );
};
