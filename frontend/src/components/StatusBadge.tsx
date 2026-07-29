import React from 'react';

export type CaseStatus = 'Pendente' | 'Em Análise' | 'Laudado' | 'Arquivado' | 'ReadyForArchive' | string;

export function Pill({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: CaseStatus }) {
  const norm = status?.toString() || 'Pendente';
  let badgeClass = 'text-amber-400 border-amber-500/40 bg-amber-500/10';

  if (norm === 'Em Análise') {
    badgeClass = 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
  } else if (norm === 'Laudado' || norm === 'Concluído') {
    badgeClass = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
  } else if (norm === 'Arquivado' || norm === 'ReadyForArchive') {
    badgeClass = 'text-slate-400 border-slate-700 bg-slate-800/40';
  }

  return <Pill className={badgeClass}>{norm}</Pill>;
}

export function ApplicationBadge({ status }: { status: 'Em Análise' | 'Aprovado' | 'Rejeitado' | string }) {
  let badgeClass = 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
  if (status === 'Aprovado') badgeClass = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
  if (status === 'Rejeitado') badgeClass = 'text-rose-400 border-rose-500/40 bg-rose-500/10';

  return <Pill className={badgeClass}>{status}</Pill>;
}
