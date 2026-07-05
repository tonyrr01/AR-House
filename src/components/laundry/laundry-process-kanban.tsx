import { ArrowRight } from "lucide-react";
import { moveLaundryBatchAction } from "@/app/(app)/lavanderia/actions";
import { LaundryStatusBadge } from "@/components/laundry/laundry-status-badge";
import { Button } from "@/components/ui/button";
import { nextLaundryStep } from "@/lib/laundry/supabase-laundry";
import type { LaundryBatch, LaundryStatus } from "@/types";

const columns: LaundryStatus[] = [
  "Sucio recibido",
  "En clasificacion",
  "En pretratamiento",
  "En lavado",
  "En secado",
  "En inspeccion",
  "Limpio aprobado",
  "Observado",
  "Baja"
];

export function LaundryProcessKanban({ batches, canMove = false }: { batches: LaundryBatch[]; canMove?: boolean }) {
  return (
    <div className="grid gap-4 overflow-x-auto xl:grid-cols-3 2xl:grid-cols-5">
      {columns.map((column) => {
        const columnBatches = batches.filter((batch) => batch.estado === column);
        return (
          <section key={column} className="min-w-72 rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <LaundryStatusBadge status={column} />
              <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-500">{columnBatches.length}</span>
            </div>
            <div className="grid gap-3">
              {columnBatches.length === 0 ? (
                <p className="rounded-md bg-white p-4 text-sm font-semibold text-slate-400">Sin lotes</p>
              ) : (
                columnBatches.map((batch) => (
                  <article key={batch.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm font-bold text-sea">{batch.id}</p>
                    <h3 className="mt-1 text-base font-bold text-ink">{batch.propertyName}</h3>
                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      {batch.pesoKg} kg - {batch.piezasRecibidas} piezas
                    </p>
                    {canMove && nextLaundryStep[batch.estado] ? (
                      <form action={moveLaundryBatchAction}>
                        <input type="hidden" name="batch_id" value={batch.id} />
                        <input type="hidden" name="current_status" value={batch.estado} />
                        <Button type="submit" variant="secondary" className="mt-3 w-full text-sm">
                          Mover siguiente
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </form>
                    ) : (
                      <Button type="button" variant="secondary" className="mt-3 w-full text-sm" disabled>
                        Mover siguiente
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </article>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
