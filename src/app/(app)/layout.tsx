import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name,role")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <AppShell
      user={{
        email: user.email ?? "sin correo",
        fullName: profile?.full_name ?? user.user_metadata?.full_name ?? "Usuario operativo",
        role: (profile?.role ?? user.user_metadata?.role ?? "limpieza") as UserRole
      }}
    >
      {children}
    </AppShell>
  );
}
