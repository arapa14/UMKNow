// src/components/features/pos/PaymentModal.jsx
import { useState } from "react";
import { formatCurrency } from "../../../utils/formatCurrency";

const QUICK_CASH = [5000, 10000, 20000, 50000, 100000];

export default function PaymentModal({
  open,
  onClose,
  total,
  onConfirm,
  submitting,
}) {
  const [method, setMethod] = useState("cash");
  const [paid, setPaid] = useState("");
  const [discount, setDiscount] = useState("");
  const [tax, setTax] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState(null);

  if (!open) return null;

  const discountNum = Number(discount) || 0;
  const taxNum = Number(tax) || 0;
  const finalTotal = Math.max(0, total - discountNum + taxNum);
  const paidNum = Number(paid) || 0;
  const change = Math.max(0, paidNum - finalTotal);
  const remaining = Math.max(0, finalTotal - paidNum);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (method === "cash") {
      if (paidNum < finalTotal) {
        return setError("Uang yang dibayar kurang dari total");
      }
    }

    try {
      await onConfirm({
        method,
        paid_amount: method === "cash" ? paidNum : finalTotal,
        discount: discountNum,
        tax: taxNum,
        notes,
      });
    } catch (err) {
      setError(err.message || "Checkout gagal");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <h2 className="font-semibold text-neutral-800">Pembayaran</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100"
            disabled={submitting}
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto px-5 py-4"
        >
          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Total */}
          <div className="rounded-xl bg-green-50 p-4 text-center">
            <p className="text-xs text-green-700">Total Tagihan</p>
            <p className="mt-1 text-2xl font-bold text-green-700">
              {formatCurrency(finalTotal)}
            </p>
          </div>

          {/* Metode */}
          <div>
            <p className="mb-2 text-xs font-medium text-neutral-600">
              Metode Pembayaran
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "cash", label: "💵 Cash" },
                { key: "qris", label: "📱 QRIS" },
                { key: "transfer", label: "🏦 Transfer" },
              ].map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMethod(m.key)}
                  className={`rounded-xl border px-2 py-2 text-xs font-medium transition ${
                    method === m.key
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cash inputs */}
          {method === "cash" && (
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-neutral-600">
                  Uang Diterima
                </span>
                <input
                  type="number"
                  min="0"
                  value={paid}
                  onChange={(e) => setPaid(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-lg font-semibold outline-none focus:border-green-500"
                  autoFocus
                />
              </label>

              <div className="flex flex-wrap gap-1.5">
                {QUICK_CASH.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setPaid(String(v))}
                    className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                  >
                    {formatCurrency(v)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPaid(String(finalTotal))}
                  className="rounded-lg border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 hover:bg-green-100"
                >
                  Uang Pas
                </button>
              </div>

              {paidNum > 0 && (
                <div
                  className={`rounded-xl px-3 py-2 text-sm ${
                    remaining > 0
                      ? "bg-red-50 text-red-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {remaining > 0 ? (
                    <>
                      Kurang:{" "}
                      <span className="font-bold">
                        {formatCurrency(remaining)}
                      </span>
                    </>
                  ) : (
                    <>
                      Kembalian:{" "}
                      <span className="font-bold">
                        {formatCurrency(change)}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Diskon & Pajak */}
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-600">
                Diskon (Rp)
              </span>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-600">
                Pajak (Rp)
              </span>
              <input
                type="number"
                min="0"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-600">
              Catatan (opsional)
            </span>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Pelanggan langganan"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-green-500"
            />
          </label>
        </form>

        <div className="flex justify-end gap-2 border-t border-neutral-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || (method === "cash" && paidNum < finalTotal)}
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? "Memproses..." : "Bayar & Cetak"}
          </button>
        </div>
      </div>
    </div>
  );
}
