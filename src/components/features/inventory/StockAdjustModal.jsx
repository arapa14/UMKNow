// src/components/features/inventory/StockAdjustModal.jsx
import { useState } from "react";

export default function StockAdjustModal({ onClose, product, onSubmit }) {
  // Lazy init — dijalankan SEKALI saat mount
  const [mode, setMode] = useState("in");
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const delta = mode === "in" ? Number(qty) : -Number(qty);
  const preview = Math.max(0, Number(product.stock) + delta);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!qty || Number(qty) <= 0) return setError("Jumlah harus > 0");

    try {
      setSubmitting(true);
      await onSubmit(product.id, delta);
      onClose();
    } catch (err) {
      setError(err.message || "Gagal menyesuaikan stok");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <h2 className="font-semibold text-neutral-800">Sesuaikan Stok</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <div className="rounded-xl bg-neutral-50 p-3">
            <p className="text-xs text-neutral-500">Produk</p>
            <p className="text-sm font-medium text-neutral-800">
              {product.name}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Stok saat ini:{" "}
              <span className="font-semibold text-neutral-700">
                {product.stock}
              </span>
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode("in")}
              className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                mode === "in"
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              ➕ Stok Masuk
            </button>
            <button
              type="button"
              onClick={() => setMode("out")}
              className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                mode === "out"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              ➖ Stok Keluar
            </button>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-600">
              Jumlah
            </span>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-green-500"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-600">
              Catatan (opsional)
            </span>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Restock dari supplier"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-green-500"
            />
          </label>

          <div className="flex items-center justify-between rounded-xl border border-dashed border-neutral-200 px-3 py-2 text-sm">
            <span className="text-neutral-500">Stok setelah:</span>
            <span
              className={`font-bold ${
                mode === "in" ? "text-green-600" : "text-red-600"
              }`}
            >
              {preview}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`rounded-xl px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
                mode === "in"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
              disabled={submitting}
            >
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}