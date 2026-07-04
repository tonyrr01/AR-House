import { AlertTriangle, CheckCircle2, Clock, ClipboardCheck, Sparkles } from "lucide-react";
import { CleaningCard } from "@/components/cleaning-card";
import { PageHeader } from "@/components/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { cleanings, damageReports, maintenanceTickets } from "@/lib/demo-data";

export default function DashboardPage() {
  const pending = cleanings.filter((cleaning) => cleaning.status === "pendiente");
  const inProgress = cleanings.filter((cleaning) => cleaning.status === "en_progreso");
  const inReview = cleanings.filter((cleaning) => cleaning.status === "en_supervision");

  return (
    <>
      <PageHeader
        title="Turno de limpieza"
        description="Operacion del dia con pendientes, evidencia y supervision visibles al primer vistazo."
        action={<ButtonLink href="/limpiezas/nueva">Programar limpieza</ButtonLink>}
      />

      <div className="mb-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="bg-ink text-white">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-white/60">Prioridad del dia</p>
              <h2 className="mt-3 text-3xl font-bold">Limpiezas listas para operar</h2>
              <p className="mt-2 max-w-xl text-base text-white/70">
                Abre una limpieza, toma evidencia y envia a supervision.
              </p>
            </div>
            <div className="rounded-md bg-white/10 px-4 py-3 text-right">
              <p className="text-4xl font-bold">{pending.length}</p>
              <p className="text-sm font-semibold text-white/70">pendientes</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <ButtonLink href="/limpiezas" variant="secondary" className="border-white/20 bg-white/95">
              Ver limpiezas
            </ButtonLink>
            <ButtonLink href="/limpiezas/nueva" className="bg-sea hover:bg-pine">
              Nueva limpieza
            </ButtonLink>
            <ButtonLink href="/reportes/limpieza" variant="secondary" className="border-white/20 bg-white/95">
              Ver reporte
            </ButtonLink>
          </div>
        </Card>

        <Card>
          <CardTitle title="Estados operativos" />
          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
              <StatusBadge status="pendiente" />
              <span className="text-xl font-bold">{pending.length}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
              <StatusBadge status="en_progreso" />
              <span className="text-xl font-bold">{inProgress.length}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
              <StatusBadge status="en_supervision" />
              <span className="text-xl font-bold">{inReview.length}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
              <StatusBadge status="aprobada" />
              <span className="text-xl font-bold">0</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
              <StatusBadge status="requiere_correccion" />
              <span className="text-xl font-bold">0</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <Clock className="mb-4 h-7 w-7 text-amber-600" />
          <p className="text-3xl font-bold">{pending.length}</p>
          <p className="mt-1 text-sm font-semibold text-slate-500">Pendientes</p>
        </Card>
        <Card>
          <Sparkles className="mb-4 h-7 w-7 text-sky-600" />
          <p className="text-3xl font-bold">{inProgress.length}</p>
          <p className="mt-1 text-sm font-semibold text-slate-500">En proceso</p>
        </Card>
        <Card>
          <AlertTriangle className="mb-4 h-7 w-7 text-clay" />
          <p className="text-3xl font-bold">{damageReports.length}</p>
          <p className="mt-1 text-sm font-semibold text-slate-500">Hallazgos</p>
        </Card>
        <Card>
          <CheckCircle2 className="mb-4 h-7 w-7 text-emerald-600" />
          <p className="text-3xl font-bold">{maintenanceTickets.length}</p>
          <p className="mt-1 text-sm font-semibold text-slate-500">Tickets</p>
        </Card>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <ClipboardCheck className="h-6 w-6 text-sea" />
        <CardTitle title="Limpiezas de hoy" description="Acciones principales para el equipo en campo." />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {cleanings.map((cleaning) => (
          <CleaningCard key={cleaning.id} cleaning={cleaning} />
        ))}
      </div>
    </>
  );
}
