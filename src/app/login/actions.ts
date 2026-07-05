"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function ensureProfile({
  id,
  fullName,
  role
}: {
  id: string;
  fullName: string;
  role: UserRole;
}) {
  const supabase = await createClient();

  await supabase.from("profiles").upsert(
    {
      id,
      full_name: fullName || "Usuario operativo",
      role
    },
    { onConflict: "id" }
  );
}

export async function signInAction(formData: FormData) {
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  if (!email || !password) redirect("/login?error=missing");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) redirect("/login?error=invalid");

  redirect("/");
}

export async function signUpAction(formData: FormData) {
  const fullName = getString(formData, "full_name");
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const passwordConfirm = getString(formData, "password_confirm");
  const role = (getString(formData, "role") || "limpieza") as UserRole;

  if (!fullName || !email || !password || !passwordConfirm) redirect("/login?error=missing");
  if (password !== passwordConfirm) redirect("/login?error=password-match");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role
      }
    }
  });

  if (error) redirect("/login?error=signup");

  if (data.user) {
    await ensureProfile({ id: data.user.id, fullName, role });
  }

  redirect("/login?status=created");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
