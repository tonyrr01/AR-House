import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Apartment,
  MaintenanceCost,
  MaintenanceAssetTicket,
  MaintenancePriority,
  MaintenanceTicketStatus,
  PreventiveMaintenancePlan,
  PreventiveMaintenanceVisit,
  SparePart,
  TechnicalAsset,
  Technician,
  WorkOrder,
  WorkOrderStatus,
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

const workOrderStatusFromDb: Record<string, WorkOrderStatus> = {
  pendiente: "Pendiente",
  asignada: "Asignada",
  en_proceso: "En proceso",
  en_espera_de_material: "En espera de material",
  terminada: "Terminada",
  en_supervision: "En supervision",
  cerrada: "Cerrada",
  cancelada: "Cancelada"
};

const preventivePlanStatusFromDb: Record<string, PreventiveMaintenancePlan["status"]> = {
  vigente: "vigente",
  vencido: "vencido",
  completado: "completado"
};

const preventiveVisitStatusFromDb: Record<string, PreventiveMaintenanceVisit["status"]> = {
  programada: "programada",
  en_proceso: "en_proceso",
  completada: "completada",
  vencida: "vencida"
};

const assetStatusFromDb: Record<string, TechnicalAsset["status"]> = {
  ok: "ok",
  revisar: "revisar",
  garantia: "garantia",
  reponer: "reponer",
  fuera_servicio: "fuera_servicio"
};

