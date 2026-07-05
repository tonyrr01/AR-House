import { cn, formatStatus } from "@/lib/utils";
import type { StockLevel } from "@/types";

const laundryStatusStyles: Record<string, string> = {
  "Sucio recibido": "border-amber-200 bg-amber-50 text-amber-800",
  "En clasificacion": "border-sky-200 bg-sky-50 text-sky-800",
  "En pretratamiento": "border-orange-200 bg-orange-50 text-orange-800",
  "En lavado": "border-blue-200 bg-blue-50 text-blue-800",
  "En secado": "border-cyan-200 bg-cyan-50 text-cyan-800",
  "En inspeccion": "border-violet-200 bg-violet-50 text-violet-800",
  "Limpio aprobado": "border-emerald-200 bg-emerald-50 text-emerald-800",
  Observado: "border-amber-200 bg-amber-50 text-amber-800",
  "En bodega": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Kit armado": "border-pine/20 bg-mist text-pine",
  "En ruta": "border-sky-200 bg-sky-50 text-sky-800",
  "Entregado a unidad": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Manchado recuperable": "border-amber-200 bg-amber-50 text-amber-800",
  "Manchado no recuperable": "border-red-200 bg-red-50 text-red-800",
  Roto: "border-red-200 bg-red-50 text-red-800",
  Percudido: "border-amber-200 bg-amber-50 text-amber-800",
  Extraviado: "border-red-200 bg-red-50 text-red-800",
  Baja: "border-slate-300 bg-slate-100 text-slate-800",
  "Cargo sugerido al huesped": "border-clay/20 bg-clay/10 text-clay"
};

const stockStyles: Record<StockLevel, string> = {
  suficiente: "bg-emerald-50 text-emerald-800 border-emerald-200",
  bajo: "bg-amber-50 text-amber-800 border-amber-200",
  critico: "bg-red-50 text-red-800 border-red-200"
};

export function LaundryStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-bold",
        laundryStatusStyles[status] ?? "border-slate-200 bg-slate-100 text-slate-700"
      )}
    >
      {formatStatus(status)}
    </span>
  );
}

export function StockLevelBadge({ level }: { level: StockLevel }) {
  return (
    <span className={cn("inline-flex rounded-md border px-3 py-1.5 text-sm font-bold", stockStyles[level])}>
      {level === "suficiente" ? "Verde" : level === "bajo" ? "Amarillo" : "Rojo"} - {level}
    </span>
  );
}
