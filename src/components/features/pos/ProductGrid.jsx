// src/components/features/pos/ProductGrid.jsx
import { formatCurrency } from "../../../utils/formatCurrency";

export default function ProductGrid({ products, loading, onPick }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl bg-white shadow-sm"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-10 text-center">
        <p className="text-4xl">📦</p>
        <h3 className="mt-2 font-semibold text-neutral-700">
          Tidak ada produk
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Tambah produk di halaman Inventory dulu.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => {
        const low = Number(p.stock) <= Number(p.min_stock ?? 5);
        return (
          <button
            key={p.id}
            onClick={() => onPick(p)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="aspect-square w-full overflow-hidden bg-neutral-100">
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl text-neutral-300">
                  📦
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-3">
              <p className="line-clamp-2 text-sm font-medium text-neutral-800">
                {p.name}
              </p>
              <p className="mt-1 text-sm font-bold text-green-600">
                {formatCurrency(p.price)}
              </p>
              <p
                className={`mt-auto pt-2 text-xs ${
                  low ? "text-red-500" : "text-neutral-400"
                }`}
              >
                Stok: {p.stock} {low && "⚠️"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}