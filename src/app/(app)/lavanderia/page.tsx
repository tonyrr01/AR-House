import { ArrowRight, ClipboardList } from "lucide-react";
import { LaundryBatchTable } from "@/components/laundry/laundry-batch-table";
import { LaundryCapacityCard } from "@/components/laundry/laundry-capacity-card";
import { LaundryCostSummary } from "@/components/laundry/laundry-cost-summary";
import { LaundryDashboardCards } from "@/components/laundry/laundry-dashboard-cards";
import { LaundryInspectionPanel } from "@/components/laundry/laundry-inspection-panel";
import { LaundryProcessKanban } from "@/components/laundry/laundry-process-kanban";
import { LaundryReceptionForm } from "@/components/laundry/laundry-reception-form";
import { LaundryStatusBadge } from "@/components/laundry/laundry-status-badge";
import { LaundryWarehouseSummary } from "@/components/laundry/laundry-warehouse-summary";
import { LinenKitBuilder } from "@/components/laundry/linen-kit-builder";
import { LinenKitCard } from "@/components/laundry/linen-kit-card";
import { PageHeader } from "@/components/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  apartments as demoApartments,
  cleanings as demoCleanings,
  laundryBatchItems,
  laundryBatches as demoLaundryBatches,
  laundryCapacities,
  laundryCosts,
  laundryMovements as demoLaundryMovements,
  laundryRooms,
  linenControlItems,
  linenKits,
  warehouseStockItems
} from "@/lib/demo-data";
import {
  getLaundryBatches,
  getLaundryMovements,
  getLaundryReferenceData
} from "@/lib/laundry/supabase-laundry";
import { createClient } from "@/lib/supabase/server";
import type { Cleaning } from "@/types";

const nav = [
  ["Dashboard", "#dashboard"],
  ["Recepcion", "#recepcion"],
  ["Proceso", "#proceso"],
  ["Inspeccion", "#inspeccion"],
  ["Bodega", "#bodega"],
  ["Kits", "#kits"],
  ["Bajas", "#bajas"],
  ["Costos", "#costos"],
  ["Capacidad", "#capacidad"]
];

const currentCost = laundryCosts[0];
const currentCapacity = laundryCapacities[1];
const retiredItems = laundryBatchItems.filter((item) => item.cantidadBaja > 0 || item.estado === "Baja" || item.estado === "Manchado no recuperable");

