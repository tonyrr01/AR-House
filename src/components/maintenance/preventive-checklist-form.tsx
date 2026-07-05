import { ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

const checklistAreas = [
  ["Aire acondicionado", ["Limpieza de filtros", "Prueba de enfriamiento", "Revision de ruido", "Revision de drenaje"]],
  ["Plomeria", ["Fugas en lavabos", "Fugas en WC", "Regaderas", "Presion de agua", "Drenajes lentos"]],
  ["Electricidad", ["Contactos", "Apagadores", "Lamparas", "Focos", "Centros de carga"]],
  ["Carpinteria", ["Puertas", "Bisagras", "Chapas", "Cajones", "Closets"]],
  ["Pintura y tablaroca", ["Golpes", "Humedad", "Grietas", "Manchas", "Resanes pendientes"]],
  ["Seguridad y operacion", ["Cerradura", "Internet", "TV", "Controles", "Sensores"]]
];

export function PreventiveChecklistForm() {
  return (
    <Card>
      <CardTitle title="Checklist preventivo bimestral" description="Mock: no marcar completado sin checklist." />
      <div className="grid gap-4">
        {checklistAreas.map(([area, items]) => (
          <section key={area as string} className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-bold text-ink">{area}</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {(items as string[]).map((item) => (
                <label key={item} className="flex min-h-11 items-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                  <input type="checkbox" className="h-5 w-5" />
                  {item}
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>
      <Button type="button" className="mt-5 w-full">
        <ClipboardCheck className="h-5 w-5" />
        Guardar checklist preventivo
      </Button>
    </Card>
  );
}
