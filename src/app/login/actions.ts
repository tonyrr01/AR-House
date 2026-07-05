"use server";

import { headers } from "next/headers";
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

  if (error?.message.toLowerCase().includes("email not confirmed")) {
    redirect("/login?error=confirm-email");
  }

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

export async function resetPasswordAction(formData: FormData) {
  const email = getString(formData, "recovery_email");

  if (!email) redirect("/login?error=recovery-missing");

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? "https://housekeeping-5-estrellas.vercel.app";
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`
  });

  if (error) redirect("/login?error=recovery");

  redirect("/login?status=recovery-sent");
}

export async function updatePasswordAction(formData: FormData) {
  const password = getString(formData, "password");
  const passwordConfirm = getString(formData, "password_confirm");

  if (!password || !passwordConfirm) redirect("/reset-password?error=missing");
  if (password !== passwordConfirm) redirect("/reset-password?error=password-match");

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) redirect("/reset-password?error=update");

  redirect("/login?status=password-updated");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
