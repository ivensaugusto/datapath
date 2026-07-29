import type { CaseStatus } from "@/lib/datapath";

const caseMap: Record<CaseStatus, string> = {
  Pendente: "text-amber border-amber/40 bg-amber/10",
  "Em Análise": "text-cyan border-cyan/40 bg-cyan/10",
  Laudado: "text-emerald border-emerald/40 bg-emerald/10",
  Arquivado: "text-muted-foreground border-border bg-muted/40",
};

export function StatusBadge({ status }: { status: CaseStatus }) {
  return <Pill className={caseMap[status]}>{status}</Pill>;
}

export function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function ApplicationBadge({ status }: { status: "Em Análise" | "Aprovado" | "Rejeitado" }) {
  const map = {
    "Em Análise": "text-cyan border-cyan/40 bg-cyan/10",
    Aprovado: "text-emerald border-emerald/40 bg-emerald/10",
    Rejeitado: "text-destructive border-destructive/40 bg-destructive/10",
  } as const;
  return <Pill className={map[status]}>{status}</Pill>;
}
