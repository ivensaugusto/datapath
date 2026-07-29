import type { LucideIcon } from "lucide-react";

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
  tone: "cyan" | "indigo" | "emerald" | "amber" | "rose";
  hint?: string;
}) {
  const tones = {
    cyan: "text-cyan border-cyan/30 bg-cyan/10",
    indigo: "text-indigo border-indigo/30 bg-indigo/10",
    emerald: "text-emerald border-emerald/30 bg-emerald/10",
    amber: "text-amber border-amber/30 bg-amber/10",
    rose: "text-rose border-rose/30 bg-rose/10",
  }[tone];

  return (
    <div className="glass-card group relative overflow-hidden rounded-2xl p-6 transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${tones}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className={`text-4xl font-extrabold tabular-nums ${tones.split(" ")[0]}`}>{value}</span>
        {unit && <span className="text-sm font-semibold text-muted-foreground">{unit}</span>}
      </div>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
