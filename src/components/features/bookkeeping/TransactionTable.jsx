// src/components/features/bookkeeping/TransactionTable.jsx
import { useMemo, useState } from "react";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDateTime } from "../../../utils/formatDate";

const PAGE_SIZE = 10;

export default function TransactionTable({ transactions = [], onRowClick }) {
  const [page, setPage] = useState(1);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return transactions.slice(start, start + PAGE_SIZE);
  }, [transactions, page]);

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-10 text-center">
        <p className="text-3xl">🧾</p>
        <p className="mt-2 text-sm text-neutral-500">
          Belum ada transaksi di periode ini
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Waktu</th>
              <th className="px-4 py-3 font-medium">Metode</th>
              <th className="px-4 py-3 font-medium">Sumber</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((t) => (
              <tr
                key={t.id}
                onClick={() => onRowClick?.(t.id)}
                className="cursor-pointer border-t border-neutral-50 transition hover:bg-neutral-50/70"
              >
                <td className="px-4 py-3 font-medium text-neutral-700">
                  {t.invoice_no || `#${t.id}`}
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {formatDateTime(t.created_at)}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-lg bg-neutral-100 px-2 py-0.5 text-xs capitalize text-neutral-600">
                    {t.payment_method || "cash"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-400">
                  {t.source || "pos"}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-neutral-800">
                  {formatCurrency(t.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3 text-xs text-neutral-500">
          <span>
            {transactions.length} transaksi — halaman {page} dari {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-neutral-200 px-3 py-1 hover:bg-neutral-50 disabled:opacity-40"
            >
              ‹ Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-neutral-200 px-3 py-1 hover:bg-neutral-50 disabled:opacity-40"
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}