export default async function LaundryPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const statusMessage = params.status === "created"
    ? "Lote creado en Supabase."
    : params.status === "moved"
      ? "Lote movido y registrado en historial."
      : null;
  const errorMessage = params.error
    ? "No se pudo guardar en Supabase. Revisa que haya sesion activa y permisos para este rol."
    : null;

  let realLaundryBatches: typeof demoLaundryBatches = [];
  let realLaundryMovements: typeof demoLaundryMovements = [];
  let referenceApartments = demoApartments.map(({ id, name, code, address }) => ({ id, name, code, address }));
  let referenceCleanings: Pick<Cleaning, "id" | "apartmentId" | "scheduledDate" | "status" | "cleaningType">[] = demoCleanings.map(({ id, apartmentId, scheduledDate, status, cleaningType }) => ({
    id,
    apartmentId,
    scheduledDate,
    status,
    cleaningType: cleaningType ?? "checkout"
  }));

  try {
    const supabase = await createClient();
    const [batches, movements, references] = await Promise.all([
      getLaundryBatches(supabase),
      getLaundryMovements(supabase),
      getLaundryReferenceData(supabase)
    ]);

    realLaundryBatches = batches;
    realLaundryMovements = movements;
    if (references.apartments.length) referenceApartments = references.apartments;
    if (references.cleanings.length) referenceCleanings = references.cleanings;
  } catch {
    // The MVP keeps demo data visible when Supabase is not available.
  }

  const laundryBatches = realLaundryBatches.length ? realLaundryBatches : demoLaundryBatches;
  const laundryMovements = realLaundryMovements.length ? realLaundryMovements : demoLaundryMovements;
  const isConnectedToSupabase = realLaundryBatches.length > 0 || referenceApartments.some((apartment) => !apartment.id.startsWith("apt-"));

  return (
    <>
      <PageHeader
        title="Lavanderia y Bodega"
        description="Operacion de blancos sucios, lavanderia interna, bodega limpia, kits, bajas, costos y capacidad."
        action={<ButtonLink href="/blancos" variant="secondary">Ver Blancos</ButtonLink>}
      />

      {statusMessage ? (
        <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
          {statusMessage}
        </div>
      ) : null}
      {errorMessage ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">
          {errorMessage}
        </div>
      ) : null}

      <nav className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {nav.map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="tap-target shrink-0 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-mist hover:text-pine"
          >
            {label}
          </a>
        ))}
      </nav>

      <section id="dashboard">
        <LaundryDashboardCards
          batches={laundryBatches}
          kits={linenKits}
          stock={warehouseStockItems}
          cost={currentCost}
          capacity={currentCapacity}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card>
          <CardTitle
            title="Flujo separado sucio / limpio"
            description="El flujo evita mezclar blancos sucios con bodega limpia y kits listos."
          />
          <div className="grid gap-3 text-sm font-bold text-slate-700 sm:grid-cols-2 xl:grid-cols-4">
            {[
              "Unidad/departamento",
              "Recepcion lavanderia",
              "Pesaje y conteo",
              "Clasificacion",
              "Pretratamiento",
              "Lavado",
              "Secado",
              "Inspeccion",
              "Doblado",
              "Bodega limpia",
              "Armado de kits",
              "Entregado a unidad"
            ].map((step, index, list) => (
              <div key={step} className="flex items-center gap-3 rounded-md bg-slate-50 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-pine text-xs text-white">{index + 1}</span>
                <span>{step}</span>
                {index < list.length - 1 ? <ArrowRight className="ml-auto hidden h-4 w-4 text-slate-400 xl:block" /> : null}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle title="Escala operativa" description="Datos mock preparados para operar 50 habitaciones y crecer." />
          <div className="grid gap-3">
            <Metric label="Habitaciones iniciales" value={laundryRooms.length} />
            <Metric label="Objetivo siguiente" value="80-100" />
            <Metric label="Futuro" value="150 habitaciones" />
            <Metric label="Kg objetivo diario" value="250-300 kg" />
          </div>
        </Card>
      </section>

      <section id="recepcion" className="mt-6">
        <LaundryReceptionForm
          apartments={referenceApartments}
          cleanings={referenceCleanings}
          isConnectedToSupabase={isConnectedToSupabase}
        />
      </section>

      <section className="mt-6">
        <Card className="p-0">
          <div className="border-b border-slate-200 p-5">
            <CardTitle title="Lotes de lavanderia" description="Recepcion, peso, piezas, fotos y estado actual." />
          </div>
          <LaundryBatchTable batches={laundryBatches} />
        </Card>
      </section>

      <section className="mt-6">
        <Card>
          <CardTitle title="Movimientos recientes" description="Trazabilidad mock de origen, destino, responsable y cambio de estado." />
          <div className="grid gap-3">
            {laundryMovements.map((movement) => (
              <div key={movement.id} className="grid gap-3 rounded-md bg-slate-50 p-4 lg:grid-cols-[1fr_180px_180px] lg:items-center">
                <div>
                  <p className="text-sm font-bold text-sea">{movement.batchId}</p>
                  <p className="mt-1 font-semibold text-ink">
                    {movement.origen} - {movement.destino}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{movement.observaciones ?? "Sin observaciones"}</p>
                </div>
                <LaundryStatusBadge status={movement.estadoNuevo} />
                <div className="text-sm font-semibold text-slate-600">
                  <p>{movement.responsable}</p>
                  <p>{movement.fecha.slice(0, 10)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section id="proceso" className="mt-6">
        <Card>
          <CardTitle title="Proceso tipo kanban" description="Mueve lotes por clasificacion, lavado, secado, inspeccion, bodega u observados." />
          <LaundryProcessKanban batches={laundryBatches} canMove={realLaundryBatches.length > 0} />
        </Card>
      </section>

      <section id="inspeccion" className="mt-6">
        <LaundryInspectionPanel items={laundryBatchItems} />
      </section>

      <section id="bodega" className="mt-6">
        <LaundryWarehouseSummary stock={warehouseStockItems} />
      </section>

      <section id="kits" className="mt-6 grid gap-6 xl:grid-cols-[420px_1fr]">
        <LinenKitBuilder />
        <div className="grid gap-4 lg:grid-cols-2">
          {linenKits.map((kit) => (
            <LinenKitCard key={kit.id} kit={kit} />
          ))}
        </div>
      </section>

      <section id="bajas" className="mt-6">
        <Card>
          <CardTitle title="Bajas y mermas" description="Blancos con baja, mancha no recuperable, rotura, extravio o posible cargo." />
          <div className="grid gap-4 xl:grid-cols-2">
            {retiredItems.map((item) => (
              <div key={item.id} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-sea">{item.batchId}</p>
                    <h3 className="mt-1 text-lg font-bold text-ink">{item.nombre}</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{item.observaciones ?? "Sin observaciones"}</p>
                  </div>
                  <LaundryStatusBadge status={item.estado} />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Metric label="Baja" value={item.cantidadBaja} />
                  <Metric label="Reposicion" value={`$${item.costoReposicionEstimado}`} />
                  <Metric label="Cargo huesped" value={item.sugerirCargoHuesped ? "Si" : "No"} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section id="costos" className="mt-6">
        <LaundryCostSummary cost={currentCost} />
      </section>

      <section id="capacidad" className="mt-6">
        <LaundryCapacityCard capacities={laundryCapacities} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardTitle title="Integracion con Blancos" description="Cuando un lote cambie de estado, debe actualizar el inventario de blancos." />
          <div className="grid gap-3">
            {linenControlItems.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-md bg-slate-50 p-3">
                <span className="font-semibold text-slate-700">{item.nombre}</span>
                <LaundryStatusBadge status={item.estado} />
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-md bg-mist p-3 text-sm font-semibold text-pine">
            Mock: futura funcion syncLaundryStatusToLinenInventory(batchItem) actualizara Supabase.
          </p>
        </Card>
        <Card>
          <CardTitle title="Integracion con Limpiezas" description="Al cerrar o enviar a supervision, se podra crear lote de blancos sucios." />
          <ButtonLink href="/limpiezas" className="w-full justify-center">
            <ClipboardList className="h-5 w-5" />
            Ir a limpiezas
          </ButtonLink>
          <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-600">
            Accion esperada: Enviar blancos a lavanderia crea LaundryBatch con departamento, limpieza, responsable, fecha, piezas estimadas y estado Sucio recibido.
          </p>
        </Card>
      </section>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-white p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-ink">{value}</p>
    </div>
  );
}
