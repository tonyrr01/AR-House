import type { LucideIcon } from "lucide-react";
import { AlertTriangle, CalendarClock, CircleDollarSign, Clock, PackageSearch, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { MaintenanceAssetTicket, MaintenanceCost, PreventiveMaintenancePlan, SparePart, WorkOrder } from "@/types";

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

export function MaintenanceDashboardCards({
  tickets,
  orders,
  preventives,
  spareParts,
  costs
}: {
  tickets: MaintenanceAssetTicket[];
  orders: WorkOrder[];
  preventives: PreventiveMaintenancePlan[];
  spareParts: SparePart[];
  costs: MaintenanceCost[];
}) {
  const openTickets = tickets.filter((ticket) => !["Cerrado", "Cancelado"].includes(ticket.status));
  const executedMonth = costs.reduce((sum, cost) => sum + cost.totalCost, 0);
  const guestCharges = tickets.filter((ticket) => ticket.suggestedChargeToGuest).reduce((sum, ticket) => sum + ticket.estimatedCost, 0);
  const cards: Array<{ label: string; value: string | number; icon: LucideIcon; tone: string }> = [
    { label: "Tickets abiertos", value: openTickets.length, icon: Wrench, tone: "bg-pine text-white" },
    { label: "Tickets urgentes", value: tickets.filter((ticket) => ticket.priority === "Urgente").length, icon: AlertTriangle, tone: "bg-red-100 text-red-800" },
    { label: "En proceso", value: tickets.filter((ticket) => ticket.status === "En proceso").length, icon: Wrench, tone: "bg-blue-100 text-blue-800" },
    { label: "Espera material", value: tickets.filter((ticket) => ticket.status === "En espera de material").length, icon: PackageSearch, tone: "bg-orange-100 text-orange-800" },
    { label: "Ordenes hoy", value: orders.filter((order) => order.scheduledDate === "2026-07-05").length, icon: CalendarClock, tone: "bg-mist text-pine" },
    { label: "Preventivos proximos", value: preventives.filter((plan) => plan.status === "vigente").length, icon: CalendarClock, tone: "bg-emerald-100 text-emerald-800" },
    { label: "Preventivos vencidos", value: preventives.filter((plan) => plan.status === "vencido").length, icon: AlertTriangle, tone: "bg-red-100 text-red-800" },
    { label: "Costo abierto", value: money.format(openTickets.reduce((sum, ticket) => sum + ticket.estimatedCost, 0)), icon: CircleDollarSign, tone: "bg-clay text-white" },
    { label: "Ejecutado mes", value: money.format(executedMonth), icon: CircleDollarSign, tone: "bg-clay text-white" },
    { label: "Cargos huesped", value: money.format(guestCharges), icon: CircleDollarSign, tone: "bg-amber-100 text-amber-800" },
    { label: "Stock critico", value: spareParts.filter((part) => part.status === "critico").length, icon: PackageSearch, tone: "bg-red-100 text-red-800" },
    { label: "Promedio cierre", value: "36 h", icon: Clock, tone: "bg-slate-100 text-slate-800" }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="p-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${card.tone}`}>
              <card.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-ink">{card.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
