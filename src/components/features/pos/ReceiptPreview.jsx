// src/components/features/pos/ReceiptPreview.jsx
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDateTime } from "../../../utils/formatDate";

export default function ReceiptPreview({ open, onClose, transaction, store }) {
  if (!open || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Modal overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 print:hidden">
        <div className="flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
            <h2 className="font-semibold text-neutral-800">Struk</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-neutral-50 p-4">
            <ReceiptBody transaction={transaction} store={store} />
          </div>

          <div className="flex justify-end gap-2 border-t border-neutral-100 px-5 py-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              🖨️ Print Struk
            </button>
          </div>
        </div>
      </div>

      {/* Struk yang benar-benar di-print */}
      <div className="hidden print:block">
        <ReceiptBody transaction={transaction} store={store} />
      </div>

      {/* CSS print — reset body agar cuma struk yang keluar */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:block, .print\\:block * { visibility: visible; }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            font-family: 'Courier New', monospace;
            color: #000;
          }
          @page { margin: 5mm; }
        }
      `}</style>
    </>
  );
}

function ReceiptBody({ transaction, store }) {
  const items = transaction.items || [];

  return (
    <div className="mx-auto w-full max-w-[280px] bg-white p-4 text-xs text-neutral-800">
      {/* Header */}
      <div className="text-center">
        <p className="text-sm font-bold">{store?.name || "Toko"}</p>
        {store?.address && (
          <p className="mt-0.5 text-[10px] text-neutral-500">
            {store.address}
          </p>
        )}
        {store?.phone && (
          <p className="text-[10px] text-neutral-500">{store.phone}</p>
        )}
      </div>

      <div className="my-2 border-t border-dashed border-neutral-300" />

      {/* Meta */}
      <div className="space-y-0.5 text-[10px]">
        <div className="flex justify-between">
          <span className="text-neutral-500">No</span>
          <span>{transaction.invoice_no}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">Tanggal</span>
          <span>{formatDateTime(transaction.created_at)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">Metode</span>
          <span className="uppercase">{transaction.payment_method}</span>
        </div>
      </div>

      <div className="my-2 border-t border-dashed border-neutral-300" />

      {/* Items */}
      <div className="space-y-1.5">
        {items.map((it, i) => (
          <div key={i}>
            <p className="text-[11px] font-medium">{it.product_name}</p>
            <div className="flex justify-between text-[10px] text-neutral-600">
              <span>
                {it.quantity} × {formatCurrency(it.price)}
              </span>
              <span className="font-medium text-neutral-800">
                {formatCurrency(it.subtotal)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="my-2 border-t border-dashed border-neutral-300" />

      {/* Totals */}
      <div className="space-y-0.5 text-[11px]">
        <Row label="Subtotal" value={formatCurrency(transaction.subtotal)} />
        {Number(transaction.discount) > 0 && (
          <Row
            label="Diskon"
            value={`- ${formatCurrency(transaction.discount)}`}
          />
        )}
        {Number(transaction.tax) > 0 && (
          <Row label="Pajak" value={formatCurrency(transaction.tax)} />
        )}
        <Row
          label="TOTAL"
          value={formatCurrency(transaction.total)}
          bold
        />
        <Row
          label="Bayar"
          value={formatCurrency(transaction.paid_amount)}
        />
        <Row
          label="Kembali"
          value={formatCurrency(transaction.change_amount)}
        />
      </div>

      <div className="my-2 border-t border-dashed border-neutral-300" />

      {/* Footer */}
      <div className="text-center text-[10px] text-neutral-500">
        <p>Terima kasih 🙏</p>
        <p className="mt-0.5">Powered by UMKNow</p>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? "font-bold" : "text-neutral-500"}>{label}</span>
      <span className={bold ? "font-bold" : ""}>{value}</span>
    </div>
  );
}