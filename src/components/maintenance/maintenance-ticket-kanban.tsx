import { ArrowRight } from "lucide-react";
import { MaintenancePriorityBadge, MaintenanceStatusBadge } from "@/components/maintenance/maintenance-badges";
import { Button } from "@/components/ui/button";
import type { MaintenanceAssetTicket, MaintenanceTicketStatus } from "@/types";

const columns: MaintenanceTicketStatus[] = ["Abierto", "En revision", "Diagnostico", "Cotizacion", "Asignado", "En proceso", "En espera de material", "Supervision", "Cerrado"];

export function MaintenanceTicketKanban({ tickets }: { tickets: MaintenanceAssetTicket[] }) {
  return (
    <div className="grid gap-4 overflow-x-auto xl:grid-cols-3 2xl:grid-cols-5">
      {columns.map((column) => {
        const columnTickets = tickets.filter((ticket) => ticket.status === column);
        return (
          <section key={column} className="min-w-72 rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <MaintenanceStatusBadge status={column} />
              <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-500">{columnTickets.length}</span>
            </div>
            <div className="grid gap-3">
              {columnTickets.length === 0 ? (
                <p className="rounded-md bg-white p-4 text-sm font-semibold text-slate-400">Sin tickets</p>
              ) : (
                columnTickets.map((ticket) => (
                  <article key={ticket.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm font-bold text-sea">{ticket.propertyName}</p>
                    <h3 className="mt-1 text-base font-bold text-ink">{ticket.title}</h3>
                    <p className="mt-2 text-sm font-semibold text-slate-500">{ticket.category} · {ticket.assignedSpecialty}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <MaintenancePriorityBadge priority={ticket.priority} />
                      {ticket.suggestedChargeToGuest ? <span className="rounded-md bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-800">Cargo huesped</span> : null}
                    </div>
                    <Button type="button" variant="secondary" className="mt-3 w-full text-sm">
                      Convertir en orden
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </article>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