const sparePartStatusFromDb: Record<string, SparePart["status"]> = {
  disponible: "disponible",
  stock_bajo: "stock_bajo",
  critico: "critico",
  descontinuado: "descontinuado"
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

type ApartmentName = {
  id: string;
  name: string;
};

async function getApartmentNames(supabase: SupabaseClient, apartmentIds: string[]) {
  if (!apartmentIds.length) return new Map<string, string>();

  const { data } = await supabase.from("apartments").select("id,name").in("id", apartmentIds);
  return new Map((data as ApartmentName[] | null ?? []).map((apartment) => [apartment.id, apartment.name]));
}

function asMoney(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

function asTextArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

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
  const apartmentNames = await getApartmentNames(supabase, apartmentIds);

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
    estimatedCost: asMoney(ticket.estimated_cost),
    finalCost: asMoney(ticket.final_cost),
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

export async function getWorkOrders(supabase: SupabaseClient): Promise<WorkOrder[]> {
  const { data, error } = await supabase
    .from("work_orders")
    .select(
      "id,ticket_id,apartment_id,title,description,assigned_technician_id,specialty,scheduled_date,start_time,end_time,status,diagnosis,work_performed,labor_cost,material_cost,total_cost,supervisor_approval,approved_at,charge_to,business_unit,observations"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data?.length) return [];

  const rows = data as Array<Record<string, unknown>>;
  const apartmentNames = await getApartmentNames(supabase, rows.map((row) => String(row.apartment_id)));
  const technicianIds = rows.map((row) => row.assigned_technician_id).filter((id): id is string => typeof id === "string");
  const { data: technicians } = technicianIds.length
    ? await supabase.from("technicians").select("id,name").in("id", technicianIds)
    : { data: [] };
  const technicianNames = new Map((technicians as Array<{ id: string; name: string }> | null ?? []).map((tech) => [tech.id, tech.name]));

  return rows.map((row) => ({
    id: String(row.id),
    ticketId: String(row.ticket_id),
    propertyId: String(row.apartment_id),
    propertyName: apartmentNames.get(String(row.apartment_id)) ?? "Departamento",
    title: String(row.title ?? "Orden de trabajo"),
    description: String(row.description ?? ""),
    assignedTechnicianId: typeof row.assigned_technician_id === "string" ? row.assigned_technician_id : undefined,
    assignedTechnicianName: typeof row.assigned_technician_id === "string" ? technicianNames.get(row.assigned_technician_id) : undefined,
    specialty: String(row.specialty ?? "Tecnico general") as TechnicianSpecialty,
    scheduledDate: String(row.scheduled_date ?? "Sin fecha"),
    startTime: typeof row.start_time === "string" ? row.start_time : undefined,
    endTime: typeof row.end_time === "string" ? row.end_time : undefined,
    status: workOrderStatusFromDb[String(row.status)] ?? "Pendiente",
    diagnosis: typeof row.diagnosis === "string" ? row.diagnosis : undefined,
    workPerformed: typeof row.work_performed === "string" ? row.work_performed : undefined,
    laborCost: asMoney(row.labor_cost as number | string | null),
    materialCost: asMoney(row.material_cost as number | string | null),
    totalCost: asMoney(row.total_cost as number | string | null),
    materialsUsed: [],
    photosBefore: 0,
    photosDuring: 0,
    photosAfter: 0,
    supervisorApproval: Boolean(row.supervisor_approval),
    approvedAt: typeof row.approved_at === "string" ? row.approved_at : undefined,
    chargeTo: String(row.charge_to ?? "operacion") as WorkOrder["chargeTo"],
    businessUnit: String(row.business_unit ?? "maintenance") as WorkOrder["businessUnit"],
    observations: typeof row.observations === "string" ? row.observations : undefined
  }));
}

export async function getPreventivePlans(supabase: SupabaseClient): Promise<PreventiveMaintenancePlan[]> {
  const { data, error } = await supabase
    .from("preventive_maintenance_plans")
    .select("id,apartment_id,frequency,next_date,last_date,status,assigned_supervisor,checklist_template_id,observations")
    .order("next_date", { ascending: true })
    .limit(100);

  if (error || !data?.length) return [];

  const rows = data as Array<Record<string, unknown>>;
  const apartmentNames = await getApartmentNames(supabase, rows.map((row) => String(row.apartment_id)));

  return rows.map((row) => ({
    id: String(row.id),
    propertyId: String(row.apartment_id),
    propertyName: apartmentNames.get(String(row.apartment_id)) ?? "Departamento",
    frequency: "bimestral",
    nextDate: String(row.next_date),
    lastDate: typeof row.last_date === "string" ? row.last_date : undefined,
    status: preventivePlanStatusFromDb[String(row.status)] ?? "vigente",
    assignedSupervisor: typeof row.assigned_supervisor === "string" ? "Supervisor asignado" : "Sin asignar",
    checklistTemplateId: String(row.checklist_template_id ?? "preventivo-bimestral"),
    observations: typeof row.observations === "string" ? row.observations : undefined
  }));
}

export async function getPreventiveVisits(supabase: SupabaseClient): Promise<PreventiveMaintenanceVisit[]> {
  const { data, error } = await supabase
    .from("preventive_maintenance_visits")
    .select("id,plan_id,apartment_id,scheduled_date,completed_date,responsible,status,checklist_results,tickets_created,photos_count,general_condition,estimated_repairs_cost,observations")
    .order("scheduled_date", { ascending: false })
    .limit(100);

  if (error || !data?.length) return [];

  const rows = data as Array<Record<string, unknown>>;
  const apartmentNames = await getApartmentNames(supabase, rows.map((row) => String(row.apartment_id)));

  return rows.map((row) => ({
    id: String(row.id),
    planId: String(row.plan_id),
    propertyId: String(row.apartment_id),
    propertyName: apartmentNames.get(String(row.apartment_id)) ?? "Departamento",
    scheduledDate: String(row.scheduled_date),
    completedDate: typeof row.completed_date === "string" ? row.completed_date : undefined,
    responsible: typeof row.responsible === "string" ? "Responsable asignado" : "Sin asignar",
    status: preventiveVisitStatusFromDb[String(row.status)] ?? "programada",
    checklistResults: Array.isArray(row.checklist_results) ? row.checklist_results as PreventiveMaintenanceVisit["checklistResults"] : [],
    ticketsCreated: Number(row.tickets_created ?? 0),
    photos: Number(row.photos_count ?? 0),
    generalCondition: String(row.general_condition ?? "buena") as PreventiveMaintenanceVisit["generalCondition"],
    estimatedRepairsCost: asMoney(row.estimated_repairs_cost as number | string | null),
    observations: typeof row.observations === "string" ? row.observations : undefined
  }));
}

export async function getTechnicalAssets(supabase: SupabaseClient): Promise<TechnicalAsset[]> {
  const { data, error } = await supabase
    .from("technical_assets")
    .select("id,apartment_id,category,area,name,brand,model,serial_number,material_type,color,finish,dimensions,supplier,purchase_date,installation_date,warranty_until,cost,replacement_cost,photo_storage_path,manual_storage_path,compatible_parts,maintenance_notes,cleaning_care_notes,status,observations")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data?.length) return [];

  const rows = data as Array<Record<string, unknown>>;
  const apartmentNames = await getApartmentNames(supabase, rows.map((row) => String(row.apartment_id)));

  return rows.map((row) => ({
    id: String(row.id),
    propertyId: String(row.apartment_id),
    propertyName: apartmentNames.get(String(row.apartment_id)) ?? "Departamento",
    category: String(row.category ?? "Activo"),
    area: String(row.area ?? "otro") as TechnicalAsset["area"],
    name: String(row.name ?? "Activo tecnico"),
    brand: typeof row.brand === "string" ? row.brand : undefined,
    model: typeof row.model === "string" ? row.model : undefined,
    serialNumber: typeof row.serial_number === "string" ? row.serial_number : undefined,
    materialType: typeof row.material_type === "string" ? row.material_type : undefined,
    color: typeof row.color === "string" ? row.color : undefined,
    finish: typeof row.finish === "string" ? row.finish : undefined,
    dimensions: typeof row.dimensions === "string" ? row.dimensions : undefined,
    supplier: typeof row.supplier === "string" ? row.supplier : undefined,
    purchaseDate: typeof row.purchase_date === "string" ? row.purchase_date : undefined,
    installationDate: typeof row.installation_date === "string" ? row.installation_date : undefined,
    warrantyUntil: typeof row.warranty_until === "string" ? row.warranty_until : undefined,
    cost: asMoney(row.cost as number | string | null),
    replacementCost: asMoney(row.replacement_cost as number | string | null),
    photoUrl: typeof row.photo_storage_path === "string" ? row.photo_storage_path : undefined,
    manualUrl: typeof row.manual_storage_path === "string" ? row.manual_storage_path : undefined,
    compatibleParts: asTextArray(row.compatible_parts),
    maintenanceNotes: typeof row.maintenance_notes === "string" ? row.maintenance_notes : undefined,
    cleaningCareNotes: typeof row.cleaning_care_notes === "string" ? row.cleaning_care_notes : undefined,
    status: assetStatusFromDb[String(row.status)] ?? "ok",
    observations: typeof row.observations === "string" ? row.observations : undefined
  }));
}

export async function getSpareParts(supabase: SupabaseClient): Promise<SparePart[]> {
  const { data, error } = await supabase
    .from("spare_parts")
    .select("id,name,category,brand,model,compatible_asset_ids,compatible_properties,stock_actual,stock_minimo,unit_cost,supplier,supplier_contact,location,photo_storage_path,lead_time_days,status,observations")
    .order("name", { ascending: true })
    .limit(100);

  if (error || !data?.length) return [];

  return (data as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id),
    name: String(row.name ?? "Refaccion"),
    category: String(row.category ?? "General"),
    brand: typeof row.brand === "string" ? row.brand : undefined,
    model: typeof row.model === "string" ? row.model : undefined,
    compatibleAssetIds: asTextArray(row.compatible_asset_ids),
    compatibleProperties: asTextArray(row.compatible_properties),
    stockActual: Number(row.stock_actual ?? 0),
    stockMinimo: Number(row.stock_minimo ?? 0),
    unitCost: asMoney(row.unit_cost as number | string | null),
    supplier: String(row.supplier ?? "Sin proveedor"),
    supplierContact: typeof row.supplier_contact === "string" ? row.supplier_contact : undefined,
    location: String(row.location ?? "Sin ubicacion"),
    photoUrl: typeof row.photo_storage_path === "string" ? row.photo_storage_path : undefined,
    leadTimeDays: Number(row.lead_time_days ?? 0),
    status: sparePartStatusFromDb[String(row.status)] ?? "disponible",
    observations: typeof row.observations === "string" ? row.observations : undefined
  }));
}

