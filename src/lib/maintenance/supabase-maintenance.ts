import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Apartment,
  MaintenanceAssetTicket,
  MaintenancePriority,
  MaintenanceTicketStatus,
  TechnicianSpecialty
} from "@/types";

export const maintenancePriorityToDb: Record<MaintenancePriority, string> = {
  Urgente: "urgente",
  Alta: "alta",
  Media: "media",
  Baja: "baja",
  Preventiva: "preventiva"
};

export const maintenancePriorityFromDb: Record<string, MaintenancePriority> = {
  urgente: "Urgente",
  alta: "Alta",
  media: "Media",
  baja: "Baja",
  preventiva: "Preventiva"
};

export const maintenanceStatusFromDb: Record<string, MaintenanceTicketStatus> = {
  abierto: "Abierto",
  en_revision: "En revision",
  diagnostico: "Diagnostico",
  cotizacion: "Cotizacion",
  aprobado: "Aprobado",
  asignado: "Asignado",
  en_proceso: "En proceso",
  en_espera_de_material: "En espera de material",
  terminado: "Terminado",
  supervision: "Supervision",
  cerrado: "Cerrado",
  cancelado: "Cancelado"
};

type DbMaintenanceTicket = {
  id: string;
  apartment_id: string;
  cleaning_id: string | null;
  damage_report_id: string | null;
  source_module: string;
  source_id: string | null;
  title: string;
  description: string;
  issue_type: string;
  category: string;
  priority: string;
  status: string;
  area: string;
  reported_at: string;
  estimated_cost: number | string;
  final_cost: number | string;
  suggested_charge_to_guest: boolean;
  charge_to: string;
  business_unit: string;
  due_date: string | null;
  assigned_specialty: string | null;
  observations: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function getMaintenanceReferenceData(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("apartments")
    .select("id,name,code,address")
    .order("name");

  const apartments: Pick<Apartment, "id" | "name" | "code" | "address">[] = (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    code: row.code,
    address: row.address
  }));

  return { apartments };
}

export async function getMaintenanceTickets(supabase: SupabaseClient): Promise<MaintenanceAssetTicket[]> {
  const { data, error } = await supabase
    .from("maintenance_asset_tickets")
    .select(
      "id,apartment_id,cleaning_id,damage_report_id,source_module,source_id,title,description,issue_type,category,priority,status,area,reported_at,estimated_cost,final_cost,suggested_charge_to_guest,charge_to,business_unit,due_date,assigned_specialty,observations,closed_at,created_at,updated_at"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data?.length) return [];

  const apartmentIds = [...new Set(data.map((ticket: DbMaintenanceTicket) => ticket.apartment_id))];
  const { data: apartments } = await supabase.from("apartments").select("id,name").in("id", apartmentIds);
  const apartmentNames = new Map((apartments ?? []).map((apartment) => [apartment.id, apartment.name]));

  return (data as DbMaintenanceTicket[]).map((ticket) => ({
    id: ticket.id,
    propertyId: ticket.apartment_id,
    propertyName: apartmentNames.get(ticket.apartment_id) ?? "Departamento",
    sourceModule: ticket.source_module as MaintenanceAssetTicket["sourceModule"],
    sourceId: ticket.source_id ?? ticket.cleaning_id ?? ticket.damage_report_id ?? undefined,
    title: ticket.title,
    description: ticket.description,
    issueType: ticket.issue_type as MaintenanceAssetTicket["issueType"],
    category: ticket.category as MaintenanceAssetTicket["category"],
    priority: maintenancePriorityFromDb[ticket.priority] ?? "Media",
    status: maintenanceStatusFromDb[ticket.status] ?? "Abierto",
    area: ticket.area as MaintenanceAssetTicket["area"],
    reportedBy: "Equipo operativo",
    reportedAt: ticket.reported_at,
    photosBefore: 0,
    estimatedCost: Number(ticket.estimated_cost),
    finalCost: Number(ticket.final_cost),
    suggestedChargeToGuest: ticket.suggested_charge_to_guest,
    chargeTo: ticket.charge_to as MaintenanceAssetTicket["chargeTo"],
    businessUnit: ticket.business_unit as MaintenanceAssetTicket["businessUnit"],
    dueDate: ticket.due_date ?? undefined,
    assignedSpecialty: (ticket.assigned_specialty ?? "Tecnico general") as TechnicianSpecialty,
    createdAt: ticket.created_at,
    updatedAt: ticket.updated_at,
    closedAt: ticket.closed_at ?? undefined,
    observations: ticket.observations ?? undefined
  }));
}
