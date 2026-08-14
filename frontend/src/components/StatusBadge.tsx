import React from 'react';

export type CaseStatus = 'Pendente' | 'Em Análise' | 'Laudado' | 'Arquivado' | 'ReadyForArchive' | string;

export function Pill({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: CaseStatus }) {
  const norm = status?.toString() || 'Pendente';
  let badgeClass = 'text-amber-800 border-amber-200 bg-amber-50';

  if (norm === 'Em Análise' || norm === 'InReview') {
    badgeClass = 'text-sky-800 border-sky-200 bg-sky-50';
  } else if (norm === 'Laudado' || norm === 'Concluído') {
    badgeClass = 'text-teal-800 border-teal-200 bg-teal-50';
  } else if (norm === 'Arquivado' || norm === 'ReadyForArchive') {
    badgeClass = 'text-slate-600 border-slate-200 bg-slate-100';
  }

  return <Pill className={badgeClass}>{norm}</Pill>;
}

export function ApplicationBadge({ status }: { status: 'Em Análise' | 'Aprovado' | 'Rejeitado' | string }) {
  let badgeClass = 'text-sky-800 border-sky-200 bg-sky-50';
  if (status === 'Aprovado') badgeClass = 'text-teal-800 border-teal-200 bg-teal-50';
  if (status === 'Rejeitado') badgeClass = 'text-rose-800 border-rose-200 bg-rose-50';

  return <Pill className={badgeClass}>{status}</Pill>;
}

