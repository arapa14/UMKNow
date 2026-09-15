// src/components/features/inventory/StockAdjustModal.jsx
import { useState } from "react";
import { X, Plus, Minus, ArrowRight } from "lucide-react";

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
    if (!qty || Number(qty) <= 0) return setError("Jumlah harus lebih dari 0");

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
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <h2 className="font-semibold text-neutral-800">Sesuaikan Stok</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          {/* Info Produk */}
          <div className="rounded-xl bg-gray-50 px-4 py-3 border border-gray-100">
            <p className="text-xs text-gray-500">Produk</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">
              {product.name}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Stok saat ini:{" "}
              <span className="font-semibold text-gray-700">
                {product.stock}
              </span>
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Toggle Masuk / Keluar */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode("in")}
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                mode === "in"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <Plus size={16} />
              Stok Masuk
            </button>
            <button
              type="button"
              onClick={() => setMode("out")}
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                mode === "out"
                  ? "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <Minus size={16} />
              Stok Keluar
            </button>
          </div>

          {/* Input Fields */}
          <div className="space-y-3 pt-1">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-gray-600">
                Jumlah
              </span>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                autoFocus
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-gray-600">
                Catatan (opsional)
              </span>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Contoh: Restock dari supplier"
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </label>
          </div>

          {/* Preview Stok Akhir */}
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 border border-gray-200 mt-2">
            <span className="text-sm font-medium text-gray-600">Estimasi akhir:</span>
            <div className="flex items-center gap-2.5">
              <span className="text-sm text-gray-400 line-through">
                {product.stock}
              </span>
              <ArrowRight size={14} className="text-gray-400" />
              <span
                className={`text-lg font-bold ${
                  mode === "in" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {preview}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`rounded-xl px-5 py-2 text-sm font-medium text-white transition-colors disabled:opacity-60 ${
                mode === "in"
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/20"
                  : "bg-red-600 hover:bg-red-700 shadow-sm shadow-red-600/20"
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