import { cn, formatStatus, priorityClass } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  pendiente: "border-amber-200 bg-amber-50 text-amber-800",
  en_progreso: "border-sky-200 bg-sky-50 text-sky-800",
  en_supervision: "border-violet-200 bg-violet-50 text-violet-800",
  aprobada: "border-emerald-200 bg-emerald-50 text-emerald-800",
  requiere_correccion: "border-red-200 bg-red-50 text-red-800",
  abierto: "border-amber-200 bg-amber-50 text-amber-800",
  en_proceso: "border-sky-200 bg-sky-50 text-sky-800",
  resuelto: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cerrado: "border-slate-200 bg-slate-100 text-slate-700",
  ok: "border-emerald-200 bg-emerald-50 text-emerald-800",
  revisar: "border-amber-200 bg-amber-50 text-amber-800",
  reponer: "border-red-200 bg-red-50 text-red-800",
  retirar: "border-slate-300 bg-slate-100 text-slate-800"
};

const statusLabels: Record<string, string> = {
  pendiente: "Pendiente",
  en_progreso: "En proceso",
  en_supervision: "En revision",
  aprobada: "Aprobada",
  requiere_correccion: "Rechazada"
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-bold capitalize",
        statusStyles[status] ?? "border-slate-200 bg-slate-100 text-slate-700"
      )}
    >
      {statusLabels[status] ?? formatStatus(status)}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={cn("inline-flex rounded-md px-2.5 py-1 text-xs font-semibold capitalize", priorityClass(priority))}>
      {priority}
    </span>
  );
}
