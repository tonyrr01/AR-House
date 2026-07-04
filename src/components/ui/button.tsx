import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-pine text-white shadow-sm hover:bg-[#184b40]",
  secondary: "border border-slate-200 bg-white text-ink shadow-sm hover:border-sea/40 hover:bg-mist",
  warning: "bg-clay text-white shadow-sm hover:bg-[#9f4d35]"
};

type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof variants;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "tap-target inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-base font-semibold transition active:scale-[0.99]",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  ...props
}: ComponentProps<typeof Link> & { variant?: keyof typeof variants }) {
  return (
    <Link
      className={cn(
        "tap-target inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-base font-semibold transition active:scale-[0.99]",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
