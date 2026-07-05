import { ArrowRight, ClipboardList, Wrench } from "lucide-react";
import { MaintenanceDashboardCards } from "@/components/maintenance/maintenance-dashboard-cards";
import { MaintenancePriorityBadge, SparePartStockBadge } from "@/components/maintenance/maintenance-badges";
import { MaintenanceTicketForm } from "@/components/maintenance/maintenance-ticket-form";
import { MaintenanceTicketKanban } from "@/components/maintenance/maintenance-ticket-kanban";
import { MaintenanceTicketTable } from "@/components/maintenance/maintenance-ticket-table";
import { MaintenanceCostSummary } from "@/components/maintenance/maintenance-cost-summary";
import { MaintenanceReportCard } from "@/components/maintenance/maintenance-report-card";
import { PreventiveChecklistForm } from "@/components/maintenance/preventive-checklist-form";
import { PreventiveMaintenanceCalendar } from "@/components/maintenance/preventive-maintenance-calendar";
import { SparePartsTable } from "@/components/maintenance/spare-parts-table";
import { TechnicalAssetCard } from "@/components/maintenance/technical-asset-card";
import { TechnicalAssetTable } from "@/components/maintenance/technical-asset-table";
import { TechnicianTable } from "@/components/maintenance/technician-table";
import { WorkOrderTable } from "@/components/maintenance/work-order-table";
import { PageHeader } from "@/components/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  maintenanceAssetTickets,
  maintenanceCosts,
  maintenanceDepartments,
  preventiveMaintenancePlans,
  preventiveMaintenanceVisits,
  spareParts,
  technicalAssets,
  technicians,
  workOrders
} from "@/lib/demo-data";

const nav = [
  ["Dashboard", "#dashboard"],
  ["Tickets", "#tickets"],
  ["Ordenes", "#ordenes"],
  ["Preventivos", "#preventivos"],
  ["Inventario tecnico", "#inventario-tecnico"],
  ["Refacciones", "#refacciones"],
  ["Tecnicos", "#tecnicos"],
  ["Costos", "#costos"],
  ["Reportes", "#reportes"]
];

