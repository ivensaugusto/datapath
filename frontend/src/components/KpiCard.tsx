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
    cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    indigo: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    amber: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    rose: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  }[tone];

  const textTone = {
    cyan: 'text-cyan-400',
    indigo: 'text-indigo-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
  }[tone];

  return (
    <div className="glass-card group relative overflow-hidden rounded-2xl p-6 transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{label}</span>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${tones}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className={`text-4xl font-extrabold tabular-nums ${textTone}`}>{value}</span>
        {unit && <span className="text-sm font-semibold text-slate-400">{unit}</span>}
      </div>
      {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
