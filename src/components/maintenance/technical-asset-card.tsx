import { FileText, ImageIcon } from "lucide-react";
import type { TechnicalAsset } from "@/types";

export function TechnicalAssetCard({ asset }: { asset: TechnicalAsset }) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-sea">{asset.propertyName}</p>
          <h3 className="mt-1 text-lg font-bold text-ink">{asset.name}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">{asset.category} · {asset.area}</p>
        </div>
        <span className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700">{asset.status}</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Metric label="Marca" value={asset.brand ?? "N/A"} />
        <Metric label="Modelo" value={asset.model ?? "N/A"} />
        <Metric label="Garantia" value={asset.warrantyUntil ?? "Sin garantia"} />
        <Metric label="Reposicion" value={`$${asset.replacementCost}`} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold text-slate-600">
        <span className="inline-flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2"><ImageIcon className="h-4 w-4" /> Foto</span>
        <span className="inline-flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2"><FileText className="h-4 w-4" /> Manual</span>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-ink">{value}</p>
    </div>
  );
}
