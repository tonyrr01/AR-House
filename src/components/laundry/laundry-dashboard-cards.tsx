import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Boxes,
  CircleDollarSign,
  Gauge,
  PackageCheck,
  Shirt,
  Sparkles,
  WashingMachine
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { LaundryBatch, LaundryCapacity, LaundryCost, LinenKit, WarehouseStockItem } from "@/types";

const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0
});

export function LaundryDashboardCards({
  batches,
  kits,
  stock,
  cost,
  capacity
}: {
  batches: LaundryBatch[];
  kits: LinenKit[];
  stock: WarehouseStockItem[];
  cost: LaundryCost;
  capacity: LaundryCapacity;
}) {
  const cards: Array<{ label: string; value: string | number; icon: LucideIcon; tone: string }> = [
    { label: "Kg procesados hoy", value: cost.kgProcesados, icon: WashingMachine, tone: "bg-pine text-white" },
    { label: "Lotes recibidos hoy", value: batches.filter((batch) => batch.fechaRecepcion === cost.fecha).length, icon: PackageCheck, tone: "bg-sea text-white" },
    { label: "Blancos en lavado", value: batches.filter((batch) => batch.estado === "En lavado").length, icon: WashingMachine, tone: "bg-blue-100 text-blue-800" },
    { label: "Blancos en secado", value: batches.filter((batch) => batch.estado === "En secado").length, icon: Sparkles, tone: "bg-cyan-100 text-cyan-800" },
    { label: "Pendientes inspeccion", value: batches.filter((batch) => batch.estado === "En inspeccion").length, icon: AlertTriangle, tone: "bg-violet-100 text-violet-800" },
    { label: "Limpios en bodega", value: stock.reduce((sum, item) => sum + item.stockDisponible, 0), icon: Boxes, tone: "bg-emerald-100 text-emerald-800" },
    { label: "Kits pendientes", value: kits.filter((kit) => kit.estado === "pendiente" || kit.estado === "incompleto").length, icon: Shirt, tone: "bg-amber-100 text-amber-800" },
    { label: "Kits listos", value: kits.filter((kit) => kit.estado === "armado").length, icon: PackageCheck, tone: "bg-mist text-pine" },
    { label: "Blancos observados", value: batches.filter((batch) => batch.estado === "Observado").length, icon: AlertTriangle, tone: "bg-amber-100 text-amber-800" },
    { label: "Blancos dados de baja", value: batches.filter((batch) => batch.estado === "Baja").length, icon: AlertTriangle, tone: "bg-slate-200 text-slate-800" },
    { label: "Costo por kg", value: money.format(cost.costoPorKg), icon: CircleDollarSign, tone: "bg-clay text-white" },
    { label: "Costo por habitacion", value: money.format(cost.costoPorHabitacion), icon: CircleDollarSign, tone: "bg-clay text-white" },
    { label: "Capacidad usada", value: `${capacity.porcentajeUso}%`, icon: Gauge, tone: capacity.porcentajeUso >= 85 ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800" },
    { label: "Alerta saturacion", value: capacity.alertaSaturacion, icon: AlertTriangle, tone: capacity.alertaSaturacion === "normal" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800" }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="p-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${card.tone}`}>
              <card.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">{card.label}</p>
              <p className="mt-1 text-2xl font-bold capitalize text-ink">{card.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
