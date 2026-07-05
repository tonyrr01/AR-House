import { Card, CardTitle } from "@/components/ui/card";
import type { MaintenanceCost } from "@/types";

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

export function MaintenanceCostSummary({ costs }: { costs: MaintenanceCost[] }) {
  const totals = {
    labor: costs.reduce((sum, cost) => sum + cost.laborCost, 0),
    materials: costs.reduce((sum, cost) => sum + cost.materialCost, 0),
    spareParts: costs.reduce((sum, cost) => sum + cost.sparePartsCost, 0),
    external: costs.reduce((sum, cost) => sum + cost.externalServiceCost, 0),
    total: costs.reduce((sum, cost) => sum + cost.totalCost, 0),
    guest: costs.filter((cost) => cost.chargeTo === "huesped").reduce((sum, cost) => sum + cost.totalCost, 0),
    owner: costs.filter((cost) => cost.chargeTo === "propietario").reduce((sum, cost) => sum + cost.totalCost, 0),
    operation: costs.filter((cost) => cost.chargeTo === "operacion").reduce((sum, cost) => sum + cost.totalCost, 0),
    warranty: costs.filter((cost) => cost.chargeTo === "garantia").reduce((sum, cost) => sum + cost.totalCost, 0)
  };

  return (
    <Card>
      <CardTitle title="Costos de mantenimiento" description="Resumen separado de limpieza, blancos y lavanderia." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Mano de obra" value={money.format(totals.labor)} />
        <Metric label="Materiales" value={money.format(totals.materials)} />
        <Metric label="Refacciones" value={money.format(totals.spareParts)} />
        <Metric label="Servicios externos" value={money.format(totals.external)} />
        <Metric label="Total mensual" value={money.format(totals.total)} />
        <Metric label="Cargo huesped" value={money.format(totals.guest)} />
        <Metric label="Cargo propietario" value={money.format(totals.owner)} />
        <Metric label="Operacion" value={money.format(totals.operation)} />
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-ink">{value}</p>
    </div>
  );
}
