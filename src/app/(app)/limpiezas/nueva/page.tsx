import { CalendarDays, ClipboardList, Shirt, TriangleAlert, UserRound } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { apartments, linenControlItems } from "@/lib/demo-data";

const quickLinenItems = [
  "Toallas de bano",
  "Toallas de mano",
  "Tapetes de bano",
  "Sabanas",
  "Fundas",
  "Almohadas",
  "Protectores",
  "Toallas de playa/alberca"
];

const linenIssues = linenControlItems.filter((item) => item.requiereReposicion || item.sugerirCargoHuesped);

export default function NewCleaningPage() {
  return (
    <>
      <PageHeader
        title="Nueva limpieza"
        description="Programa una limpieza en tres pasos simples para dejarla lista para el equipo."
      />
      <form className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          <Card>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-pine text-white">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-sea">Paso 1</p>
                <h2 className="text-xl font-bold">Selecciona la unidad</h2>
              </div>
            </div>
            <Field label="Departamento">
              <Select>
                {apartments.map((apartment) => (
                  <option key={apartment.id} value={apartment.id}>
                    {apartment.name}
                  </option>
                ))}
              </Select>
            </Field>
          </Card>

          <Card>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-sea text-white">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-sea">Paso 2</p>
                <h2 className="text-xl font-bold">Define horario</h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Fecha">
                <Input type="date" defaultValue="2026-06-29" />
              </Field>
              <Field label="Salida">
                <Input type="time" defaultValue="11:00" />
              </Field>
              <Field label="Entrada">
                <Input type="time" defaultValue="15:00" />
              </Field>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Tipo de limpieza">
                <Select defaultValue="checkout">
                  <option value="checkout">Checkout</option>
                  <option value="profunda">Profunda</option>
                  <option value="retoque">Retoque</option>
                </Select>
              </Field>
              <Field label="Blancos a sustituir">
                <Input placeholder="Toallas, sabanas, fundas..." />
              </Field>
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-ink text-white">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-sea">Paso 3</p>
                <h2 className="text-xl font-bold">Asigna responsable</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Asignar a">
                <Select defaultValue="Ana Lopez">
                  <option>Ana Lopez</option>
                  <option>Brenda Cruz</option>
                  <option>Carlos Mena</option>
                </Select>
              </Field>
              <Field label="Supervisor">
                <Select defaultValue="Laura Vega">
                  <option>Laura Vega</option>
                  <option>Supervisor guardia</option>
                </Select>
              </Field>
              <Field label="Notas breves">
                <Input placeholder="Ej. amenidades extra" />
              </Field>
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-clay text-white">
                <Shirt className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-sea">Paso 4</p>
                <h2 className="text-xl font-bold">Blancos</h2>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {quickLinenItems.map((item) => (
                <label key={item} className="flex min-h-14 items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold text-ink">
                  <input type="checkbox" className="h-5 w-5 accent-pine" defaultChecked />
                  {item}
                </label>
              ))}
            </div>
            <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4">
              <div className="flex gap-3">
                <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <p className="font-bold text-amber-900">Si hay faltante, mancha o dano</p>
                  <p className="mt-1 text-sm font-semibold text-amber-800">
                    Registra foto y sugiere dano/faltante relacionado con esta limpieza. El cargo al huesped queda para supervision.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="h-fit">
          <h2 className="text-xl font-bold">Resumen</h2>
          <div className="mt-5 grid gap-3 text-sm font-medium text-slate-600">
            <p className="rounded-md bg-slate-50 p-3">Unidad, horario y responsable quedan listos para operar.</p>
            <p className="rounded-md bg-slate-50 p-3">El equipo vera esta limpieza en pendientes.</p>
            <p className="rounded-md bg-slate-50 p-3">
              Blancos con reposicion o cargo sugerido: <span className="font-bold text-clay">{linenIssues.length}</span>
            </p>
          </div>
          <Button type="button" className="mt-5 w-full">Crear limpieza</Button>
        </Card>
      </form>
    </>
  );
}
