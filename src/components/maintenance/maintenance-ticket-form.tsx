import { Camera, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { maintenanceDepartments, technicians } from "@/lib/demo-data";

export function MaintenanceTicketForm() {
  return (
    <Card>
      <CardTitle title="Crear ticket manual" description="Mock preparado para guardar en Supabase en la siguiente fase." />
      <form className="grid gap-4">
        <Field label="Departamento">
          <Select required>
            <option value="">Seleccionar</option>
            {maintenanceDepartments.map((property) => (
              <option key={property.id}>{property.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Area">
          <Select defaultValue="sala">
            <option value="sala">Sala</option>
            <option value="cocina">Cocina</option>
            <option value="recamara">Recamara</option>
            <option value="bano">Bano</option>
            <option value="instalaciones">Instalaciones</option>
          </Select>
        </Field>
        <Field label="Categoria">
          <Select defaultValue="Aire acondicionado">
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
        <Field label="Titulo">
          <Input placeholder="Ej. Aire acondicionado no enfria" />
        </Field>
        <Field label="Descripcion">
          <Textarea placeholder="Describe el problema, ubicacion, evidencia y urgencia." required />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prioridad">
            <Select defaultValue="Alta">
              <option>Urgente</option>
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
              <option>Preventiva</option>
            </Select>
          </Field>
          <Field label="Especialidad">
            <Select defaultValue="Tecnico general">
              {technicians.map((tech) => (
                <option key={tech.id}>{tech.specialty}</option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Costo estimado">
            <Input type="number" min="0" placeholder="0" />
          </Field>
          <Field label="Fecha compromiso">
            <Input type="date" />
          </Field>
        </div>
        <Field label="Fotos antes">
          <Input type="file" accept="image/*" multiple />
        </Field>
        <label className="flex min-h-12 items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
          <input type="checkbox" className="h-5 w-5" />
          Sugerir cargo al huesped
        </label>
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
          Validaciones mock: no crear sin departamento y descripcion. Si hay cargo al huesped, pedir foto y costo estimado.
        </div>
        <Button type="button" className="w-full">
          <PlusCircle className="h-5 w-5" />
          Crear ticket
        </Button>
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Camera className="h-4 w-4" />
          Fotos se conectaran a Supabase Storage en la siguiente fase.
        </p>
      </form>
    </Card>
  );
}
