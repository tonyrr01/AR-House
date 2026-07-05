import type { Technician } from "@/types";

export function TechnicianTable({ technicians }: { technicians: Technician[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {technicians.map((tech) => (
        <article key={tech.id} className="rounded-md border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-ink">{tech.name}</h3>
              <p className="mt-1 text-sm font-bold text-sea">{tech.specialty}</p>
            </div>
            <span className={`rounded-md px-2 py-1 text-xs font-bold ${tech.active ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>{tech.active ? "Activo" : "Inactivo"}</span>
          </div>
          <div className="mt-4 grid gap-2 text-sm font-semibold text-slate-600">
            <p>{tech.internalOrExternal}</p>
            <p>{tech.phone}</p>
            <p>${tech.hourlyRate}/h · Rating {tech.rating}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
