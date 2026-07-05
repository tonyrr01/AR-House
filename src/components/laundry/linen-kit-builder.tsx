import { PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Field, Select } from "@/components/ui/field";

export function LinenKitBuilder() {
  return (
    <Card>
      <CardTitle
        title="Armado de kits"
        description="Prepara kits por cama, bano, playa, cocina o departamento completo."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Departamento">
          <Select defaultValue="dep-101">
            <option value="dep-101">Departamento 101</option>
            <option value="dep-102">Departamento 102</option>
            <option value="dep-201">Departamento 201</option>
            <option value="dep-202">Departamento 202</option>
          </Select>
        </Field>
        <Field label="Tipo de kit">
          <Select defaultValue="completo_departamento">
            <option value="cama_queen">Cama Queen</option>
            <option value="cama_king">Cama King</option>
            <option value="bano">Bano</option>
            <option value="playa">Playa</option>
            <option value="cocina">Cocina</option>
            <option value="completo_departamento">Completo departamento</option>
          </Select>
        </Field>
        <Field label="Estado">
          <Select defaultValue="pendiente">
            <option value="pendiente">Pendiente</option>
            <option value="armado">Armado</option>
            <option value="incompleto">Incompleto</option>
            <option value="en_ruta">En ruta</option>
            <option value="entregado">Entregado</option>
          </Select>
        </Field>
      </div>
      <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
        Validacion operativa: no armar kit si el stock disponible no alcanza; no marcar entregado si esta incompleto salvo confirmacion explicita.
      </div>
      <Button type="button" className="mt-5 w-full md:w-fit">
        <PackagePlus className="h-5 w-5" />
        Crear kit
      </Button>
    </Card>
  );
}
