import { MaintenanceStatusBadge } from "@/components/maintenance/maintenance-badges";
import { Button } from "@/components/ui/button";
import type { WorkOrder } from "@/types";

export function WorkOrderTable({ orders }: { orders: WorkOrder[] }) {
  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <article key={order.id} className="rounded-md border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-sea">{order.propertyName} · {order.id}</p>
              <h3 className="mt-1 text-lg font-bold text-ink">{order.title}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">{order.description}</p>
            </div>
            <MaintenanceStatusBadge status={order.status} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <Metric label="Tecnico" value={order.assignedTechnicianName ?? "Sin asignar"} />
            <Metric label="Fecha" value={order.scheduledDate} />
            <Metric label="Materiales" value={order.materialsUsed.join(", ") || "Pendiente"} />
            <Metric label="Total" value={`$${order.totalCost}`} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Button type="button" variant="secondary">Registrar diagnostico</Button>
            <Button type="button" variant="secondary">Enviar a supervision</Button>
            <Button type="button">Cerrar con aprobacion</Button>
          </div>
        </article>
      ))}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-ink">{value}</p>
    </div>
  );
}
