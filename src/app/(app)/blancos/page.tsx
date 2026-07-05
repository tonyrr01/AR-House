import { AlertTriangle, Boxes, Building2, CheckCircle2, CircleDollarSign, Shirt, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Field, Select } from "@/components/ui/field";
import { linenControlItems, linenDepartmentSummaries } from "@/lib/demo-data";

const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0
});

const issueStates = new Set([
  "Manchado recuperable",
  "Manchado no recuperable",
  "Roto",
  "Percudido",
  "Extraviado",
  "Baja",
  "Cargo sugerido al huesped"
]);

const categories = Array.from(new Set(linenControlItems.map((item) => item.categoria)));
const states = Array.from(new Set(linenControlItems.map((item) => item.estado)));
const locations = Array.from(new Set(linenControlItems.map((item) => item.ubicacion)));
const properties = Array.from(new Set(linenControlItems.map((item) => item.propertyName).filter(Boolean)));

const totals = {
  total: linenControlItems.reduce((sum, item) => sum + item.cantidadTotal, 0),
  departments: linenControlItems
    .filter((item) => item.ubicacion === "Departamento")
    .reduce((sum, item) => sum + item.cantidadActual, 0),
  laundry: linenControlItems
    .filter((item) => item.ubicacion === "Lavanderia")
    .reduce((sum, item) => sum + item.cantidadActual, 0),
  storage: linenControlItems
    .filter((item) => item.ubicacion === "Bodega")
    .reduce((sum, item) => sum + item.cantidadActual, 0),
  issues: linenControlItems.filter((item) => issueStates.has(item.estado)).length,
  missing: linenControlItems
    .filter((item) => item.estado === "Extraviado")
    .reduce((sum, item) => sum + Math.max(item.cantidadEsperada - item.cantidadActual, 0), 0),
  retired: linenControlItems
    .filter((item) => item.estado === "Baja")
    .reduce((sum, item) => sum + item.cantidadTotal, 0),
  cost: linenControlItems.reduce((sum, item) => {
    if (!item.requiereReposicion) return sum;
    return sum + Math.max(item.cantidadEsperada - item.cantidadActual, 1) * item.costoUnitario;
  }, 0)
};

const metricCards = [
  { label: "Blancos totales", value: totals.total, icon: Shirt, tone: "bg-pine text-white" },
  { label: "En departamentos", value: totals.departments, icon: Building2, tone: "bg-sea text-white" },
  { label: "En lavanderia", value: totals.laundry, icon: Sparkles, tone: "bg-sky-100 text-sky-800" },
  { label: "En bodega", value: totals.storage, icon: Boxes, tone: "bg-emerald-100 text-emerald-800" },
  { label: "Manchados o danados", value: totals.issues, icon: AlertTriangle, tone: "bg-amber-100 text-amber-800" },
  { label: "Extraviados", value: totals.missing, icon: AlertTriangle, tone: "bg-red-100 text-red-800" },
  { label: "Bajas", value: totals.retired, icon: CheckCircle2, tone: "bg-slate-200 text-slate-800" },
  { label: "Costo reposicion", value: money.format(totals.cost), icon: CircleDollarSign, tone: "bg-clay text-white" }
];

