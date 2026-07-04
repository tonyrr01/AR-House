import { CleaningCard } from "@/components/cleaning-card";
import { PageHeader } from "@/components/page-header";
import { ButtonLink } from "@/components/ui/button";
import { cleanings } from "@/lib/demo-data";

export default function CleaningsPage() {
  return (
    <>
      <PageHeader
        title="Limpiezas"
        description="Limpiezas programadas, responsables, avance y acceso al flujo de ejecucion."
        action={<ButtonLink href="/limpiezas/nueva">Nueva limpieza</ButtonLink>}
      />
      <div className="grid gap-4 xl:grid-cols-2">
        {cleanings.map((cleaning) => (
          <CleaningCard key={cleaning.id} cleaning={cleaning} />
        ))}
      </div>
    </>
  );
}
