import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Crosshair,
  Maximize2,
  MousePointer2,
  PenLine,
  Pin,
  Ruler,
  ShieldCheck,
  SplitSquareHorizontal,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { SlideThumb } from "@/components/SlideThumb";
import { cases, fmtDate } from "@/lib/datapath";

export const Route = createFileRoute("/casos/$caseId")({
  loader: ({ params }) => {
    const c = cases.find((x) => x.id === params.caseId);
    if (!c) throw notFound();
    return { c };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Caso indisponível — dataPATH" }, { name: "robots", content: "noindex" }] };
    const { c } = loaderData;
    const title = `Caso #${c.id} · ${c.organ} — dataPATH`;
    const description = `Lâmina gigapixel ${c.stain} do caso #${c.id} (${c.organ}) com anamnese, anotações e emissão de laudo digital.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CaseDetail,
});

const tools = [
  { icon: MousePointer2, label: "Selecionar" },
  { icon: PenLine, label: "Desenhar região" },
  { icon: Ruler, label: "Medir (µm)" },
  { icon: Pin, label: "Fixar nota" },
  { icon: Crosshair, label: "Centralizar" },
];

function CaseDetail() {
  const { c } = Route.useLoaderData();
  const [zoom, setZoom] = useState(20);
  const [tool, setTool] = useState("Selecionar");
  const [compare, setCompare] = useState(false);
  const [drawer, setDrawer] = useState(false);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/casos"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-card/60 text-muted-foreground hover:text-foreground"
              aria-label="Voltar"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate font-mono text-xl font-extrabold sm:text-2xl">#{c.id}</h1>
              <p className="truncate text-sm text-muted-foreground">
                {c.organ} · Coloração {c.stain} · Paciente {c.patientCode}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge status={c.status} />
            <button
              onClick={() => setDrawer(true)}
              className="inline-flex h-11 items-center rounded-xl bg-gradient-to-r from-cyan to-indigo px-4 text-sm font-bold text-background"
            >
              Emitir Laudo
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[30%_1fr]">
          <aside className="space-y-4">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Metadados clínicos</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  ["Paciente (anonimizado)", c.patientCode],
                  ["Órgão / Tecido", c.organ],
                  ["Coloração", c.stain],
                  ["Médico responsável", c.physician],
                  ["Data de entrada", fmtDate(c.entryDate)],
                  ["Aquisição", `${c.magnification} · ${c.sizeGb} GB`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Anamnese</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.anamnese}</p>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Histórico de notas</h2>
              <ul className="mt-4 space-y-3">
                {c.notes.length === 0 && <li className="text-sm text-muted-foreground">Sem anotações registradas.</li>}
                {c.notes.map((n: { date: string; author: string; text: string }, i: number) => (
                  <li key={i} className="rounded-xl border border-border bg-card/50 p-3">
                    <p className="text-xs font-semibold text-cyan">
                      {n.author} · {n.date}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{n.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="glass-card overflow-hidden rounded-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
              <div className="flex flex-wrap items-center gap-1">
                {tools.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setTool(t.label)}
                    title={t.label}
                    aria-label={t.label}
                    className={`grid h-9 w-9 place-items-center rounded-lg border transition-colors ${
                      tool === t.label
                        ? "border-cyan/40 bg-cyan/10 text-cyan"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <t.icon className="h-4 w-4" />
                  </button>
                ))}
                <span className="ml-2 hidden text-xs text-muted-foreground sm:block">{tool}</span>
              </div>
              <div className="flex items-center gap-1">
                {[10, 20, 40].map((z) => (
                  <button
                    key={z}
                    onClick={() => setZoom(z)}
                    className={`h-9 rounded-lg border px-3 text-xs font-bold ${
                      zoom === z ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-border text-muted-foreground"
                    }`}
                  >
                    {z}x
                  </button>
                ))}
                <button
                  onClick={() => setZoom((z) => Math.max(5, z - 5))}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground"
                  aria-label="Reduzir zoom"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setZoom((z) => Math.min(60, z + 5))}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground"
                  aria-label="Aumentar zoom"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCompare((v) => !v)}
                  className={`grid h-9 w-9 place-items-center rounded-lg border ${
                    compare ? "border-indigo/40 bg-indigo/10 text-indigo" : "border-border text-muted-foreground"
                  }`}
                  aria-label="Comparar colorações"
                >
                  <SplitSquareHorizontal className="h-4 w-4" />
                </button>
                <button
                  onClick={() => document.documentElement.requestFullscreen?.()}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground"
                  aria-label="Tela cheia"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative bg-background/60 p-4">
              <div className={`grid gap-3 ${compare ? "md:grid-cols-2" : ""}`}>
                <figure className="relative overflow-hidden rounded-xl border border-border">
                  <div className="aspect-[4/3] overflow-hidden">
                    <SlideThumb
                      stain={c.stain}
                      seed={c.id}
                      cells={90}
                      className="h-full w-full transition-transform duration-500"
                    />
                  </div>
                  <figcaption className="absolute bottom-2 left-2 rounded-lg border border-border bg-background/80 px-2 py-1 font-mono text-[11px] backdrop-blur">
                    {c.stain} · {zoom}x · 250 µm
                  </figcaption>
                  <span className="pointer-events-none absolute inset-6 rounded-lg border-2 border-dashed border-cyan/60" />
                </figure>
                {compare && (
                  <figure className="relative overflow-hidden rounded-xl border border-indigo/40">
                    <div className="aspect-[4/3] overflow-hidden">
                      <SlideThumb stain="HE" seed={c.id + "-he"} cells={90} className="h-full w-full" />
                    </div>
                    <figcaption className="absolute bottom-2 left-2 rounded-lg border border-border bg-background/80 px-2 py-1 font-mono text-[11px] backdrop-blur">
                      HE (referência) · {zoom}x
                    </figcaption>
                  </figure>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded-lg border border-border px-2 py-1 font-mono">Escala: 1 px ≈ 0,25 µm</span>
                <span className="rounded-lg border border-border px-2 py-1 font-mono">Região marcada: 1.240 × 880 µm</span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald/30 bg-emerald/10 px-2 py-1 text-emerald">
                  <ShieldCheck className="h-3.5 w-3.5" /> Acesso auditado (LGPD)
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-background/70 backdrop-blur-sm">
          <div className="glass-card h-full w-full max-w-md overflow-y-auto rounded-none p-6 sm:rounded-l-2xl">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold">Emitir Laudo / Parecer Técnico</h2>
              <button onClick={() => setDrawer(false)} className="text-sm text-muted-foreground hover:text-foreground">
                Fechar
              </button>
            </div>
            <div className="mt-6 space-y-4 text-sm">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Diagnóstico</label>
                <textarea
                  rows={6}
                  defaultValue={`Material de ${c.organ.toLowerCase()} corado em ${c.stain}. Descrição microscópica...`}
                  className="mt-1 w-full rounded-xl border border-border bg-card/60 p-3 text-sm outline-none focus:border-cyan/60"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">CID-10</label>
                  <input
                    defaultValue="C61"
                    className="mt-1 h-11 w-full rounded-xl border border-border bg-card/60 px-3 outline-none focus:border-cyan/60"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Gradação</label>
                  <input
                    defaultValue="Gleason 3+4"
                    className="mt-1 h-11 w-full rounded-xl border border-border bg-card/60 px-3 outline-none focus:border-cyan/60"
                  />
                </div>
              </div>
              <div className="rounded-xl border border-emerald/30 bg-emerald/10 p-4">
                <p className="text-xs font-bold text-emerald">Assinatura digital ICP-Brasil</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.physician} · CRM 148.220 · certificado A3 válido até 12/2027
                </p>
              </div>
              <button className="h-11 w-full rounded-xl bg-gradient-to-r from-cyan to-indigo text-sm font-bold text-background">
                Assinar e publicar laudo
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
