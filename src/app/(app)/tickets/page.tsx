import { Wrench } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { apartments, maintenanceTickets } from "@/lib/demo-data";

export default function TicketsPage() {
  return (
    <>
      <PageHeader
        title="Tickets de mantenimiento"
        description="Pendientes tecnicos detectados por limpieza o supervisor."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="grid gap-4">
          {maintenanceTickets.map((ticket) => (
            <Card key={ticket.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-mist text-pine">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-sea">{ticket.apartmentName}</p>
                    <h2 className="text-xl font-bold text-ink">{ticket.title}</h2>
                    <p className="mt-1 text-base text-slate-600">{ticket.description}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      {ticket.maintenanceArea ?? "Area pendiente"} · {ticket.maintenanceCategory ?? "Categoria pendiente"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <PriorityBadge priority={ticket.priority} />
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
              <p className="mt-5 rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-600">
                Asignado a {ticket.assignedTo} · {ticket.createdAt}
              </p>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <h2 className="mb-5 flex items-center gap-3 text-xl font-bold">
            <Wrench className="h-5 w-5 text-sea" />
            Nuevo ticket
          </h2>
          <form className="grid gap-5">
            <Field label="Departamento">
              <Select>
                {apartments.map((apartment) => (
                  <option key={apartment.id}>{apartment.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Titulo">
              <Input placeholder="Ej. Fuga debajo del lavabo" />
            </Field>
            <Field label="Descripcion">
              <Textarea placeholder="Detalle del problema, ubicacion y urgencia." />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Area">
                <Input placeholder="Cocina, bano..." />
              </Field>
              <Field label="Categoria">
                <Input placeholder="Plomeria, pintura..." />
              </Field>
            </div>
            <Field label="Prioridad">
              <Select defaultValue="importante">
                <option value="urgente">Urgente</option>
                <option value="importante">Importante</option>
                <option value="preventivo">Preventivo</option>
              </Select>
            </Field>
            <Field label="Asignar a">
              <Input placeholder="Proveedor o responsable interno" />
            </Field>
            <Button type="button" className="w-full">Crear ticket</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
