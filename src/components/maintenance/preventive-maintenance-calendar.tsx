import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PreventiveMaintenancePlan, PreventiveMaintenanceVisit } from "@/types";

export function PreventiveMaintenanceCalendar({
  plans,
  visits
}: {
  plans: PreventiveMaintenancePlan[];
  visits: PreventiveMaintenanceVisit[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {plans.map((plan) => (
        <article key={plan.id} className="rounded-md border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-sea">{plan.frequency}</p>
              <h3 className="mt-1 text-lg font-bold text-ink">{plan.propertyName}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">Supervisor: {plan.assignedSupervisor}</p>
            </div>
            <span className={`rounded-md px-3 py-1.5 text-sm font-bold ${plan.status === "vencido" ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"}`}>{plan.status}</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Metric label="Ultimo" value={plan.lastDate ?? "Sin historial"} />
            <Metric label="Proximo" value={plan.nextDate} />
          </div>
          <Button type="button" variant="secondary" className="mt-4 w-full">
            <CalendarPlus className="h-5 w-5" />
            Generar visita preventiva
          </Button>
        </article>
      ))}
      <article className="rounded-md border border-slate-200 bg-mist p-4 lg:col-span-2">
        <h3 className="text-lg font-bold text-ink">Historial preventivo</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {visits.map((visit) => (
            <div key={visit.id} className="rounded-md bg-white p-4">
              <p className="text-sm font-bold text-sea">{visit.propertyName}</p>
              <p className="mt-1 font-bold text-ink">{visit.generalCondition}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">{visit.ticketsCreated} ticket(s) · {visit.photos} fotos</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-base font-bold text-ink">{value}</p>
    </div>
  );
}