export async function getTechnicians(supabase: SupabaseClient): Promise<Technician[]> {
  const { data, error } = await supabase
    .from("technicians")
    .select("id,name,specialty,phone,email,internal_or_external,hourly_rate,active,rating,notes")
    .order("name", { ascending: true })
    .limit(100);

  if (error || !data?.length) return [];

  return (data as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id),
    name: String(row.name ?? "Tecnico"),
    specialty: String(row.specialty ?? "Tecnico general") as TechnicianSpecialty,
    phone: String(row.phone ?? "Sin telefono"),
    email: String(row.email ?? "Sin correo"),
    internalOrExternal: String(row.internal_or_external ?? "externo") as Technician["internalOrExternal"],
    hourlyRate: asMoney(row.hourly_rate as number | string | null),
    active: Boolean(row.active ?? true),
    rating: Number(row.rating ?? 5),
    notes: typeof row.notes === "string" ? row.notes : undefined
  }));
}

export async function getMaintenanceCosts(supabase: SupabaseClient): Promise<MaintenanceCost[]> {
  const { data, error } = await supabase
    .from("maintenance_costs")
    .select("id,ticket_id,work_order_id,apartment_id,cost_date,labor_cost,material_cost,spare_parts_cost,external_service_cost,total_cost,charge_to,business_unit,notes")
    .order("cost_date", { ascending: false })
    .limit(100);

  if (error || !data?.length) return [];

  const rows = data as Array<Record<string, unknown>>;
  const apartmentNames = await getApartmentNames(supabase, rows.map((row) => String(row.apartment_id)));

  return rows.map((row) => ({
    id: String(row.id),
    ticketId: typeof row.ticket_id === "string" ? row.ticket_id : undefined,
    workOrderId: typeof row.work_order_id === "string" ? row.work_order_id : undefined,
    propertyId: String(row.apartment_id),
    propertyName: apartmentNames.get(String(row.apartment_id)) ?? "Departamento",
    date: String(row.cost_date),
    laborCost: asMoney(row.labor_cost as number | string | null),
    materialCost: asMoney(row.material_cost as number | string | null),
    sparePartsCost: asMoney(row.spare_parts_cost as number | string | null),
    externalServiceCost: asMoney(row.external_service_cost as number | string | null),
    totalCost: asMoney(row.total_cost as number | string | null),
    chargeTo: String(row.charge_to ?? "operacion") as MaintenanceCost["chargeTo"],
    businessUnit: String(row.business_unit ?? "maintenance") as MaintenanceCost["businessUnit"],
    notes: typeof row.notes === "string" ? row.notes : undefined
  }));
}
