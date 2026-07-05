import { Camera, ClipboardCheck, PackageCheck, Send, Sparkles, TriangleAlert, WashingMachine, Wrench } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { StatusBadge } from "@/components/ui/badge";
import { cleanings } from "@/lib/demo-data";

export default async function CleaningDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cleaning = cleanings.find((item) => item.id === id);

  if (!cleaning) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={cleaning.apartmentName}
        description="Flujo guiado para recibir, limpiar, documentar y enviar a supervision."
        action={<StatusBadge status={cleaning.status} />}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-5">
          <Card>
            <CardTitle title="1. Iniciar limpieza" />
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Salida</p>
                <p className="mt-1 text-xl font-bold">{cleaning.checkOutTime}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Entrada</p>
                <p className="mt-1 text-xl font-bold">{cleaning.checkInTime}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Responsable</p>
                <p className="mt-1 text-xl font-bold">{cleaning.assignedTo}</p>
              </div>
            </div>
            <Button className="mt-5 w-full sm:w-auto" type="button">
              <Sparkles className="h-5 w-5" />
              Iniciar limpieza
            </Button>
          </Card>

          <Card>
            <CardTitle title="2. Fotos de recepcion" />
            <form className="grid gap-5">
              <Field label="Fotos iniciales obligatorias">
                <Input type="file" accept="image/*" multiple />
              </Field>
              <Field label="Notas breves">
                <Textarea placeholder="Ej. basura en cocina, cama usada, mancha en sabanas..." />
              </Field>
              <Button type="button" variant="secondary" className="w-full sm:w-auto">
                <Camera className="h-5 w-5" />
                Guardar recepcion
              </Button>
            </form>
          </Card>

          <Card>
            <CardTitle title="3. Fotos finales" />
            <form className="grid gap-5">
              <Field label="Fotos finales obligatorias">
                <Input type="file" accept="image/*" multiple />
              </Field>
              <Field label="Comentarios finales">
                <Textarea placeholder="Observaciones para supervisor o propietario." />
              </Field>
              <Button type="button" className="w-full sm:w-auto">
                <Send className="h-5 w-5" />
                Enviar a supervision
              </Button>
            </form>
          </Card>

          <Card>
            <CardTitle title="4. Crear ticket de mantenimiento" />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-md bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Origen</p>
                <p className="mt-1 text-lg font-bold text-ink">Limpieza</p>
              </div>
              <div className="rounded-md bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Departamento</p>
                <p className="mt-1 text-lg font-bold text-ink">{cleaning.apartmentName}</p>
              </div>
              <div className="rounded-md bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Limpieza</p>
                <p className="mt-1 text-lg font-bold text-ink">{cleaning.id}</p>
              </div>
            </div>
            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
              Abre mantenimiento con la limpieza como origen para registrar el hallazgo con prioridad, costo y evidencia.
            </p>
            <ButtonLink href={`/mantenimiento?sourceModule=limpieza&sourceId=${cleaning.id}#tickets`} variant="secondary" className="mt-5 w-full sm:w-auto">
              <Wrench className="h-5 w-5" />
              Crear ticket de mantenimiento
            </ButtonLink>
          </Card>

          <Card>
            <CardTitle title="5. Enviar blancos a lavanderia" />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-md bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Estado lote</p>
                <p className="mt-1 text-lg font-bold text-ink">Sucio recibido</p>
              </div>
              <div className="rounded-md bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Piezas estimadas</p>
                <p className="mt-1 text-lg font-bold text-ink">42</p>
              </div>
              <div className="rounded-md bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Responsable</p>
                <p className="mt-1 text-lg font-bold text-ink">{cleaning.assignedTo}</p>
              </div>
            </div>
            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
              Preparado para crear un lote con departamento, limpieza, fecha, responsable y piezas estimadas.
            </p>
            <Button type="button" variant="secondary" className="mt-5 w-full sm:w-auto">
              <WashingMachine className="h-5 w-5" />
              Enviar blancos a lavanderia
            </Button>
          </Card>
        </div>

        <Card className="h-fit">
          <CardTitle title="Acciones de limpieza" />
          <div className="grid gap-3">
            <ButtonLink href="/checklist" variant="secondary" className="justify-start">
              <ClipboardCheck className="h-5 w-5" />
              Checklist
            </ButtonLink>
            <ButtonLink href="/inventario" variant="secondary" className="justify-start">
              <PackageCheck className="h-5 w-5" />
              Inventario
            </ButtonLink>
            <ButtonLink href="/danos-faltantes" variant="secondary" className="justify-start">
              <TriangleAlert className="h-5 w-5" />
              Dano o faltante
            </ButtonLink>
            <ButtonLink href="/lavanderia" variant="secondary" className="justify-start">
              <WashingMachine className="h-5 w-5" />
              Lavanderia y Bodega
            </ButtonLink>
            <ButtonLink href={`/mantenimiento?sourceModule=limpieza&sourceId=${cleaning.id}#tickets`} variant="secondary" className="justify-start">
              <Wrench className="h-5 w-5" />
              Ticket mantenimiento
            </ButtonLink>
            <ButtonLink href="/reportes/limpieza" variant="secondary" className="justify-start">
              Ver reporte
            </ButtonLink>
          </div>
        </Card>
      </div>
    </>
  );
}
