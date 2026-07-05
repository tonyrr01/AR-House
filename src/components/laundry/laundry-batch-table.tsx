import { LaundryStatusBadge } from "@/components/laundry/laundry-status-badge";
import type { LaundryBatch } from "@/types";

export function LaundryBatchTable({ batches }: { batches: LaundryBatch[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-4">Lote</th>
            <th className="px-5 py-4">Departamento</th>
            <th className="px-5 py-4">Responsable</th>
            <th className="px-5 py-4">Kg</th>
            <th className="px-5 py-4">Piezas</th>
            <th className="px-5 py-4">Estado</th>
            <th className="px-5 py-4">Fotos</th>
            <th className="px-5 py-4">Actualizado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {batches.map((batch) => (
            <tr key={batch.id}>
              <td className="px-5 py-4 font-bold text-ink">{batch.id}</td>
              <td className="px-5 py-4">
                <p className="font-semibold text-ink">{batch.propertyName}</p>
                <p className="mt-1 text-xs text-slate-500">{batch.cleaningId ?? "Sin limpieza"}</p>
              </td>
              <td className="px-5 py-4 text-slate-600">{batch.responsableRecepcion}</td>
              <td className="px-5 py-4 font-bold">{batch.pesoKg}</td>
              <td className="px-5 py-4 font-bold">{batch.piezasRecibidas}</td>
              <td className="px-5 py-4"><LaundryStatusBadge status={batch.estado} /></td>
              <td className="px-5 py-4">{batch.fotosRecepcion}</td>
              <td className="px-5 py-4 text-slate-600">{batch.actualizadoEn.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
