"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { maintenancePriorityToDb } from "@/lib/maintenance/supabase-maintenance";
import { createClient } from "@/lib/supabase/server";
import type { MaintenancePriority } from "@/types";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getNumber(formData: FormData, key: string) {
  const value = Number(formData.get(key) ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function slug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isUuid(value: string | null) {
  return Boolean(value?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i));
}

export async function createMaintenanceTicketAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const apartmentId = getString(formData, "apartment_id");
  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const category = getString(formData, "category");
  const priority = (getString(formData, "priority") || "Media") as MaintenancePriority;
  const area = getString(formData, "area") || "otro";
  const issueType = getString(formData, "issue_type") || "Desperfecto";
  const assignedSpecialty = getString(formData, "assigned_specialty") || "Tecnico general";
  const estimatedCost = getNumber(formData, "estimated_cost");
  const dueDate = getString(formData, "due_date") || null;
  const observations = getString(formData, "observations") || null;
  const suggestedChargeToGuest = formData.get("suggested_charge_to_guest") === "on";
  const sourceModule = getString(formData, "source_module") || "manual";
  const sourceId = getString(formData, "source_id") || null;

  if (!apartmentId || !description) redirect("/mantenimiento?error=missing#tickets");
  if (suggestedChargeToGuest && estimatedCost <= 0) redirect("/mantenimiento?error=guest-charge#tickets");
  if (priority === "Urgente" && !dueDate) redirect("/mantenimiento?error=urgent-date#tickets");

  const { data: apartment } = await supabase
    .from("apartments")
    .select("client_id")
    .eq("id", apartmentId)
    .maybeSingle();

  const chargeTo = suggestedChargeToGuest ? "huesped" : "operacion";
  const businessUnit = suggestedChargeToGuest ? "guest_charge" : "maintenance";

  const { data: ticket, error } = await supabase
    .from("maintenance_asset_tickets")
    .insert({
      client_id: apartment?.client_id ?? null,
      apartment_id: apartmentId,
      source_module: sourceModule,
      source_id: isUuid(sourceId) ? sourceId : null,
      title: title || category,
      description,
      issue_type: issueType,
      category,
      priority: maintenancePriorityToDb[priority] ?? "media",
      area,
      reported_by: user.id,
      estimated_cost: estimatedCost,
      suggested_charge_to_guest: suggestedChargeToGuest,
      charge_to: chargeTo,
      business_unit: businessUnit,
      due_date: dueDate,
      assigned_specialty: assignedSpecialty,
      observations
    })
    .select("id")
    .single();

  if (error || !ticket) redirect("/mantenimiento?error=save#tickets");

  const photos = formData.getAll("photos_before").filter((value): value is File => value instanceof File && value.size > 0);
  for (const [index, photo] of photos.entries()) {
    const extension = photo.name.split(".").pop() || "jpg";
    const path = `${ticket.id}/antes/${Date.now()}-${index}-${slug(photo.name)}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("maintenance-evidence").upload(path, photo, {
      contentType: photo.type || "image/jpeg"
    });

    if (!uploadError) {
      await supabase.from("maintenance_evidence").insert({
        ticket_id: ticket.id,
        evidence_kind: "antes",
        storage_path: path,
        caption: "Foto antes",
        uploaded_by: user.id
      });
    }
  }

  revalidatePath("/mantenimiento");
  redirect("/mantenimiento?status=ticket-created#tickets");
}

export async function addWorkOrderMaterialAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const workOrderId = getString(formData, "work_order_id");
  const sparePartId = getString(formData, "spare_part_id");
  const quantity = Math.trunc(getNumber(formData, "quantity"));
  const unitCost = getNumber(formData, "unit_cost");

  if (!workOrderId || !sparePartId || quantity <= 0) redirect("/mantenimiento?error=material#ordenes");

  const { error: stockError } = await supabase.rpc("decrement_spare_part_stock", {
    p_spare_part_id: sparePartId,
    p_quantity: quantity
  });

  if (stockError) redirect("/mantenimiento?error=stock#ordenes");

  const { error } = await supabase.from("work_order_materials").insert({
    work_order_id: workOrderId,
    spare_part_id: sparePartId,
    quantity,
    unit_cost: unitCost,
    created_by: user.id
  });

  if (error) redirect("/mantenimiento?error=material-save#ordenes");

  revalidatePath("/mantenimiento");
  redirect("/mantenimiento?status=stock-updated#ordenes");
}
