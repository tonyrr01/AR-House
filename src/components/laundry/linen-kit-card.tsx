import { PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { LinenKit } from "@/types";

const statusStyles: Record<string, string> = {
  pendiente: "bg-amber-50 text-amber-800 border-amber-200",
  armado: "bg-emerald-50 text-emerald-800 border-emerald-200",
  en_ruta: "bg-sky-50 text-sky-800 border-sky-200",
  entregado: "bg-mist text-pine border-pine/20",
  incompleto: "bg-red-50 text-red-800 border-red-200"
};

export function LinenKitCard({ kit }: { kit: LinenKit }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-sea">{kit.propertyName}</p>
          <h3 className="mt-1 text-xl font-bold capitalize text-ink">{kit.tipoKit.replaceAll("_", " ")}</h3>
        </div>
        <span className={`rounded-md border px-3 py-1.5 text-sm font-bold ${statusStyles[kit.estado]}`}>
          {kit.estado.replaceAll("_", " ")}
        </span>
      </div>
      <div className="mt-4 grid gap-2">
        {kit.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 rounded-md bg-slate-50 p-3 text-sm">
            <span className="font-semibold text-slate-700">{item.nombre}</span>
            <span className={item.estado === "completo" ? "font-bold text-emerald-700" : "font-bold text-red-700"}>
              {item.cantidadIncluida}/{item.cantidadRequerida}
            </span>
          </div>
        ))}
      </div>
      {kit.observaciones ? <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm font-semibold text-amber-900">{kit.observaciones}</p> : null}
      <Button type="button" variant="secondary" className="mt-4 w-full">
        <PackageCheck className="h-5 w-5" />
        Revisar kit
      </Button>
    </Card>
  );
}
