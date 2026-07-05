import { Camera, PlusCircle } from "lucide-react";
import { createMaintenanceTicketAction } from "@/app/(app)/mantenimiento/actions";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { maintenanceDepartments, technicians as demoTechnicians } from "@/lib/demo-data";
import type { Apartment, Technician } from "@/types";

export function MaintenanceTicketForm({
  apartments,
  technicians,
  sourceModule = "manual",
  sourceId
}: {
  apartments?: Pick<Apartment, "id" | "name" | "code" | "address">[];
  technicians?: Technician[];
  sourceModule?: string;
  sourceId?: string;
}) {
  const propertyOptions = apartments?.length ? apartments : maintenanceDepartments;
  const technicianOptions = technicians?.length ? technicians : demoTechnicians;
  const specialties = [...new Set(technicianOptions.map((tech) => tech.specialty))];

  return (
    <Card>
      <CardTitle title="Crear ticket" description="Guarda el hallazgo en Supabase con prioridad, costo y evidencia." />
      <form action={createMaintenanceTicketAction} className="grid gap-4">
        <input type="hidden" name="source_module" value={sourceModule} />
        {sourceId ? <input type="hidden" name="source_id" value={sourceId} /> : null}
        <Field label="Departamento">
          <Select name="apartment_id" required>
            <option value="">Seleccionar</option>
            {propertyOptions.map((property) => (
              <option key={property.id} value={property.id}>{property.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Area">
          <Select name="area" defaultValue="sala">
            <option value="sala">Sala</option>
            <option value="cocina">Cocina</option>
            <option value="recamara">Recamara</option>
            <option value="bano">Bano</option>
            <option value="instalaciones">Instalaciones</option>
          </Select>
        </Field>
        <Field label="Categoria">
          <Select name="category" defaultValue="Aire acondicionado">
            <option>Aire acondicionado</option>
            <option>Plomeria</option>
            <option>Electricidad</option>
            <option>Carpinteria</option>
            <option>Pintura</option>
            <option>Pisos</option>
            <option>Cerrajeria</option>
            <option>Internet / TV</option>
          </Select>
        </Field>
        <Field label="Tipo de incidencia">
          <Select name="issue_type" defaultValue="Desperfecto">
            <option>Desperfecto</option>
            <option>Dano atribuible a huesped</option>
            <option>Desgaste natural</option>
            <option>Mantenimiento preventivo</option>
            <option>Mejora</option>
            <option>Contingencia</option>
            <option>Garantia</option>
            <option>Reposicion</option>
            <option>Otro</option>
          </Select>
        </Field>
        <Field label="Titulo">
          <Input name="title" placeholder="Ej. Aire acondicionado no enfria" />
        </Field>
        <Field label="Descripcion">
          <Textarea name="description" placeholder="Describe el problema, ubicacion, evidencia y urgencia." required />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prioridad">
            <Select name="priority" defaultValue="Alta">
              <option>Urgente</option>
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
              <option>Preventiva</option>
            </Select>
          </Field>
          <Field label="Especialidad">
            <Select name="assigned_specialty" defaultValue="Tecnico general">
              {specialties.map((specialty) => (
                <option key={specialty}>{specialty}</option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Costo estimado">
            <Input name="estimated_cost" type="number" min="0" placeholder="0" />
          </Field>
          <Field label="Fecha compromiso">
            <Input name="due_date" type="date" />
          </Field>
        </div>
        <Field label="Fotos antes">
          <Input name="photos_before" type="file" accept="image/*" multiple />
        </Field>
        <Field label="Observaciones">
          <Textarea name="observations" placeholder="Notas para supervisor o tecnico." />
        </Field>
        <label className="flex min-h-12 items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
          <input name="suggested_charge_to_guest" type="checkbox" className="h-5 w-5" />
          Sugerir cargo al huesped
        </label>
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
          Para sugerir cargo al huesped agrega costo estimado y evidencia.
        </div>
        <Button type="submit" className="w-full">
          <PlusCircle className="h-5 w-5" />
          Crear ticket
        </Button>
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Camera className="h-4 w-4" />
          Las fotos se guardan en Supabase Storage como evidencia inicial.
        </p>
      </form>
    </Card>
  );
}
