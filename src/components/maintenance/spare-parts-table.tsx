import { SparePartStockBadge } from "@/components/maintenance/maintenance-badges";
import type { SparePart } from "@/types";

export function SparePartsTable({ parts }: { parts: SparePart[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-4">Refaccion</th>
            <th className="px-5 py-4">Stock</th>
            <th className="px-5 py-4">Minimo</th>
            <th className="px-5 py-4">Costo</th>
            <th className="px-5 py-4">Proveedor</th>
            <th className="px-5 py-4">Ubicacion</th>
            <th className="px-5 py-4">Compatibilidad</th>
            <th className="px-5 py-4">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {parts.map((part) => (
            <tr key={part.id}>
              <td className="px-5 py-4">
                <p className="font-bold text-ink">{part.name}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{part.category}</p>
              </td>
              <td className="px-5 py-4 text-lg font-bold">{part.stockActual}</td>
              <td className="px-5 py-4 text-slate-600">{part.stockMinimo}</td>
              <td className="px-5 py-4 font-bold">${part.unitCost}</td>
              <td className="px-5 py-4 text-slate-600">{part.supplier}</td>
              <td className="px-5 py-4 text-slate-600">{part.location}</td>
              <td className="px-5 py-4 text-slate-600">{part.compatibleProperties.join(", ")}</td>
              <td className="px-5 py-4"><SparePartStockBadge part={part} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
