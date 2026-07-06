"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getNumber(formData: FormData, key: string) {
  const parsed = Number(formData.get(key) ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function createApartmentAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const name = getString(formData, "name");
  const code = getString(formData, "code");
  const address = getString(formData, "address");
  const developmentName = getString(formData, "development_name") || null;
  const furnitureType = getString(formData, "furniture_type") || null;
  const decorationType = getString(formData, "decoration_type") || null;
  const areaM2 = getNumber(formData, "area_m2");
  const beds = Math.max(0, Math.trunc(getNumber(formData, "beds")));
  const baths = Math.max(0, Math.trunc(getNumber(formData, "baths")));
  const status = getString(formData, "status") === "pausado" ? "pausado" : "activo";

  if (!name || !code || !address) redirect("/departamentos?error=missing");

  const { data: profile } = await supabase
    .from("profiles")
    .select("client_id")
    .eq("id", user.id)
    .maybeSingle();

  const { error } = await supabase.from("apartments").insert({
    client_id: profile?.client_id ?? null,
    name,
    code,
    address,
    area_m2: areaM2 > 0 ? areaM2 : null,
    development_name: developmentName,
    furniture_type: furnitureType,
    decoration_type: decorationType,
    beds: beds || 1,
    baths: baths || 1,
    status
  });

  if (error) redirect("/departamentos?error=save");

  revalidatePath("/departamentos");
  redirect("/departamentos?status=created");
}