export default function MaintenancePage() {
  const urgentTickets = maintenanceAssetTickets.filter((ticket) => ticket.priority === "Urgente");
  const criticalParts = spareParts.filter((part) => part.status === "critico" || part.stockActual <= part.stockMinimo);

  return (
    <>
      <PageHeader
        title="Mantenimiento y Activos"
        description="Operacion separada para tickets, ordenes, preventivos, activos tecnicos, refacciones, costos y reportes."
        action={<ButtonLink href="/tickets" variant="secondary">Tickets anteriores</ButtonLink>}
      />

      <nav className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {nav.map(([label, href]) => (
          <a key={href} href={href} className="tap-target shrink-0 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-mist hover:text-pine">
            {label}
          </a>
        ))}
      </nav>

      <section id="dashboard">
        <MaintenanceDashboardCards
          tickets={maintenanceAssetTickets}
          orders={workOrders}
          preventives={preventiveMaintenancePlans}
          spareParts={spareParts}
          costs={maintenanceCosts}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card>
          <CardTitle title="Tickets urgentes" description="Prioridad operativa para evitar mal review, contingencia o bloqueo del departamento." />
          <div className="grid gap-3">
            {urgentTickets.map((ticket) => (
              <div key={ticket.id} className="grid gap-3 rounded-md bg-slate-50 p-4 md:grid-cols-[1fr_150px_140px] md:items-center">
                <div>
                  <p className="text-sm font-bold text-sea">{ticket.propertyName}</p>
                  <h3 className="mt-1 font-bold text-ink">{ticket.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{ticket.observations ?? ticket.description}</p>
                </div>
                <MaintenancePriorityBadge priority={ticket.priority} />
                <span className="text-sm font-bold text-slate-600">{ticket.dueDate}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle title="Refacciones criticas" description="Alertas para no detener ordenes por falta de material." />
          <div className="grid gap-3">
            {criticalParts.slice(0, 5).map((part) => (
              <div key={part.id} className="flex items-center justify-between gap-3 rounded-md bg-slate-50 p-3">
                <div>
                  <p className="font-bold text-ink">{part.name}</p>
                  <p className="text-sm font-semibold text-slate-500">{part.stockActual} disponibles · minimo {part.stockMinimo}</p>
                </div>
                <SparePartStockBadge part={part} />
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-6">
        <Card>
          <CardTitle title="Flujo operativo" description="Del hallazgo a cierre con evidencia, costo y responsable de pago." />
          <div className="grid gap-3 text-sm font-bold text-slate-700 sm:grid-cols-2 xl:grid-cols-5">
            {["Crear ticket", "Revision supervisor", "Orden de trabajo", "Diagnostico tecnico", "Materiales/refacciones", "Reparacion", "Evidencia final", "Supervision", "Costo", "Cierre"].map((step, index, list) => (
              <div key={step} className="flex items-center gap-3 rounded-md bg-slate-50 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-pine text-xs text-white">{index + 1}</span>
                <span>{step}</span>
                {index < list.length - 1 ? <ArrowRight className="ml-auto hidden h-4 w-4 text-slate-400 xl:block" /> : null}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section id="tickets" className="mt-6 grid gap-6 xl:grid-cols-[420px_1fr]">
        <MaintenanceTicketForm />
        <Card className="p-0">
          <div className="border-b border-slate-200 p-5">
            <CardTitle title="Tickets" description="Tabla con filtros mock por departamento, categoria, prioridad, estado y tecnico." />
          </div>
          <MaintenanceTicketTable tickets={maintenanceAssetTickets} />
        </Card>
      </section>

      <section className="mt-6">
        <Card>
          <CardTitle title="Kanban de tickets" description="Vista para supervisor y tecnicos en tablet." />
          <MaintenanceTicketKanban tickets={maintenanceAssetTickets} />
        </Card>
      </section>

      <section id="ordenes" className="mt-6">
        <Card>
          <CardTitle title="Ordenes de trabajo" description="Asignacion, diagnostico, materiales, costos, fotos y aprobacion." />
          <WorkOrderTable orders={workOrders} />
        </Card>
      </section>

      <section id="preventivos" className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card>
          <CardTitle title="Preventivos bimestrales" description="Cada departamento debe tener mantenimiento mayor cada 2 meses." />
          <PreventiveMaintenanceCalendar plans={preventiveMaintenancePlans} visits={preventiveMaintenanceVisits} />
        </Card>
        <PreventiveChecklistForm />
      </section>

      <section id="inventario-tecnico" className="mt-6">
        <Card className="p-0">
          <div className="border-b border-slate-200 p-5">
            <CardTitle title="Inventario tecnico" description="Activos, acabados, equipos, garantias, manuales y refacciones compatibles." />
          </div>
          <TechnicalAssetTable assets={technicalAssets} />
        </Card>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {technicalAssets.slice(0, 4).map((asset) => (
            <TechnicalAssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </section>

      <section id="refacciones" className="mt-6">
        <Card className="p-0">
          <div className="border-b border-slate-200 p-5">
            <CardTitle title="Refacciones y materiales" description="Stock, minimo, proveedor, ubicacion, compatibilidad y alerta de stock bajo." />
          </div>
          <SparePartsTable parts={spareParts} />
        </Card>
      </section>

      <section id="tecnicos" className="mt-6">
        <Card>
          <CardTitle title="Tecnicos" description="Catalogo por especialidad, interno/externo, tarifa, contacto y rating." />
          <TechnicianTable technicians={technicians} />
        </Card>
      </section>

      <section id="costos" className="mt-6">
        <MaintenanceCostSummary costs={maintenanceCosts} />
      </section>

      <section id="reportes" className="mt-6">
        <Card>
          <CardTitle title="Reportes" description="Resumen por departamento con tickets, preventivos, costos y proximas acciones." />
          <div className="grid gap-4 lg:grid-cols-2">
            {maintenanceDepartments.map((property) => (
              <MaintenanceReportCard
                key={property.id}
                propertyName={property.name}
                tickets={maintenanceAssetTickets}
                costs={maintenanceCosts}
                visits={preventiveMaintenanceVisits}
              />
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardTitle title="Integracion con limpieza" description="Accion preparada para crear tickets desde una limpieza." />
          <ButtonLink href="/limpiezas" variant="secondary" className="w-full justify-center">
            <ClipboardList className="h-5 w-5" />
            Crear ticket desde limpieza
          </ButtonLink>
        </Card>
        <Card>
          <CardTitle title="Integracion con danos y faltantes" description="Daños de equipo, instalaciones, pintura, piso, carpinteria, plomeria o electricidad pueden enviarse a mantenimiento." />
          <ButtonLink href="/danos-faltantes" className="w-full justify-center">
            <Wrench className="h-5 w-5" />
            Enviar dano a mantenimiento
          </ButtonLink>
        </Card>
      </section>
    </>
  );
}