export default function LinenPage() {
  return (
    <>
      <PageHeader
        title="Blancos"
        description="Control operativo de sabanas, toallas, protectores y textiles por departamento, bodega y lavanderia."
        action={<ButtonLink href="/blancos/revision">Revisar blancos</ButtonLink>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => (
          <Card key={metric.label} className="p-4">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${metric.tone}`}>
                <metric.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">{metric.label}</p>
                <p className="mt-1 text-2xl font-bold text-ink">{metric.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardTitle title="Filtros" description="Filtra rapido por unidad, categoria, estado o ubicacion." />
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <Field label="Departamento">
            <Select defaultValue="todos">
              <option value="todos">Todos</option>
              {properties.map((property) => (
                <option key={property}>{property}</option>
              ))}
            </Select>
          </Field>
          <Field label="Categoria">
            <Select defaultValue="todas">
              <option value="todas">Todas</option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </Select>
          </Field>
          <Field label="Estado">
            <Select defaultValue="todos">
              <option value="todos">Todos</option>
              {states.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </Select>
          </Field>
          <Field label="Ubicacion">
            <Select defaultValue="todas">
              <option value="todas">Todas</option>
              {locations.map((location) => (
                <option key={location}>{location}</option>
              ))}
            </Select>
          </Field>
          <Field label="Reposicion">
            <Select defaultValue="todos">
              <option value="todos">Todos</option>
              <option value="si">Requiere</option>
              <option value="no">No requiere</option>
            </Select>
          </Field>
          <Field label="Cargo huesped">
            <Select defaultValue="todos">
              <option value="todos">Todos</option>
              <option value="si">Sugerido</option>
              <option value="no">Sin cargo</option>
            </Select>
          </Field>
        </div>
      </Card>

      <Card className="mt-6 overflow-hidden p-0">
        <div className="border-b border-slate-200 p-5">
          <CardTitle title="Inventario de blancos" description="Vista operativa para detectar faltantes, danos, bajas y cargos sugeridos." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Categoria</th>
                <th className="px-5 py-4">Nombre</th>
                <th className="px-5 py-4">Tamano</th>
                <th className="px-5 py-4">Departamento / ubicacion</th>
                <th className="px-5 py-4">Esperada</th>
                <th className="px-5 py-4">Actual</th>
                <th className="px-5 py-4">Estado</th>
                <th className="px-5 py-4">Costo unitario</th>
                <th className="px-5 py-4">Reposicion</th>
                <th className="px-5 py-4">Cargo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {linenControlItems.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="px-5 py-4 font-bold text-ink">{item.categoria}</td>
                  <td className="px-5 py-4 text-slate-700">
                    <p className="font-semibold">{item.nombre}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.marca} - {item.color}</p>
                  </td>
                  <td className="px-5 py-4 capitalize text-slate-600">{item.tamano}</td>
                  <td className="px-5 py-4 text-slate-600">
                    <p className="font-semibold">{item.propertyName ?? item.ubicacion}</p>
                    <p className="mt-1 text-xs">{item.ubicacion}</p>
                  </td>
                  <td className="px-5 py-4 font-bold">{item.cantidadEsperada}</td>
                  <td className="px-5 py-4 font-bold">{item.cantidadActual}</td>
                  <td className="px-5 py-4"><StatusBadge status={item.estado} /></td>
                  <td className="px-5 py-4 font-semibold">{money.format(item.costoUnitario)}</td>
                  <td className="px-5 py-4">
                    <span className={item.requiereReposicion ? "font-bold text-red-700" : "font-semibold text-emerald-700"}>
                      {item.requiereReposicion ? "Si" : "No"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={item.sugerirCargoHuesped ? "font-bold text-clay" : "font-semibold text-slate-500"}>
                      {item.sugerirCargoHuesped ? money.format(item.costoCargoSugerido) : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <section className="mt-6">
        <h2 className="text-2xl font-bold text-ink">Vista por departamento</h2>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {linenDepartmentSummaries.map((summary) => (
            <Card key={summary.propertyId}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-sea">2 camas queen - 2 banos - 4 a 6 huespedes</p>
                  <h3 className="mt-1 text-xl font-bold text-ink">{summary.propertyName}</h3>
                </div>
                <p className="rounded-md bg-mist px-3 py-2 text-sm font-bold text-pine">
                  {money.format(summary.costoEstimado)}
                </p>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MiniMetric label="Asignados" value={summary.totalAsignado} />
                <MiniMetric label="Completos" value={summary.completos} />
                <MiniMetric label="Faltantes" value={summary.faltantes} />
                <MiniMetric label="Manchados" value={summary.manchados} />
                <MiniMetric label="Danados" value={summary.danados} />
                <MiniMetric label="Lavanderia" value={summary.enLavanderia} />
                <MiniMetric label="Reposicion" value={summary.reposicionSugerida} />
                <MiniMetric label="Costo" value={money.format(summary.costoEstimado)} />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

function MiniMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-ink">{value}</p>
    </div>
  );
}
