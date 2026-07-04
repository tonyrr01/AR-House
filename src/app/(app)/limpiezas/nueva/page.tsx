import { CalendarDays, ClipboardList, UserRound } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { apartments } from "@/lib/demo-data";

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
        </div>

        <Card className="h-fit">
          <h2 className="text-xl font-bold">Resumen</h2>
          <div className="mt-5 grid gap-3 text-sm font-medium text-slate-600">
            <p className="rounded-md bg-slate-50 p-3">Unidad, horario y responsable quedan listos para operar.</p>
            <p className="rounded-md bg-slate-50 p-3">El equipo vera esta limpieza en pendientes.</p>
          </div>
          <Button type="button" className="mt-5 w-full">Crear limpieza</Button>
        </Card>
      </form>
    </>
  );
}
