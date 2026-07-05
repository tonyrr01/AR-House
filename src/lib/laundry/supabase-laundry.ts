import type { SupabaseClient } from "@supabase/supabase-js";
import type { Apartment, Cleaning, LaundryBatch, LaundryMovement } from "@/types";

export const laundryStatusToDb = {
  "Instalado en unidad": "instalado_en_unidad",
  "Sucio recibido": "sucio_recibido",
  "En clasificacion": "en_clasificacion",
  "En pretratamiento": "en_pretratamiento",
  "En lavado": "en_lavado",
  "En secado": "en_secado",
  "En inspeccion": "en_inspeccion",
  "Limpio aprobado": "limpio_aprobado",
  Observado: "observado",
  "Manchado recuperable": "manchado_recuperable",
  "Manchado no recuperable": "manchado_no_recuperable",
  Roto: "roto",
  Percudido: "percudido",
  "En bodega": "en_bodega",
  "Kit armado": "kit_armado",
  "En ruta": "en_ruta",
  "Entregado a unidad": "entregado_a_unidad",
  Extraviado: "extraviado",
  Baja: "baja",
  "Cargo sugerido al huesped": "cargo_sugerido_al_huesped"
} as const;

export const laundryStatusFromDb = Object.fromEntries(
  Object.entries(laundryStatusToDb).map(([label, value]) => [value, label])
) as Record<string, LaundryBatch["estado"]>;

export const laundryLocationToDb = {
  "Unidad/departamento": "unidad_departamento",
  "Recepcion lavanderia": "recepcion_lavanderia",
  Clasificacion: "clasificacion",
  Pretratamiento: "pretratamiento",
  Lavadora: "lavadora",
  Secadora: "secadora",
  Inspeccion: "inspeccion",
  Doblado: "doblado",
  "Bodega limpia": "bodega_limpia",
  "Bodega observados": "bodega_observados",
  "Bodega bajas": "bodega_bajas",
  "En ruta": "en_ruta",
  "Baja definitiva": "baja_definitiva"
} as const;

export const laundryLocationFromDb = Object.fromEntries(
  Object.entries(laundryLocationToDb).map(([label, value]) => [value, label])
) as Record<string, LaundryMovement["origen"]>;

export const nextLaundryStep: Partial<Record<LaundryBatch["estado"], LaundryBatch["estado"]>> = {
  "Sucio recibido": "En clasificacion",
  "En clasificacion": "En pretratamiento",
  "En pretratamiento": "En lavado",
  "En lavado": "En secado",
  "En secado": "En inspeccion",
  "En inspeccion": "Limpio aprobado",
  "Limpio aprobado": "En bodega",
  Observado: "En pretratamiento"
};

export const statusLocation: Record<string, keyof typeof laundryLocationToDb> = {
  "Sucio recibido": "Recepcion lavanderia",
  "En clasificacion": "Clasificacion",
  "En pretratamiento": "Pretratamiento",
  "En lavado": "Lavadora",
  "En secado": "Secadora",
  "En inspeccion": "Inspeccion",
  "Limpio aprobado": "Doblado",
  Observado: "Bodega observados",
  "En bodega": "Bodega limpia",
  Baja: "Bodega bajas"
};

type DbBatch = {
  id: string;
  apartment_id: string | null;
  cleaning_id: string | null;
  received_at: string;
  status: string;
  weight_kg: number | string;
  total_items: number;
  reception_photo_count: number;
  notes: string | null;
  updated_at: string;
};

type DbMovement = {
  id: string;
  batch_id: string;
  from_location: string;
  to_location: string;
  previous_status: string;
  new_status: string;
  quantity: number;
  notes: string | null;
  created_at: string;
};

export async function getLaundryReferenceData(supabase: SupabaseClient) {
  const [{ data: apartmentRows }, { data: cleaningRows }] = await Promise.all([
    supabase.from("apartments").select("id,name,code,address,beds,baths,status").order("name"),
    supabase.from("cleanings").select("id,apartment_id,scheduled_date,status,cleaning_type").order("scheduled_date", { ascending: false }).limit(25)
  ]);

  const apartments: Pick<Apartment, "id" | "name" | "code" | "address">[] = (apartmentRows ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    code: row.code,
    address: row.address
  }));

  const cleanings: Pick<Cleaning, "id" | "apartmentId" | "scheduledDate" | "status" | "cleaningType">[] = (cleaningRows ?? []).map((row) => ({
    id: row.id,
    apartmentId: row.apartment_id,
    scheduledDate: row.scheduled_date,
    status: row.status,
    cleaningType: row.cleaning_type ?? "checkout"
  }));

  return { apartments, cleanings };
}

export async function getLaundryBatches(supabase: SupabaseClient): Promise<LaundryBatch[]> {
  const { data, error } = await supabase
    .from("laundry_batches")
    .select("id,apartment_id,cleaning_id,received_at,status,weight_kg,total_items,reception_photo_count,notes,updated_at")
    .order("received_at", { ascending: false })
    .limit(50);

  if (error || !data?.length) return [];

  const apartmentIds = [...new Set(data.map((batch: DbBatch) => batch.apartment_id).filter(Boolean))] as string[];
  const { data: apartmentRows } = apartmentIds.length
    ? await supabase.from("apartments").select("id,name").in("id", apartmentIds)
    : { data: [] };
  const apartmentNames = new Map((apartmentRows ?? []).map((apartment) => [apartment.id, apartment.name]));

  return (data as DbBatch[]).map((batch) => ({
    id: batch.id,
    fechaRecepcion: batch.received_at.slice(0, 10),
    propertyId: batch.apartment_id ?? "sin-departamento",
    propertyName: batch.apartment_id ? apartmentNames.get(batch.apartment_id) ?? "Departamento" : "Sin departamento",
    cleaningId: batch.cleaning_id ?? undefined,
    responsableRecepcion: "Equipo operativo",
    pesoKg: Number(batch.weight_kg),
    piezasRecibidas: batch.total_items,
    estado: laundryStatusFromDb[batch.status] ?? "Sucio recibido",
    observaciones: batch.notes ?? undefined,
    fotosRecepcion: batch.reception_photo_count,
    creadoEn: batch.received_at,
    actualizadoEn: batch.updated_at
  }));
}

export async function getLaundryMovements(supabase: SupabaseClient): Promise<LaundryMovement[]> {
  const { data, error } = await supabase
    .from("laundry_movements")
    .select("id,batch_id,from_location,to_location,previous_status,new_status,quantity,notes,created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data?.length) return [];

  return (data as DbMovement[]).map((movement) => ({
    id: movement.id,
    batchId: movement.batch_id,
    origen: laundryLocationFromDb[movement.from_location] ?? "Recepcion lavanderia",
    destino: laundryLocationFromDb[movement.to_location] ?? "Clasificacion",
    estadoAnterior: laundryStatusFromDb[movement.previous_status] ?? "Sucio recibido",
    estadoNuevo: laundryStatusFromDb[movement.new_status] ?? "En clasificacion",
    cantidad: movement.quantity,
    responsable: "Equipo operativo",
    fecha: movement.created_at,
    observaciones: movement.notes ?? undefined
  }));
}
