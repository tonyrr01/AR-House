import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

export function priorityClass(priority: string) {
  const variants: Record<string, string> = {
    baja: "bg-mist text-pine",
    media: "bg-amber-100 text-amber-800",
    alta: "bg-orange-100 text-orange-800",
    urgente: "bg-red-100 text-red-800",
    importante: "bg-orange-100 text-orange-800",
    preventivo: "bg-sky-100 text-sky-800"
  };

  return variants[priority] ?? "bg-slate-100 text-slate-700";
}
