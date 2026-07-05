import { Camera, SearchCheck } from "lucide-react";
import { LaundryStatusBadge } from "@/components/laundry/laundry-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import type { LaundryBatchItem } from "@/types";

const inspectionStates = [
  "Limpio aprobado",
  "Manchado recuperable",
  "Manchado no recuperable",
  "Roto",
  "Percudido",
  "Baja",
  "Extraviado",
  "Cargo sugerido al huesped"
];

export function LaundryInspectionPanel({ items }: { items: LaundryBatchItem[] }) {
  return (
    <Card>
      <CardTitle
        title="Inspeccion"
        description="Clasifica piezas observadas antes de aprobarlas, reponerlas o sugerir cargo."
      />
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="grid gap-4 rounded-md border border-slate-200 p-4 lg:grid-cols-[1fr_220px_220px] lg:items-end">
            <div>
              <p className="text-sm font-bold text-sea">{item.batchId}</p>
              <h3 className="mt-1 text-lg font-bold text-ink">{item.nombre}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Recibidas {item.cantidadRecibida} - Observadas {item.cantidadObservada} - Baja {item.cantidadBaja}
              </p>
              <div className="mt-3"><LaundryStatusBadge status={item.estado} /></div>
            </div>
            <Field label="Resultado inspeccion">
              <Select defaultValue={item.estado}>
                {inspectionStates.map((state) => (
                  <option key={state}>{state}</option>
                ))}
              </Select>
            </Field>
            <Field label="Foto si hay cargo o baja">
              <Input type="file" accept="image/*" />
            </Field>
            <Field label="Descripcion / causa">
              <Textarea placeholder="Causa de baja, descripcion de cargo o mancha no recuperable." />
            </Field>
            <Field label="Costo estimado">
              <Input type="number" min="0" defaultValue={item.costoReposicionEstimado} />
            </Field>
            <Button type="button" variant="secondary" className="w-full">
              <SearchCheck className="h-5 w-5" />
              Guardar inspeccion
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
        <Camera className="mr-2 inline h-4 w-4" />
        Reglas: baja pide causa; cargo pide foto, descripcion y costo; roto o manchado no recuperable sugieren reposicion.
      </div>
    </Card>
  );
}
