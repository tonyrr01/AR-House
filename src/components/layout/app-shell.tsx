import {
  AlertTriangle,
  BarChart3,
  Building2,
  ClipboardCheck,
  Home,
  PackageCheck,
  PlusCircle,
  Shirt,
  Sparkles,
  WashingMachine,
  Wrench
} from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/departamentos", label: "Departamentos", icon: Building2 },
  { href: "/limpiezas", label: "Limpiezas", icon: Sparkles },
  { href: "/limpiezas/nueva", label: "Nueva limpieza", icon: PlusCircle },
  { href: "/checklist", label: "Checklist", icon: ClipboardCheck },
  { href: "/inventario", label: "Inventario", icon: PackageCheck },
  { href: "/blancos", label: "Blancos", icon: Shirt },
  { href: "/lavanderia", label: "Lavanderia y Bodega", icon: WashingMachine },
  { href: "/danos-faltantes", label: "Danos y faltantes", icon: AlertTriangle },
  { href: "/tickets", label: "Tickets", icon: Wrench },
  { href: "/reportes/limpieza", label: "Reporte", icon: BarChart3 }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f8f7]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white px-4 py-6 lg:block">
        <Link href="/" className="mb-8 block rounded-md px-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sea">Operacion premium</p>
          <h1 className="mt-2 text-2xl font-bold leading-tight text-ink">Housekeeping 5 Estrellas</h1>
        </Link>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="tap-target flex items-center gap-3 rounded-md px-3 py-3 text-base font-semibold text-slate-700 transition hover:bg-mist hover:text-pine"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-3 py-3 backdrop-blur sm:px-4 lg:px-8 lg:py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-sea sm:text-xs">MVP operativo</p>
              <p className="text-base font-bold text-ink sm:text-lg">Turno de limpieza</p>
            </div>
            <div className="flex min-h-10 items-center gap-2 rounded-md border border-slate-200 bg-mist px-3 py-2 text-sm font-bold text-pine sm:min-h-11 sm:px-4">
              Rol demo: supervisor
            </div>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-12 shrink-0 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 shadow-sm sm:px-4"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
