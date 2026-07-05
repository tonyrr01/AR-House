import { cn, formatStatus } from "@/lib/utils";
import type { MaintenancePriority, MaintenanceTicketStatus, SparePart, WorkOrderStatus } from "@/types";

const priorityStyles: Record<MaintenancePriority, string> = {
  Urgente: "border-red-200 bg-red-50 text-red-800",
  Alta: "border-orange-200 bg-orange-50 text-orange-800",
  Media: "border-amber-200 bg-amber-50 text-amber-800",
  Baja: "border-slate-200 bg-slate-50 text-slate-700",
  Preventiva: "border-emerald-200 bg-emerald-50 text-emerald-800"
};

const statusStyles: Record<MaintenanceTicketStatus | WorkOrderStatus, string> = {
  Abierto: "border-sky-200 bg-sky-50 text-sky-800",
  "En revision": "border-violet-200 bg-violet-50 text-violet-800",
  Diagnostico: "border-cyan-200 bg-cyan-50 text-cyan-800",
  Cotizacion: "border-amber-200 bg-amber-50 text-amber-800",
  Aprobado: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Asignado: "border-blue-200 bg-blue-50 text-blue-800",
  "En proceso": "border-blue-200 bg-blue-50 text-blue-800",
  "En espera de material": "border-orange-200 bg-orange-50 text-orange-800",
  Terminado: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Supervision: "border-purple-200 bg-purple-50 text-purple-800",
  Cerrado: "border-slate-200 bg-slate-100 text-slate-700",
  Cancelado: "border-red-200 bg-red-50 text-red-800",
  Cancelada: "border-red-200 bg-red-50 text-red-800",
  Pendiente: "border-sky-200 bg-sky-50 text-sky-800",
  Asignada: "border-blue-200 bg-blue-50 text-blue-800",
  Terminada: "border-emerald-200 bg-emerald-50 text-emerald-800",
  "En supervision": "border-purple-200 bg-purple-50 text-purple-800",
  Cerrada: "border-slate-200 bg-slate-100 text-slate-700"
};

const stockStyles: Record<SparePart["status"], string> = {
  disponible: "border-emerald-200 bg-emerald-50 text-emerald-800",
  stock_bajo: "border-amber-200 bg-amber-50 text-amber-800",
  critico: "border-red-200 bg-red-50 text-red-800",
  descontinuado: "border-slate-300 bg-slate-100 text-slate-700"
};

export function MaintenancePriorityBadge({ priority }: { priority: MaintenancePriority }) {
  return <span className={cn("inline-flex rounded-md border px-3 py-1.5 text-sm font-bold", priorityStyles[priority])}>{priority}</span>;
}

export function MaintenanceStatusBadge({ status }: { status: MaintenanceTicketStatus | WorkOrderStatus }) {
  return <span className={cn("inline-flex rounded-md border px-3 py-1.5 text-sm font-bold", statusStyles[status])}>{formatStatus(status)}</span>;
}

export function SparePartStockBadge({ part }: { part: SparePart }) {
  const label = part.stockActual <= 0 ? "Sin stock" : part.stockActual <= part.stockMinimo ? "Stock bajo" : "Disponible";
  return <span className={cn("inline-flex rounded-md border px-3 py-1.5 text-sm font-bold", stockStyles[part.status])}>{label}</span>;
}
