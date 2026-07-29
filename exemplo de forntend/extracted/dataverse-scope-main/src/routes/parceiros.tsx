import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, FileText, X } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { ApplicationBadge } from "@/components/StatusBadge";
import { applications, fmtDate, type PartnerApplication } from "@/lib/datapath";

export const Route = createFileRoute("/parceiros")({
  head: () => ({
    meta: [
      { title: "Gestão de Parceiros — dataPATH" },
      {
        name: "description",
        content:
          "Painel administrativo de solicitações de parceria: análise de pareceres CEP/CEUA, aprovação, rejeição com justificativa e gestão de cotas.",
      },
      { property: "og:title", content: "Gestão de Parceiros — dataPATH" },
      { property: "og:description", content: "Aprovação de parceiros de pesquisa e controle de cotas de equipamentos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  const [preview, setPreview] = useState<PartnerApplication | null>(null);
  const [feedback, setFeedback] = useState("");

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          title="Gestão de Parceiros"
          subtitle="Análise das solicitações de onboarding e controle de cotas de uso dos equipamentos"
        />

        <section className="glass-card overflow-x-auto rounded-2xl p-4 sm:p-6">
          <table className="w-full border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="text-left text-xs tracking-wide text-muted-foreground uppercase">
                <th className="px-4 pb-2 font-medium">Protocolo</th>
                <th className="px-4 pb-2 font-medium">Pesquisador</th>
                <th className="px-4 pb-2 font-medium">Equipamento</th>
                <th className="px-4 pb-2 font-medium">Parecer</th>
                <th className="px-4 pb-2 font-medium">Cota</th>
                <th className="px-4 pb-2 font-medium">Status</th>
                <th className="px-4 pb-2 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a.id} className="bg-card/40">
                  <td className="rounded-l-xl border-y border-l border-border px-4 py-3 font-mono font-semibold whitespace-nowrap">
                    {a.id}
                  </td>
                  <td className="border-y border-border px-4 py-3">
                    <div className="font-medium">{a.researcher}</div>
                    <div className="max-w-[240px] truncate text-xs text-muted-foreground">
                      {a.bond} · {a.institution}
                    </div>
                  </td>
                  <td className="border-y border-border px-4 py-3 text-xs">{a.equipment}</td>
                  <td className="border-y border-border px-4 py-3 text-xs whitespace-nowrap">
                    <button
                      onClick={() => setPreview(a)}
                      className="inline-flex items-center gap-1.5 font-semibold text-cyan hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" /> {a.cepNumber}
                    </button>
                    <div className="text-muted-foreground">Validade {fmtDate(a.cepValidity)}</div>
                  </td>
                  <td className="border-y border-border px-4 py-3">
                    <div className="text-xs tabular-nums text-muted-foreground">
                      {a.quotaUsed}/{a.quotaTotal} amostras
                    </div>
                    <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan to-indigo"
                        style={{ width: `${(a.quotaUsed / a.quotaTotal) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="border-y border-border px-4 py-3">
                    <ApplicationBadge status={a.status} />
                  </td>
                  <td className="rounded-r-xl border-y border-r border-border px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="grid h-8 w-8 place-items-center rounded-lg border border-emerald/40 bg-emerald/10 text-emerald"
                        aria-label="Aprovar"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        className="grid h-8 w-8 place-items-center rounded-lg border border-destructive/40 bg-destructive/10 text-destructive"
                        aria-label="Rejeitar"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm">
          <div className="glass-card max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold">Parecer {preview.cepNumber}</h2>
                <p className="text-sm text-muted-foreground">
                  {preview.researcher} · {preview.institution}
                </p>
              </div>
              <button onClick={() => setPreview(null)} className="text-sm text-muted-foreground hover:text-foreground">
                Fechar
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_260px]">
              <div className="rounded-xl border border-border bg-card/60 p-6">
                <div className="mx-auto aspect-[3/4] w-full max-w-sm rounded-lg border border-border bg-surface p-6 text-[10px] leading-relaxed text-muted-foreground">
                  <p className="text-center text-xs font-bold text-foreground">COMITÊ DE ÉTICA EM PESQUISA</p>
                  <p className="mt-4">Protocolo: {preview.cepNumber}</p>
                  <p>Pesquisador: {preview.researcher}</p>
                  <p>Instituição: {preview.institution}</p>
                  <p>Espécie/Amostra: {preview.species}</p>
                  <p>Amostras autorizadas: {preview.samples}</p>
                  <p className="mt-4">
                    Parecer favorável à execução do projeto, condicionado à observância das normas de biossegurança e à
                    anonimização integral dos dados pessoais nos termos da LGPD.
                  </p>
                  <p className="mt-6">Validade: {fmtDate(preview.cepValidity)}</p>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-semibold text-muted-foreground">Justificativa / feedback</label>
                <textarea
                  rows={6}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Descreva o racional da decisão..."
                  className="w-full rounded-xl border border-border bg-card/60 p-3 text-sm outline-none focus:border-cyan/60"
                />
                <button className="h-11 w-full rounded-xl border border-emerald/40 bg-emerald/10 text-sm font-bold text-emerald">
                  Aprovar solicitação
                </button>
                <button className="h-11 w-full rounded-xl border border-destructive/40 bg-destructive/10 text-sm font-bold text-destructive">
                  Rejeitar solicitação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
