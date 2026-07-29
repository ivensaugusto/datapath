import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { auditLogs } from "@/lib/datapath";

export const Route = createFileRoute("/auditoria")({
  head: () => ({
    meta: [
      { title: "Auditoria LGPD — dataPATH" },
      {
        name: "description",
        content:
          "Trilha de auditoria da dataPATH com data/hora, usuário, ação, endereço IP e status de conformidade LGPD de cada acesso a lâminas e laudos.",
      },
      { property: "og:title", content: "Auditoria LGPD — dataPATH" },
      { property: "og:description", content: "Governança e trilha de auditoria de acessos em telepatologia digital." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  const [q, setQ] = useState("");
  const list = auditLogs.filter((l) =>
    [l.user, l.action, l.ip, l.resource].join(" ").toLowerCase().includes(q.trim().toLowerCase()),
  );

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          title="Governança & Auditoria LGPD"
          subtitle="Registro imutável de acessos, uploads e emissões de laudo · retenção de 5 anos"
          action={
            <span className="inline-flex items-center gap-2 rounded-xl border border-emerald/40 bg-emerald/10 px-4 py-2.5 text-sm font-bold text-emerald">
              <ShieldCheck className="h-4 w-4" /> 100% dos eventos auditados
            </span>
          }
        />

        <section className="glass-card rounded-2xl p-4 sm:p-6">
          <div className="relative sm:max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por usuário, ação, IP ou recurso..."
              className="h-11 w-full rounded-xl border border-border bg-card/60 pr-3 pl-9 text-sm outline-none focus:border-cyan/60"
            />
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-left text-xs tracking-wide text-muted-foreground uppercase">
                  <th className="px-4 pb-2 font-medium">Data / Hora</th>
                  <th className="px-4 pb-2 font-medium">Usuário</th>
                  <th className="px-4 pb-2 font-medium">Ação</th>
                  <th className="px-4 pb-2 font-medium">Recurso</th>
                  <th className="px-4 pb-2 font-medium">IP</th>
                  <th className="px-4 pb-2 font-medium">Conformidade</th>
                </tr>
              </thead>
              <tbody>
                {list.map((l) => (
                  <tr key={l.id} className="bg-card/40">
                    <td className="rounded-l-xl border-y border-l border-border px-4 py-3 font-mono text-xs whitespace-nowrap">
                      {l.datetime}
                    </td>
                    <td className="border-y border-border px-4 py-3">
                      <div className="truncate font-medium">{l.user}</div>
                      <div className="text-xs text-muted-foreground">{l.profile}</div>
                    </td>
                    <td className="border-y border-border px-4 py-3 whitespace-nowrap">{l.action}</td>
                    <td className="border-y border-border px-4 py-3 font-mono text-xs text-muted-foreground">
                      {l.resource}
                    </td>
                    <td className="border-y border-border px-4 py-3 font-mono text-xs whitespace-nowrap">{l.ip}</td>
                    <td className="rounded-r-xl border-y border-r border-border px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald/40 bg-emerald/10 px-2.5 py-1 text-xs font-semibold text-emerald">
                        <ShieldCheck className="h-3.5 w-3.5" /> Auditado
                      </span>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
