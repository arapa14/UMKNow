// src/components/features/bookkeeping/TransactionDetailModal.jsx
import { useEffect, useState } from "react";
import { getTransactionDetail } from "../../../services/bookkeepingService";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDateTime } from "../../../utils/formatDate";

export default function TransactionDetailModal({
  open,
  onClose,
  transactionId,
}) {
  const [loading, setLoading] = useState(false);
  const [tx, setTx] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !transactionId) return;
    let ignore = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTransactionDetail(transactionId);
        if (ignore) return;
        setTx(data);
      } catch (err) {
        if (ignore) return;
        setError(err.message || "Gagal memuat detail");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [open, transactionId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <h2 className="font-semibold text-neutral-800">Detail Transaksi</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-xl bg-neutral-100"
                />
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          {tx && (
            <div className="space-y-4 text-sm">
              <div className="rounded-xl bg-neutral-50 p-3">
                <p className="text-xs text-neutral-500">Invoice</p>
                <p className="font-semibold text-neutral-800">
                  {tx.invoice_no}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {formatDateTime(tx.created_at)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-neutral-600">
                  Item
                </p>
                <div className="space-y-2">
                  {tx.items?.map((it, i) => (
                    <div
                      key={i}
                      className="flex justify-between border-b border-neutral-50 pb-2 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-neutral-800">
                          {it.product_name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {it.quantity} × {formatCurrency(it.price)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-neutral-800">
                        {formatCurrency(it.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1 border-t border-neutral-100 pt-3 text-sm">
                <Row label="Subtotal" value={formatCurrency(tx.subtotal)} />
                {Number(tx.discount) > 0 && (
                  <Row
                    label="Diskon"
                    value={`− ${formatCurrency(tx.discount)}`}
                  />
                )}
                {Number(tx.tax) > 0 && (
                  <Row label="Pajak" value={formatCurrency(tx.tax)} />
                )}
                <Row label="Total" value={formatCurrency(tx.total)} bold />
                <Row
                  label="Bayar"
                  value={formatCurrency(tx.paid_amount)}
                  muted
                />
                <Row
                  label="Kembali"
                  value={formatCurrency(tx.change_amount)}
                  muted
                />
              </div>

              <div className="rounded-xl bg-neutral-50 p-3 text-xs text-neutral-500">
                <p>
                  Metode:{" "}
                  <span className="capitalize">{tx.payment_method}</span>
                </p>
                <p>Status: {tx.status}</p>
                {tx.notes && <p>Catatan: {tx.notes}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, muted }) {
  return (
    <div className="flex justify-between">
      <span className={muted ? "text-neutral-500" : ""}>{label}</span>
      <span className={bold ? "font-bold text-neutral-800" : ""}>{value}</span>
    </div>
  );
}
