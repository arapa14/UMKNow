// src/components/features/pos/CartItem.jsx
import { Package } from "lucide-react";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function CartItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onSetQty,
}) {
  return (
    <div className="flex gap-3 border-b border-neutral-100 py-3 last:border-0">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-100">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.product_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package size={18} className="text-neutral-400" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-1 text-sm font-medium text-neutral-800">
            {item.product_name}
          </p>
          <button
            onClick={() => onRemove(item.product_id)}
            className="text-neutral-400 hover:text-red-500"
            title="Hapus"
          >
            ✕
          </button>
        </div>
        <p className="mt-0.5 text-xs text-neutral-500">
          {formatCurrency(item.price)} × {item.quantity}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDecrement(item.product_id)}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            >
              −
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => onSetQty(item.product_id, e.target.value)}
              className="h-7 w-12 rounded-lg border border-neutral-200 text-center text-sm outline-none focus:border-emerald-500"
              min="1"
              max={item.stock || undefined}
            />
            <button
              onClick={() => onIncrement(item.product_id)}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              disabled={item.stock && item.quantity >= item.stock}
            >
              +
            </button>
          </div>
          <p className="text-sm font-semibold text-neutral-800">
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}