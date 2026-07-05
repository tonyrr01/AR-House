import { CircleDollarSign } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import type { LaundryCost } from "@/types";

const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0
});

export function LaundryCostSummary({ cost }: { cost: LaundryCost }) {
  const rows = [
    ["Mano de obra", cost.costoManoObra],
    ["Agua", cost.costoAgua],
    ["Gas", cost.costoGas],
    ["Electricidad", cost.costoElectricidad],
    ["Quimicos", cost.costoQuimicos],
    ["Mantenimiento", cost.costoMantenimiento],
    ["Merma blancos", cost.costoMermaBlancos],
    ["Otros", cost.otrosCostos]
  ];

  return (
    <Card>
      <CardTitle title="Costos operativos" description="Calculo basico diario, sin modulo financiero complejo." />
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="grid gap-2">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-md bg-slate-50 p-3 text-sm">
              <span className="font-semibold text-slate-600">{label}</span>
              <span className="font-bold text-ink">{money.format(Number(value))}</span>
            </div>
          ))}
        </div>
        <div className="rounded-md bg-pine p-5 text-white">
          <CircleDollarSign className="h-8 w-8" />
          <p className="mt-4 text-sm font-semibold opacity-80">Costo total del dia</p>
          <p className="mt-1 text-3xl font-bold">{money.format(cost.costoTotal)}</p>
          <div className="mt-5 grid gap-3 text-sm font-semibold">
            <p>Kg procesados: {cost.kgProcesados}</p>
            <p>Habitaciones: {cost.habitacionesAtendidas}</p>
            <p>Costo por kg: {money.format(cost.costoPorKg)}</p>
            <p>Costo por habitacion: {money.format(cost.costoPorHabitacion)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
