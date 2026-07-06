import type { SupabaseClient } from "@supabase/supabase-js";
import type { Apartment } from "@/types";

type DbApartment = {
  id: string;
  name: string;
  code: string;
  address: string;
  area_m2: number | string | null;
  development_name: string | null;
  furniture_type: string | null;
  decoration_type: string | null;
  beds: number;
  baths: number;
  status: string;
};

export async function getApartments(supabase: SupabaseClient): Promise<Apartment[]> {
  const { data, error } = await supabase
    .from("apartments")
    .select("id,name,code,address,area_m2,development_name,furniture_type,decoration_type,beds,baths,status")
    .order("name", { ascending: true });

  if (error || !data?.length) return [];

  return (data as DbApartment[]).map((apartment) => ({
    id: apartment.id,
    name: apartment.name,
    code: apartment.code,
    address: apartment.address,
    areaM2: Number(apartment.area_m2 ?? 0),
    developmentName: apartment.development_name ?? "Sin desarrollo",
    furnitureType: apartment.furniture_type ?? "Sin definir",
    decorationType: apartment.decoration_type ?? "Sin definir",
    ownerName: "Sin propietario asignado",
    beds: apartment.beds,
    baths: apartment.baths,
    status: apartment.status === "pausado" ? "pausado" : "activo"
  }));
}
