import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  children,
  className
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("grid gap-2 text-sm font-semibold text-slate-700", className)}>
      {label}
      {children}
    </label>
  );
}

export function Input(props: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "tap-target rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-slate-400 focus:border-sea focus:ring-4 focus:ring-sea/15",
        props.className
      )}
      {...props}
    />
  );
}

export function Select(props: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "tap-target rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-sea focus:ring-4 focus:ring-sea/15",
        props.className
      )}
      {...props}
    />
  );
}

export function Textarea(props: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-28 rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-slate-400 focus:border-sea focus:ring-4 focus:ring-sea/15",
        props.className
      )}
      {...props}
    />
  );
}
