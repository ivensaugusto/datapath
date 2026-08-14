import type { LucideIcon } from 'lucide-react';

export function KpiCard({
  label,
  value,
  unit,
  icon: Icon,
  tone,
  hint,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  tone: 'cyan' | 'indigo' | 'emerald' | 'amber' | 'rose';
  hint?: string;
}) {
  const tones = {
    cyan: 'text-sky-700 border-sky-200 bg-sky-50',
    indigo: 'text-blue-700 border-blue-200 bg-blue-50',
    emerald: 'text-teal-700 border-teal-200 bg-teal-50',
    amber: 'text-amber-700 border-amber-200 bg-amber-50',
    rose: 'text-rose-700 border-rose-200 bg-rose-50',
  }[tone];

  const textTone = {
    cyan: 'text-sky-700',
    indigo: 'text-blue-800',
    emerald: 'text-teal-700',
    amber: 'text-amber-800',
    rose: 'text-rose-700',
  }[tone];

  return (
    <div className="bg-white border border-slate-200 shadow-xs group relative overflow-hidden rounded-2xl p-6 transition-all hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-bold tracking-wide text-slate-500 uppercase">{label}</span>
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${tones}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className={`text-4xl font-black tabular-nums tracking-tight ${textTone}`}>{value}</span>
        {unit && <span className="text-sm font-bold text-slate-500">{unit}</span>}
      </div>
      {hint && <p className="mt-2 text-xs font-medium text-slate-500">{hint}</p>}
    </div>
  );
}

