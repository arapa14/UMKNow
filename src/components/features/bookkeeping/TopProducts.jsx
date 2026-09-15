// src/components/features/bookkeeping/TopProducts.jsx
import { formatCurrency } from "../../../utils/formatCurrency";

export default function TopProducts({ products = [] }) {
  if (products.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-neutral-400">
        Belum ada produk terjual
      </p>
    );
  }

  const maxQty = Math.max(...products.map((p) => p.qty), 1);

  return (
    <ul className="space-y-3">
      {products.map((p, i) => (
        <li key={p.product_id ?? `idx-${i}`}>
          <div className="flex items-center gap-3">
            <span
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                i === 0
                  ? "bg-amber-100 text-amber-700"
                  : i === 1
                    ? "bg-neutral-100 text-neutral-700"
                    : i === 2
                      ? "bg-orange-100 text-orange-700"
                      : "bg-neutral-50 text-neutral-500"
              }`}
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="line-clamp-1 text-sm font-medium text-neutral-800">
                  {p.product_name}
                </p>
                <span className="text-xs font-semibold text-neutral-700">
                  {p.qty}×
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${(p.qty / maxQty) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] text-neutral-400">
                Revenue: {formatCurrency(p.revenue)} • Profit:{" "}
                {formatCurrency(p.profit)}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}