"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  laundryLocationToDb,
  laundryStatusToDb,
  nextLaundryStep,
  statusLocation
} from "@/lib/laundry/supabase-laundry";
import type { LaundryBatch, LinenCategory } from "@/types";

const itemFields: Array<{ key: string; category: LinenCategory; itemName: string; size?: string }> = [
  { key: "sabana_bajera", category: "Sabana bajera", itemName: "Sabana bajera" },
  { key: "sabana_encimera", category: "Sabana encimera", itemName: "Sabana encimera" },
  { key: "funda_almohada", category: "Funda de almohada", itemName: "Funda de almohada" },
  { key: "protector_colchon", category: "Protector de colchon", itemName: "Protector de colchon" },
  { key: "toalla_bano", category: "Toalla de bano", itemName: "Toalla de bano" },
  { key: "toalla_mano", category: "Toalla de mano", itemName: "Toalla de mano" },
  { key: "tapete_bano", category: "Tapete de bano", itemName: "Tapete de bano" },
  { key: "toalla_playa", category: "Toalla de playa/alberca", itemName: "Toalla de playa/alberca" },
  { key: "trapo_cocina", category: "Trapo de cocina", itemName: "Trapo de cocina" }
];

function toNumber(value: FormDataEntryValue | null) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function createLaundryBatchAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/lavanderia?error=session");

  const apartmentId = String(formData.get("apartment_id") ?? "");
  const cleaningValue = String(formData.get("cleaning_id") ?? "");
  const cleaningId = cleaningValue && cleaningValue !== "sin-limpieza" ? cleaningValue : null;
  const weightKg = toNumber(formData.get("weight_kg"));
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const photoCount = toNumber(formData.get("reception_photo_count"));

  if (!apartmentId || weightKg <= 0) redirect("/lavanderia?error=form");

  const { data: apartment } = await supabase
    .from("apartments")
    .select("client_id")
    .eq("id", apartmentId)
    .maybeSingle();

  const items = itemFields
    .map((field) => ({
      ...field,
      quantity: Math.max(0, Math.trunc(toNumber(formData.get(field.key))))
    }))
    .filter((item) => item.quantity > 0);

  if (!items.length) redirect("/lavanderia?error=items");

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const { data: batch, error: batchError } = await supabase
    .from("laundry_batches")
    .insert({
      client_id: apartment?.client_id ?? null,
      apartment_id: apartmentId,
      cleaning_id: cleaningId,
      received_by: user.id,
      current_responsible_id: user.id,
      status: laundryStatusToDb["Sucio recibido"],
      location: laundryLocationToDb["Recepcion lavanderia"],
      weight_kg: weightKg,
      total_items: totalItems,
      reception_photo_count: photoCount,
      notes
    })
    .select("id")
    .single();

  if (batchError || !batch) redirect("/lavanderia?error=save");

  const { error: itemsError } = await supabase.from("laundry_batch_items").insert(
    items.map((item) => ({
      batch_id: batch.id,
      category: item.category,
      item_name: item.itemName,
      size: item.size ?? null,
      quantity_received: item.quantity,
      status: laundryStatusToDb["Sucio recibido"]
    }))
  );

  if (itemsError) redirect("/lavanderia?error=items-save");

  await supabase.from("laundry_movements").insert({
    batch_id: batch.id,
    from_location: laundryLocationToDb["Unidad/departamento"],
    to_location: laundryLocationToDb["Recepcion lavanderia"],
    previous_status: laundryStatusToDb["Instalado en unidad"],
    new_status: laundryStatusToDb["Sucio recibido"],
    quantity: totalItems,
    responsible_id: user.id,
    notes: "Recepcion inicial de lote"
  });

  revalidatePath("/lavanderia");
  redirect("/lavanderia?status=created");
}

export async function moveLaundryBatchAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/lavanderia?error=session");

  const batchId = String(formData.get("batch_id") ?? "");
  const currentStatus = String(formData.get("current_status") ?? "") as LaundryBatch["estado"];
  const nextStatus = nextLaundryStep[currentStatus];

  if (!batchId || !nextStatus) redirect("/lavanderia?error=move");

  const fromLocation = statusLocation[currentStatus] ?? "Recepcion lavanderia";
  const toLocation = statusLocation[nextStatus] ?? "Clasificacion";

  const { data: batch } = await supabase
    .from("laundry_batches")
    .select("total_items")
    .eq("id", batchId)
    .maybeSingle();

  const { error } = await supabase
    .from("laundry_batches")
    .update({
      status: laundryStatusToDb[nextStatus],
      location: laundryLocationToDb[toLocation],
      current_responsible_id: user.id,
      updated_at: new Date().toISOString()
    })
    .eq("id", batchId);

  if (error) redirect("/lavanderia?error=move-save");

  await supabase.from("laundry_movements").insert({
    batch_id: batchId,
    from_location: laundryLocationToDb[fromLocation],
    to_location: laundryLocationToDb[toLocation],
    previous_status: laundryStatusToDb[currentStatus],
    new_status: laundryStatusToDb[nextStatus],
    quantity: batch?.total_items ?? 1,
    responsible_id: user.id,
    notes: `Movimiento automatico a ${nextStatus}`
  });

  revalidatePath("/lavanderia");
  redirect("/lavanderia?status=moved");
}
