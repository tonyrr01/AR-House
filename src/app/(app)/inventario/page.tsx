import { AlertCircle, PackageCheck, Shirt } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { apartments, inventoryItems, linenItems } from "@/lib/demo-data";

export default function InventoryPage() {
  return (
    <>
      <PageHeader
        title="Inventario"
        description="Revision tactil de blancos, utensilios y articulos criticos por unidad."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-6">
          <Card>
            <h2 className="mb-5 flex items-center gap-3 text-xl font-bold">
              <PackageCheck className="h-5 w-5 text-sea" />
              Articulos generales
            </h2>
            <div className="grid gap-4">
            {inventoryItems.map((item) => (
              <div
                key={item.id}
                className="grid gap-4 rounded-md border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_auto_auto_auto]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white text-sea">
                    <PackageCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-ink">{item.name}</p>
                    <p className="text-sm font-medium text-slate-500">
                      {item.category} · {item.supplier ?? "Sin proveedor"}
                    </p>
                  </div>
                </div>
                <p className="rounded-md bg-white px-4 py-3 text-sm font-bold">
                  Esperado {item.expectedQuantity}
                </p>
                <p className="rounded-md bg-white px-4 py-3 text-sm font-bold">
                  Actual {item.currentQuantity}
                </p>
                <p className="rounded-md bg-white px-4 py-3 text-sm font-bold">
                  ${item.price ?? 0}
                </p>
                <StatusBadge status={item.condition} />
              </div>
            ))}
            </div>
          </Card>

          <Card>
            <h2 className="mb-5 flex items-center gap-3 text-xl font-bold">
              <Shirt className="h-5 w-5 text-sea" />
              Blancos
            </h2>
            <div className="grid gap-4">
              {linenItems.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-4 rounded-md border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_auto_auto_auto]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white text-sea">
                      <Shirt className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-ink">{item.itemType}</p>
                      <p className="text-sm font-medium text-slate-500">
                        {item.model ?? "Sin modelo"} · {item.size ?? "Sin talla"} · {item.color ?? "Sin color"}
                      </p>
                    </div>
                  </div>
                  <p className="rounded-md bg-white px-4 py-3 text-sm font-bold">
                    Esperado {item.expectedQuantity}
                  </p>
                  <p className="rounded-md bg-white px-4 py-3 text-sm font-bold">
                    Actual {item.currentQuantity}
                  </p>
                  <p className="rounded-md bg-white px-4 py-3 text-sm font-bold">
                    ${item.unitCost ?? 0}
                  </p>
                  <StatusBadge status={item.condition} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="mb-5 flex items-center gap-3 text-xl font-bold">
            <AlertCircle className="h-5 w-5 text-sea" />
            Registrar revision
          </h2>
          <form className="grid gap-5">
            <Field label="Departamento">
              <Select>
                {apartments.map((apartment) => (
                  <option key={apartment.id}>{apartment.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Articulo">
              <Input placeholder="Ej. Toallas grandes" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Esperado">
                <Input type="number" min="0" />
              </Field>
              <Field label="Actual">
                <Input type="number" min="0" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Precio">
                <Input type="number" min="0" />
              </Field>
              <Field label="Proveedor">
                <Input placeholder="Proveedor" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ingreso">
                <Input type="date" />
              </Field>
              <Field label="Salida">
                <Input type="date" />
              </Field>
            </div>
            <Field label="Estado">
              <Select defaultValue="ok">
                <option value="ok">OK</option>
                <option value="revisar">Revisar</option>
                <option value="reponer">Reponer</option>
              </Select>
            </Field>
            <Button type="button" className="w-full">Guardar revision</Button>
          </form>
        </Card>

        <Card className="xl:col-start-2">
          <h2 className="mb-5 flex items-center gap-3 text-xl font-bold">
            <Shirt className="h-5 w-5 text-sea" />
            Registrar blanco
          </h2>
          <form className="grid gap-5">
            <Field label="Departamento">
              <Select>
                {apartments.map((apartment) => (
                  <option key={apartment.id}>{apartment.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Tipo">
              <Input placeholder="Toalla, sabana, funda..." />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Talla">
                <Input placeholder="King, standard..." />
              </Field>
              <Field label="Modelo">
                <Input placeholder="300 hilos..." />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Esperado">
                <Input type="number" min="0" />
              </Field>
              <Field label="Actual">
                <Input type="number" min="0" />
              </Field>
            </div>
            <Field label="Estado">
              <Select defaultValue="ok">
                <option value="ok">OK</option>
                <option value="revisar">Revisar</option>
                <option value="reponer">Reponer</option>
                <option value="retirar">Retirar</option>
              </Select>
            </Field>
            <Button type="button" className="w-full">Guardar blanco</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
