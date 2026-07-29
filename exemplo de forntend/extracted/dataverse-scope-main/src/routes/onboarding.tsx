import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, FileUp, Microscope, ShieldCheck, TestTube2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding de Equipamentos — dataPATH" },
      {
        name: "description",
        content:
          "Formulário de captação de parceiros da dataPATH: identificação do pesquisador, reserva de scanner de lâminas e PCR, conformidade CEP/CEUA e termos de storage.",
      },
      { property: "og:title", content: "Onboarding de Equipamentos — dataPATH" },
      { property: "og:description", content: "Cadastro de pesquisadores e reserva de equipamentos de patologia digital." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OnboardingPage,
});

const steps = ["Identificação", "Equipamento", "Conformidade Ética", "Termos & Storage"];
const field = "h-11 w-full rounded-xl border border-border bg-card/60 px-3 text-sm outline-none focus:border-cyan/60";

const equipments = [
  {
    id: "scanner",
    name: "Scanner de Lâminas 3DHISTECH",
    desc: "Digitalização gigapixel 20x/40x, bandeja de 100 lâminas, saída .mrxs",
    icon: Microscope,
  },
  {
    id: "pcr",
    name: "PCR Real-Time 7500 StepOne",
    desc: "Quantificação em tempo real, 96 poços, 4 canais de fluorescência",
    icon: TestTube2,
  },
];

function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [equip, setEquip] = useState<string[]>(["scanner"]);
  const [file, setFile] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [done, setDone] = useState(false);

  const toggle = (id: string) => setEquip((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          title="Onboarding de Equipamentos"
          subtitle="Captação de parceiros de pesquisa · reserva de equipamentos e conformidade ética"
        />

        <ol className="glass-card grid gap-3 rounded-2xl p-5 sm:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border text-sm font-bold ${
                  i < step
                    ? "border-emerald/40 bg-emerald/10 text-emerald"
                    : i === step
                      ? "border-cyan/40 bg-cyan/10 text-cyan"
                      : "border-border text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={`truncate text-sm font-semibold ${i === step ? "" : "text-muted-foreground"}`}>{s}</span>
            </li>
          ))}
        </ol>

        <section className="glass-card rounded-2xl p-6 sm:p-8">
          {done ? (
            <div className="py-12 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-emerald/40 bg-emerald/10 text-emerald">
                <Check className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-xl font-extrabold">Solicitação enviada</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Protocolo ONB-2026-042 · a equipe dataPATH avaliará o parecer ético em até 5 dias úteis.
              </p>
            </div>
          ) : (
            <>
              {step === 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Nome do pesquisador</label>
                    <input className={`mt-1 ${field}`} placeholder="Nome completo" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">CPF / CNPJ</label>
                    <input className={`mt-1 ${field}`} placeholder="000.000.000-00" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Vínculo</label>
                    <select className={`mt-1 ${field}`}>
                      <option>Iniciação Científica</option>
                      <option>Mestrado</option>
                      <option>Doutorado</option>
                      <option>Pós-Doc</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Instituição</label>
                    <input className={`mt-1 ${field}`} placeholder="Universidade / Centro de pesquisa" />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {equipments.map((e) => {
                    const active = equip.includes(e.id);
                    return (
                      <button
                        key={e.id}
                        onClick={() => toggle(e.id)}
                        className={`rounded-2xl border p-6 text-left transition-colors ${
                          active ? "border-cyan/50 bg-cyan/10" : "border-border bg-card/50 hover:border-cyan/30"
                        }`}
                      >
                        <span
                          className={`grid h-11 w-11 place-items-center rounded-xl border ${
                            active ? "border-cyan/40 bg-cyan/15 text-cyan" : "border-border text-muted-foreground"
                          }`}
                        >
                          <e.icon className="h-5 w-5" />
                        </span>
                        <h3 className="mt-4 font-bold">{e.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{e.desc}</p>
                        <span className={`mt-4 inline-block text-xs font-bold ${active ? "text-cyan" : "text-muted-foreground"}`}>
                          {active ? "Selecionado" : "Selecionar"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <label
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      setFile(e.dataTransfer.files?.[0]?.name ?? "parecer-cep.pdf");
                    }}
                    className="grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-border bg-card/40 p-10 text-center transition-colors hover:border-cyan/50"
                  >
                    <FileUp className="h-6 w-6 text-cyan" />
                    <p className="mt-3 text-sm font-semibold">
                      {file ?? "Arraste o Parecer do Comitê de Ética (CEP/CEUA) em PDF"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">ou clique para selecionar · máx. 20 MB</p>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)}
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">Número do parecer</label>
                      <input className={`mt-1 ${field}`} placeholder="CEP 0.000.000" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">Validade</label>
                      <input type="date" className={`mt-1 ${field}`} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">Quantidade de amostras</label>
                      <input type="number" min={1} className={`mt-1 ${field}`} placeholder="120" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">Espécie / tipo de amostra</label>
                      <input className={`mt-1 ${field}`} placeholder="Mus musculus, tecido hepático" />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card/50 p-5 text-sm text-muted-foreground">
                    <h3 className="font-bold text-foreground">SLA e política de retenção</h3>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5">
                      <li>Digitalização em até 72h úteis após recebimento das lâminas.</li>
                      <li>Armazenamento WSI por 24 meses, com replicação geográfica dupla.</li>
                      <li>Dados pessoais anonimizados na ingestão, conforme LGPD (Lei 13.709/2018).</li>
                      <li>Exportação integral do acervo mediante solicitação formal do pesquisador.</li>
                    </ul>
                  </div>
                  <label className="flex items-start gap-3 rounded-2xl border border-border bg-card/50 p-4 text-sm">
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-cyan"
                    />
                    Li e aceito os termos de SLA, a política de retenção de dados e o tratamento de amostras.
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-emerald/30 bg-emerald/10 p-3 text-xs text-emerald">
                    <ShieldCheck className="h-4 w-4 shrink-0" /> Envio registrado na trilha de auditoria LGPD.
                  </div>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="h-11 rounded-xl border border-border px-5 text-sm font-semibold text-muted-foreground disabled:opacity-40"
                >
                  Voltar
                </button>
                {step < 3 ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    className="h-11 rounded-xl bg-gradient-to-r from-cyan to-indigo px-6 text-sm font-bold text-background"
                  >
                    Continuar
                  </button>
                ) : (
                  <button
                    onClick={() => setDone(true)}
                    disabled={!accepted}
                    className="h-11 rounded-xl bg-gradient-to-r from-cyan to-emerald px-6 text-sm font-bold text-background disabled:opacity-40"
                  >
                    Enviar solicitação
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </AppShell>
  );
}
