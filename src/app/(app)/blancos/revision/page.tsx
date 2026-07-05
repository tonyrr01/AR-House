import { Camera, CheckCircle2, ClipboardCheck, CircleDollarSign, Save, TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { linenControlItems, linenDepartmentSummaries } from "@/lib/demo-data";

const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0
});

const reviewItems = linenControlItems.filter((item) => item.propertyName === "Departamento 101");
const estimatedCost = reviewItems.reduce((sum, item) => {
  if (!item.requiereReposicion) return sum;
  return sum + Math.max(item.cantidadEsperada - item.cantidadActual, 1) * item.costoUnitario;
}, 0);

const issueOptions = ["OK", "Faltante", "Manchado", "Roto", "En lavanderia", "Baja"];

export default function LinenReviewPage() {
  return (
    <>
      <PageHeader
        title="Revision de blancos"
        description="Flujo rapido para revisar textiles despues de una limpieza y detectar cargos o reposiciones."
      />

      <form className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          <Card>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-pine text-white">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-sea">Paso 1</p>
                <h2 className="text-xl font-bold text-ink">Selecciona departamento</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Departamento">
                <Select defaultValue="dep-101">
                  {linenDepartmentSummaries.map((department) => (
                    <option key={department.propertyId} value={department.propertyId}>
                      {department.propertyName}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Limpieza relacionada">
                <Select defaultValue="lim-1001">
                  <option value="lim-1001">Checkout de hoy</option>
                  <option value="sin-limpieza">Sin limpieza relacionada</option>
                </Select>
              </Field>
            </div>
          </Card>

          <Card className="p-0">
            <div className="border-b border-slate-200 p-5">
              <CardTitle title="Paso 2 - Marca el estado" description="Los hallazgos con faltante, mancha, rotura, baja o cargo requieren foto." />
            </div>
            <div className="divide-y divide-slate-100">
              {reviewItems.map((item) => (
                <div key={item.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_180px_220px] lg:items-center">
                  <div>
                    <p className="text-sm font-bold text-sea">{item.categoria}</p>
                    <h3 className="mt-1 text-lg font-bold text-ink">{item.nombre}</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      Esperado {item.cantidadEsperada} - Actual {item.cantidadActual} - {money.format(item.costoUnitario)}
                    </p>
                  </div>
                  <Field label="Estado">
                    <Select defaultValue={item.requiereReposicion ? "Faltante" : "OK"}>
                      {issueOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Foto si hay incidencia">
                    <Input type="file" accept="image/*" />
                  </Field>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle title="Paso 3 - Observaciones" description="Usa notas cortas y claras para supervision." />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Observaciones">
                <Textarea placeholder="Ej. falta una toalla de bano, sugerir cargo al huesped." />
              </Field>
              <Field label="Evidencia general">
                <Input type="file" accept="image/*" multiple />
              </Field>
            </div>
          </Card>
        </div>

        <div className="grid h-fit gap-5">
          <Card>
            <h2 className="text-xl font-bold text-ink">Resumen</h2>
            <div className="mt-5 grid gap-3">
              <SummaryLine icon={<CheckCircle2 className="h-5 w-5" />} label="Articulos revisados" value={reviewItems.length} />
              <SummaryLine icon={<TriangleAlert className="h-5 w-5" />} label="Incidencias" value={reviewItems.filter((item) => item.requiereReposicion).length} />
              <SummaryLine icon={<CircleDollarSign className="h-5 w-5" />} label="Costo estimado" value={money.format(estimatedCost)} />
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
                Si hay faltante, roto, manchado no recuperable, baja o cargo sugerido, se sugiere crear dano/faltante con foto.
              </div>
            </div>
            <Button type="button" className="mt-5 w-full">
              <Save className="h-5 w-5" />
              Guardar revision
            </Button>
          </Card>

          <Card>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink">
              <Camera className="h-5 w-5 text-sea" />
              Regla de evidencia
            </h2>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="Faltante" />
              <StatusBadge status="Manchado" />
              <StatusBadge status="Roto" />
              <StatusBadge status="Baja" />
              <StatusBadge status="Cargo sugerido al huesped" />
            </div>
          </Card>
        </div>
      </form>
    </>
  );
}

function SummaryLine({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-slate-50 p-3">
      <div className="flex items-center gap-3 text-slate-600">
        {icon}
        <span className="font-semibold">{label}</span>
      </div>
      <span className="font-bold text-ink">{value}</span>
    </div>
  );
}
