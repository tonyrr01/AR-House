import { cn } from "@/lib/utils";

export function Card({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-md border border-slate-200/80 bg-white p-5 shadow-soft", className)}>
      {children}
    </section>
  );
}

export function CardTitle({
  title,
  description
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      {description ? <p className="mt-1 text-base text-slate-500">{description}</p> : null}
    </div>
  );
}
