import { Camera, PackagePlus } from "lucide-react";
import { createLaundryBatchAction } from "@/app/(app)/lavanderia/actions";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import type { Apartment, Cleaning, LinenCategory } from "@/types";

const categories: Array<{ key: string; label: LinenCategory; defaultValue: number }> = [
  { key: "sabana_bajera", label: "Sabana bajera", defaultValue: 2 },
  { key: "sabana_encimera", label: "Sabana encimera", defaultValue: 2 },
  { key: "funda_almohada", label: "Funda de almohada", defaultValue: 4 },
  { key: "protector_colchon", label: "Protector de colchon", defaultValue: 1 },
  { key: "toalla_bano", label: "Toalla de bano", defaultValue: 6 },
  { key: "toalla_mano", label: "Toalla de mano", defaultValue: 4 },
  { key: "tapete_bano", label: "Tapete de bano", defaultValue: 2 },
  { key: "toalla_playa", label: "Toalla de playa/alberca", defaultValue: 0 },
  { key: "trapo_cocina", label: "Trapo de cocina", defaultValue: 1 }
];

export function LaundryReceptionForm({
  apartments,
  cleanings,
  isConnectedToSupabase
}: {
  apartments: Pick<Apartment, "id" | "name" | "code" | "address">[];
  cleanings: Pick<Cleaning, "id" | "apartmentId" | "scheduledDate" | "status" | "cleaningType">[];
  isConnectedToSupabase: boolean;
}) {
  return (
    <Card>
      <CardTitle
        title="Recepcion de blancos sucios"
        description="Crea un lote con departamento, peso, conteo y evidencia cuando haya manchas o dano."
      />
      <form action={createLaundryBatchAction} className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Departamento">
            <Select name="apartment_id" required>
              <option value="">Seleccionar</option>
              {apartments.map((apartment) => (
                <option key={apartment.id} value={apartment.id}>
                  {apartment.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Limpieza relacionada">
            <Select name="cleaning_id" defaultValue="sin-limpieza">
              <option value="sin-limpieza">Sin limpieza</option>
              {cleanings.map((cleaning) => (
                <option key={cleaning.id} value={cleaning.id}>
                  {cleaning.scheduledDate} - {cleaning.cleaningType}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Fotos recepcion">
            <Input name="reception_photo_count" type="number" min="0" defaultValue={0} />
          </Field>
          <Field label="Peso kg">
            <Input name="weight_kg" type="number" min="0" step="0.1" placeholder="Ej. 28.4" required />
          </Field>
          <Field label="Estado inicial">
            <Select name="initial_status" defaultValue="Sucio recibido" disabled>
              <option>Sucio recibido</option>
              <option>En clasificacion</option>
            </Select>
          </Field>
        </div>

        <div>
          <h3 className="mb-3 text-base font-bold text-ink">Piezas recibidas por categoria</h3>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <Field key={category.key} label={category.label}>
                <Input name={category.key} type="number" min="0" defaultValue={category.defaultValue} />
              </Field>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Observaciones">
            <Textarea name="notes" placeholder="Ej. volumen anormal, manchas, piezas rotas o faltantes." />
          </Field>
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
            {isConnectedToSupabase
              ? "Este formulario ya guarda el lote y las cantidades en Supabase. Las fotos se conectan en el siguiente paso."
              : "Vista de respaldo: inicia sesion o revisa permisos para guardar en Supabase."}
          </div>
        </div>

        <Button type="submit" className="w-full md:w-fit">
          <PackagePlus className="h-5 w-5" />
          Crear lote de lavanderia
        </Button>
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Camera className="h-4 w-4" />
          Pendiente: guardar fotos en Supabase Storage y asociarlas al lote.
        </p>
      </form>
    </Card>
  );
}
