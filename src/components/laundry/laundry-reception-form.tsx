import { Camera, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import type { LinenCategory } from "@/types";

const categories: LinenCategory[] = [
  "Sabana bajera",
  "Sabana encimera",
  "Funda de almohada",
  "Protector de colchon",
  "Toalla de bano",
  "Toalla de mano",
  "Tapete de bano",
  "Toalla de playa/alberca",
  "Trapo de cocina"
];

export function LaundryReceptionForm() {
  return (
    <Card>
      <CardTitle
        title="Recepcion de blancos sucios"
        description="Crea un lote con departamento, peso, conteo y evidencia cuando haya manchas o dano."
      />
      <form className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Departamento">
            <Select defaultValue="dep-101" required>
              <option value="dep-101">Departamento 101</option>
              <option value="dep-102">Departamento 102</option>
              <option value="dep-201">Departamento 201</option>
              <option value="dep-202">Departamento 202</option>
            </Select>
          </Field>
          <Field label="Limpieza relacionada">
            <Select defaultValue="lim-1001">
              <option value="lim-1001">Checkout de hoy</option>
              <option value="sin-limpieza">Sin limpieza</option>
            </Select>
          </Field>
          <Field label="Responsable">
            <Input defaultValue="Ana Lopez" />
          </Field>
          <Field label="Peso kg">
            <Input type="number" min="0" step="0.1" placeholder="Ej. 28.4" required />
          </Field>
          <Field label="Estado inicial">
            <Select defaultValue="Sucio recibido">
              <option>Sucio recibido</option>
              <option>En clasificacion</option>
            </Select>
          </Field>
          <Field label="Fotos recepcion">
            <Input type="file" accept="image/*" multiple />
          </Field>
        </div>

        <div>
          <h3 className="mb-3 text-base font-bold text-ink">Piezas recibidas por categoria</h3>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <Field key={category} label={category}>
                <Input type="number" min="0" defaultValue={category.includes("Toalla") ? 6 : 2} />
              </Field>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Observaciones">
            <Textarea placeholder="Ej. volumen anormal, manchas, piezas rotas o faltantes." />
          </Field>
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
            Validaciones mock: no guardar sin departamento, peso y al menos una categoria. Si hay manchas o dano, solicitar foto y observacion.
          </div>
        </div>

        <Button type="button" className="w-full md:w-fit">
          <PackagePlus className="h-5 w-5" />
          Crear lote de lavanderia
        </Button>
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Camera className="h-4 w-4" />
          Futuro: guardar fotos en Supabase Storage y asociarlas al lote.
        </p>
      </form>
    </Card>
  );
}
