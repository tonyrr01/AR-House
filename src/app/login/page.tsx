import { LockKeyhole, Sparkles } from "lucide-react";
import { signInAction, signUpAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";

const messages: Record<string, string> = {
  missing: "Completa todos los campos obligatorios.",
  invalid: "Correo o contrasena incorrectos.",
  "password-match": "Las contrasenas no coinciden.",
  signup: "No se pudo crear el usuario. Revisa el correo o contrasena.",
  created: "Usuario creado. Ya puedes iniciar sesion."
};

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const messageKey = String(params.error ?? params.status ?? "");
  const message = messages[messageKey];
  const isSuccess = params.status === "created";

  return (
    <main className="min-h-screen bg-[#f6f8f7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1fr_460px]">
        <section className="rounded-md bg-pine p-6 text-white shadow-sm sm:p-8 lg:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-white/15">
            <Sparkles className="h-7 w-7" />
          </div>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.16em] text-white/70">Housekeeping 5 Estrellas</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            Acceso operativo para limpieza, supervision y administracion.
          </h1>
          <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-white/80">
            Entra con tu usuario para trabajar con datos reales, respetar permisos por rol y guardar evidencia de la operacion.
          </p>
        </section>

        <div className="grid gap-4">
          {message ? (
            <div
              className={`rounded-md border p-4 text-sm font-bold ${
                isSuccess
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {message}
            </div>
          ) : null}

          <Card>
            <CardTitle title="Iniciar sesion" description="Usa tu correo y contrasena de Supabase." />
            <form action={signInAction} className="grid gap-4">
              <Field label="Correo">
                <Input name="email" type="email" autoComplete="email" required />
              </Field>
              <Field label="Contrasena">
                <Input name="password" type="password" autoComplete="current-password" required />
              </Field>
              <Button type="submit" className="w-full">
                <LockKeyhole className="h-5 w-5" />
                Entrar
              </Button>
            </form>
          </Card>

          <Card>
            <CardTitle title="Crear usuario inicial" description="Para MVP. El rol inicial recomendado es limpieza." />
            <form action={signUpAction} className="grid gap-4">
              <Field label="Nombre completo">
                <Input name="full_name" autoComplete="name" required />
              </Field>
              <Field label="Correo">
                <Input name="email" type="email" autoComplete="email" required />
              </Field>
              <Field label="Contrasena">
                <Input name="password" type="password" autoComplete="new-password" minLength={6} required />
              </Field>
              <Field label="Confirmar contrasena">
                <Input name="password_confirm" type="password" autoComplete="new-password" minLength={6} required />
              </Field>
              <Field label="Rol">
                <Select name="role" defaultValue="limpieza">
                  <option value="limpieza">limpieza</option>
                  <option value="supervisor">supervisor</option>
                  <option value="admin">admin</option>
                  <option value="propietario">propietario</option>
                  <option value="administrador_cliente">administrador_cliente</option>
                </Select>
              </Field>
              <Button type="submit" variant="secondary" className="w-full">
                Crear usuario
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}
