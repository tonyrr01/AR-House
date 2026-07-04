import { Camera, ClipboardCheck, Clock3, Hotel, Play } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Cleaning } from "@/types";

export function CleaningCard({ cleaning }: { cleaning: Cleaning }) {
  const actionLabel = cleaning.status === "pendiente" ? "Iniciar limpieza" : "Continuar";

  return (
    <Card className="grid gap-5 overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-pine text-white shadow-sm">
            <Hotel className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-ink">{cleaning.apartmentName}</h3>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
              <Clock3 className="h-4 w-4" />
              {cleaning.scheduledDate} · salida {cleaning.checkOutTime} · entrada {cleaning.checkInTime}
            </p>
          </div>
        </div>
        <StatusBadge status={cleaning.status} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Responsable</p>
          <p className="mt-1 text-lg font-bold text-ink">{cleaning.assignedTo}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Evidencia</p>
          <p className="mt-1 text-lg font-bold text-ink">
            {cleaning.receivedPhotos + cleaning.finalPhotos} fotos
          </p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Avance</p>
          <p className="mt-1 text-lg font-bold text-ink">{cleaning.progress}%</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <p className="rounded-md bg-mist p-3 text-sm font-semibold text-pine">
          Tipo: <span className="capitalize text-ink">{cleaning.cleaningType ?? "regular"}</span>
        </p>
        <p className="rounded-md bg-mist p-3 text-sm font-semibold text-pine">
          Supervisor: <span className="text-ink">{cleaning.supervisorName ?? "Sin asignar"}</span>
        </p>
        <p className="rounded-md bg-mist p-3 text-sm font-semibold text-pine">
          Blancos: <span className="text-ink">{cleaning.linenReplacementNotes ?? "Sin nota"}</span>
        </p>
      </div>
      <div className="h-3 rounded-full bg-slate-100">
        <div className="h-3 rounded-full bg-sea" style={{ width: `${cleaning.progress}%` }} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <ButtonLink href={`/limpiezas/${cleaning.id}`} className="w-full">
          <Play className="h-5 w-5" />
          {actionLabel}
        </ButtonLink>
        <ButtonLink href="/checklist" variant="secondary" className="w-full">
          <ClipboardCheck className="h-5 w-5" />
          Checklist
        </ButtonLink>
        <ButtonLink href="/danos-faltantes" variant="secondary" className="w-full">
          <Camera className="h-5 w-5" />
          Reportar
        </ButtonLink>
      </div>
    </Card>
  );
}
