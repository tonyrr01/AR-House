import { MaintenancePriorityBadge, MaintenanceStatusBadge } from "@/components/maintenance/maintenance-badges";
import type { MaintenanceAssetTicket } from "@/types";

export function MaintenanceTicketTable({ tickets }: { tickets: MaintenanceAssetTicket[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-4">Ticket</th>
            <th className="px-5 py-4">Departamento</th>
            <th className="px-5 py-4">Categoria</th>
            <th className="px-5 py-4">Prioridad</th>
            <th className="px-5 py-4">Estado</th>
            <th className="px-5 py-4">Tecnico</th>
            <th className="px-5 py-4">Costo</th>
            <th className="px-5 py-4">Cargo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td className="px-5 py-4">
                <p className="font-bold text-ink">{ticket.title}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{ticket.id} · {ticket.sourceModule}</p>
              </td>
              <td className="px-5 py-4 font-semibold text-slate-700">{ticket.propertyName}</td>
              <td className="px-5 py-4 text-slate-600">{ticket.category}</td>
              <td className="px-5 py-4"><MaintenancePriorityBadge priority={ticket.priority} /></td>
              <td className="px-5 py-4"><MaintenanceStatusBadge status={ticket.status} /></td>
              <td className="px-5 py-4 text-slate-600">{ticket.assignedTechnicianName ?? ticket.assignedSpecialty}</td>
              <td className="px-5 py-4 font-bold">${ticket.estimatedCost}</td>
              <td className="px-5 py-4 font-semibold">{ticket.suggestedChargeToGuest ? "Huesped" : ticket.chargeTo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
