import { ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Select, Textarea } from "@/components/ui/field";
import { checklistItems, cleanings } from "@/lib/demo-data";

export default function ChecklistPage() {
  const grouped = checklistItems.reduce<Record<string, typeof checklistItems>>((acc, item) => {
    acc[item.area] = acc[item.area] ?? [];
    acc[item.area].push(item);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Checklist"
        description="Checklist por areas para estandarizar cada limpieza antes de enviar a supervision."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(grouped).map(([area, items]) => (
            <Card key={area}>
              <h2 className="mb-5 flex items-center gap-3 text-xl font-bold text-ink">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-mist text-sea">
                  <ClipboardCheck className="h-5 w-5" />
                </span>
                {area}
              </h2>
              <div className="grid gap-3">
                {items.map((item) => (
                  <label
                    key={item.id}
                    className="tap-target flex items-center gap-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-sea/40 hover:bg-mist"
                  >
                    <input type="checkbox" className="h-6 w-6 shrink-0 accent-pine" />
                    <span className="font-semibold text-slate-800">{item.label}</span>
                    {item.required ? (
                      <span className="ml-auto rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-500">
                        req.
                      </span>
                    ) : null}
                  </label>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <h2 className="mb-5 text-xl font-bold">Guardar avance</h2>
          <form className="grid gap-5">
            <Field label="Limpieza">
              <Select>
                {cleanings.map((cleaning) => (
                  <option key={cleaning.id}>{cleaning.apartmentName}</option>
                ))}
              </Select>
            </Field>
            <Field label="Notas">
              <Textarea placeholder="Observaciones del checklist." />
            </Field>
            <Button type="button" className="w-full">Guardar avance</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
