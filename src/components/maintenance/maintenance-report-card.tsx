import type { MaintenanceAssetTicket, MaintenanceCost, PreventiveMaintenanceVisit } from "@/types";

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

export function MaintenanceReportCard({
  propertyName,
  tickets,
  costs,
  visits
}: {
  propertyName: string;
  tickets: MaintenanceAssetTicket[];
  costs: MaintenanceCost[];
  visits: PreventiveMaintenanceVisit[];
}) {
  const propertyTickets = tickets.filter((ticket) => ticket.propertyName === propertyName);
  const propertyCosts = costs.filter((cost) => cost.propertyName === propertyName);
  const propertyVisits = visits.filter((visit) => visit.propertyName === propertyName);
  const open = propertyTickets.filter((ticket) => !["Cerrado", "Cancelado"].includes(ticket.status)).length;
  const closed = propertyTickets.filter((ticket) => ticket.status === "Cerrado").length;
  const total = propertyCosts.reduce((sum, cost) => sum + cost.totalCost, 0);

  return (
    <article className="rounded-md border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-bold text-ink">{propertyName}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Metric label="Tickets abiertos" value={open} />
        <Metric label="Tickets cerrados" value={closed} />
        <Metric label="Preventivos" value={propertyVisits.length} />
        <Metric label="Costo periodo" value={money.format(total)} />
      </div>
      <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-600">
        Recomendacion: atender pendientes antes del siguiente check-in y documentar fotos antes/despues.
      </p>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-ink">{value}</p>
    </div>
  );
}
