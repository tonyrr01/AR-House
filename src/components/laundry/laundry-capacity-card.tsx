import { AlertTriangle, Gauge } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import type { LaundryCapacity } from "@/types";

export function LaundryCapacityCard({ capacities }: { capacities: LaundryCapacity[] }) {
  return (
    <Card>
      <CardTitle title="Capacidad" description="Configuracion inicial: 2 lavadoras 30 kg, 2 secadoras 35 kg y 1 auxiliar 15 kg." />
      <div className="grid gap-4 lg:grid-cols-3">
        {capacities.map((capacity) => (
          <div key={capacity.id} className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <Gauge className="h-6 w-6 text-sea" />
              <span
                className={
                  capacity.porcentajeUso > 100
                    ? "rounded-md bg-red-100 px-3 py-1 text-sm font-bold text-red-800"
                    : capacity.porcentajeUso >= 85
                      ? "rounded-md bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800"
                      : "rounded-md bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800"
                }
              >
                {capacity.porcentajeUso}%
              </span>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-500">{capacity.fecha}</p>
            <p className="mt-1 text-2xl font-bold text-ink">{capacity.kgProcesados} kg</p>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              Capacidad lavado {capacity.capacidadLavadoKgDia} kg/dia - secado {capacity.capacidadSecadoKgDia} kg/dia
            </p>
            <p className="mt-3 rounded-md bg-white p-3 text-sm font-semibold text-slate-700">{capacity.observaciones}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <ScalePhase title="Fase 1: 50 habitaciones" lines={["2 lavadoras 30 kg", "2 secadoras 35 kg", "1 auxiliar 15 kg", "250-300 kg/dia"]} />
        <ScalePhase title="Fase 2: 80-100 habitaciones" lines={["Agregar lavadora 30-40 kg", "Agregar secadora 35-45 kg", "Mas carros y anaqueles", "Mas area de kits"]} />
        <ScalePhase title="Fase 3: 150 habitaciones" lines={["Evaluar calandra", "Evaluar RFID o QR", "Mejorar rutas", "Servicio externo"]} />
      </div>

      <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
        <AlertTriangle className="mr-2 inline h-4 w-4" />
        Alerta si supera 85%; si rebasa 100%, recomendar tercerizar o crecer equipo.
      </div>
    </Card>
  );
}

function ScalePhase({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <h3 className="font-bold text-ink">{title}</h3>
      <ul className="mt-3 grid gap-2 text-sm font-semibold text-slate-600">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
