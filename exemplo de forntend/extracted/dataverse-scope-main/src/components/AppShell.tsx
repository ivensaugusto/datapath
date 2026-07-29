import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, ChevronDown, Menu, Microscope, Moon, Sun, X } from "lucide-react";

const nav = [
  { label: "Dashboard", to: "/" },
  { label: "Casos Clínicos", to: "/casos" },
  { label: "Onboarding", to: "/onboarding" },
  { label: "Gestão de Parceiros", to: "/parceiros" },
  { label: "Auditoria LGPD", to: "/auditoria" },
] as const;

function useTheme() {
  const [dark, setDark] = useState(true);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };
  return { dark, toggle };
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(900px 500px at 12% -8%, color-mix(in oklab, var(--cyan) 18%, transparent), transparent 70%), radial-gradient(800px 480px at 92% 0%, color-mix(in oklab, var(--indigo) 16%, transparent), transparent 70%)",
        }}
      />
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[1500px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-8">
          <div className="flex min-w-0 items-center gap-6">
            <Link to="/" className="flex min-w-0 shrink-0 items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan/40 bg-cyan/10 text-cyan glow-cyan">
                <Microscope className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-lg leading-none font-extrabold tracking-tight">
                  data<span className="text-gradient">PATH</span>
                </span>
                <span className="mt-1 inline-flex rounded-full border border-indigo/40 bg-indigo/10 px-2 py-0.5 text-[10px] font-semibold text-indigo">
                  Mini-PACS v2.0
                </span>
              </span>
            </Link>
            <nav className="hidden items-center gap-1 xl:flex">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground data-[status=active]:bg-cyan/10 data-[status=active]:text-cyan"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-border bg-card/60 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Notificações"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald" />
            </button>
            <button
              onClick={toggle}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card/60 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Alternar tema"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="hidden items-center gap-2 rounded-xl border border-border bg-card/60 py-1.5 pr-3 pl-1.5 text-left transition-colors hover:border-cyan/40 sm:flex">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-cyan to-indigo text-xs font-bold text-background">
                HV
              </span>
              <span className="leading-tight">
                <span className="block text-xs font-semibold">Dra. Helena V.</span>
                <span className="block text-[10px] text-muted-foreground">Admin · Patologista</span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card/60 text-muted-foreground xl:hidden"
              aria-label="Abrir menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="grid gap-1 border-t border-border/70 px-4 py-3 xl:hidden">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground data-[status=active]:bg-cyan/10 data-[status=active]:text-cyan"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="relative mx-auto max-w-[1500px] px-4 py-8 sm:px-8">{children}</main>

      <footer className="relative mx-auto max-w-[1500px] px-4 pb-10 text-xs text-muted-foreground sm:px-8">
        dataPATH · Telepatologia Digital · Dados anonimizados conforme LGPD (Lei 13.709/2018)
      </footer>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 sm:flex sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
