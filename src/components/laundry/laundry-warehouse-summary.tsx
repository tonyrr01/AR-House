import { StockLevelBadge } from "@/components/laundry/laundry-status-badge";
import { Card, CardTitle } from "@/components/ui/card";
import type { WarehouseStockItem } from "@/types";

export function LaundryWarehouseSummary({ stock }: { stock: WarehouseStockItem[] }) {
  return (
    <Card className="p-0">
      <div className="border-b border-slate-200 p-5">
        <CardTitle
          title="Bodega limpia"
          description="Stock disponible, minimo operativo y crecimiento recomendado para 100 habitaciones."
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4">Categoria</th>
              <th className="px-5 py-4">Disponible</th>
              <th className="px-5 py-4">Stock minimo</th>
              <th className="px-5 py-4">Req. 50 hab</th>
              <th className="px-5 py-4">Rec. 100 hab</th>
              <th className="px-5 py-4">Semaforo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stock.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-4 font-bold text-ink">{item.categoria}</td>
                <td className="px-5 py-4 font-bold">{item.stockDisponible}</td>
                <td className="px-5 py-4">{item.stockMinimo}</td>
                <td className="px-5 py-4">{item.stock50Habitaciones}</td>
                <td className="px-5 py-4">{item.stock100Habitaciones}</td>
                <td className="px-5 py-4"><StockLevelBadge level={item.nivel} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
