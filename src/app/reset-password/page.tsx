import { KeyRound } from "lucide-react";
import { updatePasswordAction } from "@/app/login/actions";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

const messages: Record<string, string> = {
  missing: "Completa los dos campos de contrasena.",
  "password-match": "Las contrasenas no coinciden.",
  update: "No se pudo actualizar la contrasena. Vuelve a solicitar el correo de recuperacion."
};

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const messageKey = String(params.error ?? "");
  const message = messages[messageKey];

  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f8f7] px-4 py-8">
      <div className="w-full max-w-lg">
        {message ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">
            {message}
          </div>
        ) : null}
        <Card>
          <CardTitle
            title="Nueva contrasena"
            description="Escribe y confirma tu nueva contrasena para recuperar el acceso."
          />
          <form action={updatePasswordAction} className="grid gap-4">
            <PasswordField label="Nueva contrasena" name="password" autoComplete="new-password" minLength={6} />
            <PasswordField label="Confirmar contrasena" name="password_confirm" autoComplete="new-password" minLength={6} />
            <Button type="submit" className="w-full">
              <KeyRound className="h-5 w-5" />
              Guardar nueva contrasena
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
