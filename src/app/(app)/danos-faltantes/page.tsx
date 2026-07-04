import { Camera, ImagePlus, TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PriorityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { cleanings, damageReports } from "@/lib/demo-data";

export default function DamagesPage() {
  return (
    <>
      <PageHeader
        title="Danos y faltantes"
        description="Evidencia clara para cobrar afectaciones y proteger la operacion."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="grid gap-4">
          {damageReports.map((report) => (
            <Card key={report.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-700">
                    <TriangleAlert className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold capitalize text-sea">{report.type}</p>
                    <h2 className="text-xl font-bold text-ink">{report.title}</h2>
                    <p className="mt-1 text-base text-slate-600">{report.description}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      {report.itemName ?? "Sin articulo"} · {report.damageType ?? "Sin clasificar"}
                    </p>
                  </div>
                </div>
                <PriorityBadge priority={report.priority} />
              </div>
              <p className="mt-5 rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-600">
                {report.apartmentName} · {report.photoCount} foto(s) · {report.createdAt}
              </p>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <h2 className="mb-5 flex items-center gap-3 text-xl font-bold">
            <Camera className="h-5 w-5 text-sea" />
            Nuevo reporte
          </h2>
          <form className="grid gap-5">
            <Field label="Limpieza">
              <Select>
                {cleanings.map((cleaning) => (
                  <option key={cleaning.id}>{cleaning.apartmentName}</option>
                ))}
              </Select>
            </Field>
            <Field label="Tipo">
              <Select defaultValue="dano">
                <option value="dano">Dano</option>
                <option value="faltante">Faltante</option>
              </Select>
            </Field>
            <Field label="Titulo">
              <Input placeholder="Ej. Cristal roto en mesa" />
            </Field>
            <Field label="Articulo relacionado">
              <Input placeholder="Ej. Copa de vino, sofa, toalla" />
            </Field>
            <Field label="Tipo de dano">
              <Input placeholder="Roto, manchado, faltante..." />
            </Field>
            <Field label="Descripcion">
              <Textarea placeholder="Describe que encontraste y en que area." />
            </Field>
            <Field label="Prioridad">
              <Select defaultValue="media">
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </Select>
            </Field>
            <Field label="Foto">
              <Input type="file" accept="image/*" multiple />
            </Field>
            <Button type="button" className="w-full">
              <ImagePlus className="h-5 w-5" />
              Registrar con foto
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
