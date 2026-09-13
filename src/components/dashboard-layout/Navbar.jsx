import { Plus, ShoppingBag, ChevronDown } from "lucide-react";

export function Navbar({
  storeName = "Toko Kelontong Berkah",
  userInitials = "KB",
  onAddProduct = () => {},
  onNewTransaction = () => {},
}) {
  return (
    <header className="flex h-16 w-full items-center justify-end gap-6 border-b border-black/5 bg-white px-8">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-sm text-stone-600">{storeName}</span>
        <ChevronDown size={14} className="text-stone-400" />
      </div>

      <div className="hidden items-center gap-3 sm:flex">
        <button
          type="button"
          onClick={onAddProduct}
          className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3.5 py-2 text-sm font-medium text-teal-800 hover:bg-teal-100"
        >
          <Plus size={16} />
          Produk
        </button>
        <button
          type="button"
          onClick={onNewTransaction}
          className="flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          <ShoppingBag size={16} />
          Transaksi Baru (POS)
        </button>
      </div>

      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-xs font-medium text-white">
        {userInitials}
      </div>
    </header>
  );
}

export default Navbar;