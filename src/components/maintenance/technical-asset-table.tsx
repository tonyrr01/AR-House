import type { TechnicalAsset } from "@/types";

export function TechnicalAssetTable({ assets }: { assets: TechnicalAsset[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-4">Activo</th>
            <th className="px-5 py-4">Departamento</th>
            <th className="px-5 py-4">Area</th>
            <th className="px-5 py-4">Marca / Modelo</th>
            <th className="px-5 py-4">Garantia</th>
            <th className="px-5 py-4">Costo</th>
            <th className="px-5 py-4">Estado</th>
            <th className="px-5 py-4">Refacciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td className="px-5 py-4">
                <p className="font-bold text-ink">{asset.name}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{asset.category}</p>
              </td>
              <td className="px-5 py-4 font-semibold text-slate-700">{asset.propertyName}</td>
              <td className="px-5 py-4 text-slate-600">{asset.area}</td>
              <td className="px-5 py-4 text-slate-600">{asset.brand ?? "N/A"} {asset.model ?? ""}</td>
              <td className="px-5 py-4 text-slate-600">{asset.warrantyUntil ?? "Sin garantia"}</td>
              <td className="px-5 py-4 font-bold">${asset.replacementCost}</td>
              <td className="px-5 py-4"><span className="rounded-md bg-slate-100 px-3 py-1.5 font-bold">{asset.status}</span></td>
              <td className="px-5 py-4 text-slate-600">{asset.compatibleParts.join(", ") || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
