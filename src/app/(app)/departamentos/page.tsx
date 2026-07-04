import { Bath, BedDouble, Building2, MapPin } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { apartments } from "@/lib/demo-data";

export default function ApartmentsPage() {
  return (
    <>
      <PageHeader
        title="Departamentos"
        description="Unidades activas para programar limpiezas, revisar inventario y conservar historial operativo."
      />
      <div className="grid gap-6">
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {apartments.map((apartment) => (
            <Card key={apartment.id} className="grid gap-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-pine text-white shadow-sm">
                    <Building2 className="h-7 w-7" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-ink">{apartment.name}</h2>
                    <p className="mt-1 flex items-start gap-1.5 text-sm font-medium text-slate-500">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                      {apartment.address}
                    </p>
                  </div>
                </div>
                <span className="rounded-md bg-mist px-3 py-1.5 text-sm font-bold text-pine">
                  {apartment.code}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <p className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-bold">
                  <BedDouble className="h-4 w-4 text-sea" />
                  {apartment.beds} camas
                </p>
                <p className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-bold">
                  <Bath className="h-4 w-4 text-sea" />
                  {apartment.baths} banos
                </p>
                <p className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold capitalize text-emerald-800">
                  {apartment.status}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <p className="rounded-md bg-slate-50 p-3 text-sm font-medium text-slate-600">
                  Desarrollo <span className="block font-bold text-ink">{apartment.developmentName}</span>
                </p>
                <p className="rounded-md bg-slate-50 p-3 text-sm font-medium text-slate-600">
                  Area <span className="block font-bold text-ink">{apartment.areaM2} m2</span>
                </p>
                <p className="rounded-md bg-slate-50 p-3 text-sm font-medium text-slate-600">
                  Mobiliario <span className="block font-bold text-ink">{apartment.furnitureType}</span>
                </p>
              </div>
              <p className="rounded-md bg-slate-50 p-3 text-sm font-medium text-slate-600">
                Propietario: <span className="font-bold text-ink">{apartment.ownerName}</span>
              </p>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-sea">Alta rapida</p>
              <h2 className="text-xl font-bold">Nueva unidad</h2>
            </div>
            <span className="rounded-md bg-mist px-3 py-1.5 text-sm font-bold text-pine">MVP</span>
          </div>
          <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Nombre">
              <Input placeholder="Roma Norte 203" className="min-h-12 py-2.5" />
            </Field>
            <Field label="Codigo interno">
              <Input placeholder="RN-203" className="min-h-12 py-2.5" />
            </Field>
            <Field label="Direccion" className="md:col-span-2">
              <Input placeholder="Calle, colonia, ciudad" className="min-h-12 py-2.5" />
            </Field>
            <Field label="Desarrollo">
              <Input placeholder="Nombre del edificio" className="min-h-12 py-2.5" />
            </Field>
            <Field label="Area m2">
              <Input type="number" min="0" placeholder="82" className="min-h-12 py-2.5" />
            </Field>
            <Field label="Mobiliario">
              <Input placeholder="Premium, ejecutivo..." className="min-h-12 py-2.5" />
            </Field>
            <Field label="Decoracion">
              <Input placeholder="Minimalista, natural..." className="min-h-12 py-2.5" />
            </Field>
            <Field label="Propietario">
              <Input placeholder="Nombre del propietario" className="min-h-12 py-2.5" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Camas">
                <Input type="number" min="0" defaultValue="1" className="min-h-12 py-2.5" />
              </Field>
              <Field label="Banos">
                <Input type="number" min="0" defaultValue="1" className="min-h-12 py-2.5" />
              </Field>
            </div>
            <Field label="Estado">
              <Select defaultValue="activo" className="min-h-12 py-2.5">
                <option value="activo">Activo</option>
                <option value="pausado">Pausado</option>
              </Select>
            </Field>
            <Button type="button" className="w-full md:col-span-2 xl:col-span-1 xl:self-end">Guardar unidad</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
