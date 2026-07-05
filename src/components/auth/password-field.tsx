"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Field, Input } from "@/components/ui/field";

type PasswordFieldProps = {
  label: string;
  name: string;
  autoComplete: string;
  minLength?: number;
};

export function PasswordField({ label, name, autoComplete, minLength }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Field label={label}>
      <div className="relative">
        <Input
          name={name}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={minLength}
          required
          className="pr-14"
        />
        <button
          type="button"
          aria-label={isVisible ? "Ocultar contrasena" : "Mostrar contrasena"}
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-pine"
        >
          {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </Field>
  );
}
