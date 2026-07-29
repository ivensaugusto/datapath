import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, FileSignature, Plus, Search } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { SlideThumb } from "@/components/SlideThumb";
import { caseStatuses, cases, fmtDate, organs, stains } from "@/lib/datapath";

export const Route = createFileRoute("/casos/")({
  head: () => ({
    meta: [
      { title: "Casos Clínicos — dataPATH Mini-PACS" },
      {
        name: "description",
        content: "Fila de biópsias digitais com filtros por órgão, coloração e status, com acesso direto às lâminas WSI.",
      },
      { property: "og:title", content: "Casos Clínicos — dataPATH" },
      { property: "og:description", content: "Fila de biópsias digitais e laudos da plataforma dataPATH." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CasesPage,
});

const selectCls =
  "h-11 rounded-xl border border-border bg-card/60 px-3 text-sm outline-none focus:border-cyan/60";

function CasesPage() {
  const [q, setQ] = useState("");
  const [organ, setOrgan] = useState("Todos");
  const [stain, setStain] = useState("Todas");
  const [status, setStatus] = useState("Todos");

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return cases.filter(
      (c) =>
        (organ === "Todos" || c.organ === organ) &&
        (stain === "Todas" || c.stain === stain) &&
        (status === "Todos" || c.status === status) &&
        (!t || c.id.toLowerCase().includes(t) || c.patientCode.toLowerCase().includes(t) || c.physician.toLowerCase().includes(t)),
    );
  }, [q, organ, stain, status]);

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          title="Casos Clínicos"
          subtitle="Acervo de biópsias digitalizadas · lâminas gigapixel prontas para leitura remota"
          action={
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-indigo px-5 text-sm font-bold text-background transition-opacity hover:opacity-90">
              <Plus className="h-4 w-4" /> Nova Biópsia
            </button>
          }
        />

        <section className="glass-card rounded-2xl p-4 sm:p-6">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="relative min-w-0">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por ID do caso, código do paciente ou patologista..."
                className="h-11 w-full rounded-xl border border-border bg-card/60 pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus:border-cyan/60"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select value={organ} onChange={(e) => setOrgan(e.target.value)} className={selectCls}>
                <option>Todos</option>
                {organs.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <select value={stain} onChange={(e) => setStain(e.target.value)} className={selectCls}>
                <option>Todas</option>
                {stains.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
                <option>Todos</option>
                {caseStatuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.map((c) => (
              <article key={c.id} className="rounded-2xl border border-border bg-card/50 p-4 transition-colors hover:border-cyan/40">
                <div className="flex items-start gap-4">
                  <SlideThumb stain={c.stain} seed={c.id} className="h-20 w-20 shrink-0 rounded-xl border border-border" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-sm font-bold">#{c.id}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="mt-1 truncate text-sm font-semibold">{c.organ}</p>
                    <p className="text-xs text-muted-foreground">
                      Coloração {c.stain} · {c.magnification} · {c.sizeGb} GB
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Entrada: {fmtDate(c.entryDate)}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to="/casos/$caseId"
                    params={{ caseId: c.id }}
                    className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-cyan/40 bg-cyan/10 px-3 text-xs font-bold text-cyan"
                  >
                    Abrir Lâmina
                  </Link>
                  <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-muted-foreground hover:text-foreground">
                    <FileSignature className="h-3.5 w-3.5" /> Emitir Parecer
                  </button>
                  <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-muted-foreground hover:text-foreground">
                    <Download className="h-3.5 w-3.5" /> PDF
                  </button>
                </div>
              </article>
            ))}
            {list.length === 0 && (
              <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
                Nenhum caso encontrado com esses filtros.
              </p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
