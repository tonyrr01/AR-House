import { Camera, ClipboardCheck, Download, FileCheck2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { report } from "@/lib/demo-data";

export default function CleaningReportPage() {
  return (
    <>
      <PageHeader
        title="Reporte de limpieza"
        description="Resumen claro para supervision, propietarios y administradores."
        action={
          <Button type="button" variant="secondary">
            <Download className="h-5 w-5" />
            Exportar PDF
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-5">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-pine text-white">
                  <FileCheck2 className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-sea">Limpieza {report.cleaning.id}</p>
                  <h2 className="text-2xl font-bold text-ink">{report.cleaning.apartmentName}</h2>
                  <p className="mt-1 text-base text-slate-600">
                  Responsable: {report.cleaning.assignedTo} · Fecha: {report.cleaning.scheduledDate}
                  </p>
                </div>
              </div>
              <StatusBadge status={report.cleaning.status} />
            </div>
          </Card>

          <Card>
            <CardTitle title="Danos y faltantes" />
            <div className="grid gap-3">
              {report.damages.map((damage) => (
                <div key={damage.id} className="rounded-md border border-slate-200 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold">{damage.title}</p>
                    <PriorityBadge priority={damage.priority} />
                  </div>
                  <p className="mt-1 text-base text-slate-600">{damage.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle title="Tickets relacionados" />
            {report.tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-md border border-slate-200 p-3">
                <p className="font-bold">{ticket.title}</p>
                <p className="mt-1 text-base text-slate-600">{ticket.description}</p>
              </div>
            ))}
          </Card>
        </div>

        <Card className="h-fit">
          <CardTitle title="Resumen" />
          <div className="grid gap-3">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <ClipboardCheck className="mb-3 h-6 w-6 text-sea" />
              <p className="text-sm font-bold text-slate-500">Checklist</p>
              <p className="text-3xl font-bold">
                {report.checklistCompleted}/{report.checklistTotal}
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-500">Inventario</p>
              <p className="text-3xl font-bold">{report.inventoryIssues}</p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <Camera className="mb-3 h-6 w-6 text-sea" />
              <p className="text-sm font-bold text-slate-500">Fotos</p>
              <p className="text-3xl font-bold">
                {report.cleaning.receivedPhotos + report.cleaning.finalPhotos}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
