import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Database, FileCheck2, Layers, Microscope, ScanLine, Users2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { KpiCard } from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { SlideThumb } from "@/components/SlideThumb";
import { applications, cases, fmtDate } from "@/lib/datapath";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "dataPATH — Painel Mini-PACS de Telepatologia Digital" },
      {
        name: "description",
        content:
          "Painel Mini-PACS da dataPATH: casos de biópsia, segunda opinião, laudos digitais, onboarding de equipamentos e armazenamento de lâminas gigapixel.",
      },
      { property: "og:title", content: "dataPATH — Painel Mini-PACS de Telepatologia Digital" },
      {
        property: "og:description",
        content: "Painel Mini-PACS da dataPATH: casos de biópsia, segunda opinião, laudos digitais, onboarding de equipamentos e armazenamento de lâminas gigapixel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const storage = cases.reduce((a, c) => a + c.sizeGb, 0);

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          title="Painel do Mini-PACS"
          subtitle="Visão geral operacional do fluxo de patologia digital · atualizado há 2 min"
          action={
            <Link
              to="/casos"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-indigo px-5 text-sm font-bold text-background transition-opacity hover:opacity-90"
            >
              <Microscope className="h-4 w-4" /> Abrir fila de laudos
            </Link>
          }
        />

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <KpiCard label="Total de casos" value={cases.length} icon={Layers} tone="cyan" hint="Biópsias no acervo ativo" />
          <KpiCard
            label="Aguardando 2ª opinião"
            value={cases.filter((c) => c.secondOpinion).length}
            icon={Users2}
            tone="indigo"
            hint="Consultoria entre patologistas"
          />
          <KpiCard
            label="Laudos concluídos"
            value={cases.filter((c) => c.status === "Laudado").length}
            icon={FileCheck2}
            tone="emerald"
            hint="Assinados digitalmente"
          />
          <KpiCard
            label="Solicitações de equipamento"
            value={applications.filter((a) => a.status === "Em Análise").length}
            icon={ScanLine}
            tone="amber"
            hint="Onboarding pendente de análise"
          />
          <KpiCard
            label="Armazenamento WSI"
            value={(storage / 1024).toFixed(2)}
            unit="TB"
            icon={Database}
            tone="rose"
            hint={`${cases.length} lâminas gigapixel`}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="glass-card rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold tracking-wide text-muted-foreground uppercase">Casos recentes</h2>
              <Link to="/casos" className="text-xs font-semibold text-cyan hover:underline">
                Ver todos
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {cases.slice(0, 5).map((c) => (
                <li key={c.id} className="flex items-center gap-4 py-3">
                  <SlideThumb
                    stain={c.stain}
                    seed={c.id}
                    className="h-11 w-11 shrink-0 rounded-lg border border-border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/casos/$caseId"
                      params={{ caseId: c.id }}
                      className="block truncate font-mono text-sm font-semibold hover:text-cyan"
                    >
                      #{c.id}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.organ} · {c.stain} · {fmtDate(c.entryDate)}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-bold tracking-wide text-muted-foreground uppercase">Carga por órgão</h2>
            <ul className="mt-5 space-y-4">
              {Object.entries(
                cases.reduce<Record<string, number>>((acc, c) => {
                  acc[c.organ] = (acc[c.organ] ?? 0) + 1;
                  return acc;
                }, {}),
              )
                .sort((a, b) => b[1] - a[1])
                .map(([organ, count]) => (
                  <li key={organ}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{organ}</span>
                      <span className="tabular-nums text-muted-foreground">{count}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan to-indigo"
                        style={{ width: `${(count / cases.length) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
            </ul>
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald/30 bg-emerald/10 p-3 text-xs text-emerald">
              <Activity className="h-4 w-4 shrink-0" />
              Scanner 3DHISTECH operacional · fila de digitalização vazia
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
