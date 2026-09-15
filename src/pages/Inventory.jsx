// src/pages/Inventory.jsx
import { useMemo, useState } from "react";
import {
  Package,
  AlertTriangle,
  RefreshCw,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useProducts } from "../hooks/useProducts";
import ProductFormModal from "../components/features/inventory/ProductFormModal";
import StockAdjustModal from "../components/features/inventory/StockAdjustModal";
import { formatCurrency } from "../utils/formatCurrency";

export default function Inventory() {
  const { currentStore } = useAuth();
  const storeId = currentStore?.id;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [onlyActive, setOnlyActive] = useState(true);

  const { products, categories, loading, error, add, edit, remove, adjust } =
    useProducts(storeId, { search, category, onlyActive });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [stockModal, setStockModal] = useState({ open: false, product: null });
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Ringkasan
  const summary = useMemo(() => {
    const total = products.length;
    const lowStock = products.filter(
      (p) => Number(p.stock) <= Number(p.min_stock ?? 5),
    ).length;
    const totalValue = products.reduce(
      (s, p) => s + Number(p.stock) * Number(p.price || 0),
      0,
    );
    return { total, lowStock, totalValue };
  }, [products]);

  // ===== Handlers =====
  const handleOpenCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditing(product);
    setFormOpen(true);
  };

  const handleSubmitForm = async (payload) => {
    if (editing) {
      await edit(editing.id, payload);
    } else {
      await add(payload);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await remove(confirmDelete.id);
      setConfirmDelete(null);
    } catch (err) {
      alert("Gagal hapus: " + err.message);
    }
  };

  const handleAdjustStock = async (id, delta) => {
    await adjust(id, delta);
  };

  // ===== Empty state: belum pilih toko =====
  if (!storeId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
        <p className="text-3xl">🏪</p>
        <h2 className="mt-2 font-semibold text-amber-800">
          Belum ada toko aktif
        </h2>
        <p className="mt-1 text-sm text-amber-700">
          Pilih atau buat toko terlebih dahulu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Produk & Stok</h1>
          <p className="text-sm text-neutral-500">
            Kelola produk dan stok {currentStore?.name}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0a3d3a] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#0a3d3a]/90"
        >
          <Plus size={16} strokeWidth={2.5} />
          Tambah Produk
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MiniStat label="Total Produk" value={summary.total} Icon={Package} />
        <MiniStat
          label="Stok Menipis"
          value={summary.lowStock}
          Icon={AlertTriangle}
          accent={summary.lowStock > 0 ? "red" : "emerald"}
        />
        <MiniStat
          label="Nilai Inventori"
          value={formatCurrency(summary.totalValue)}
          Icon={RpIcon}
          isText
        />
      </div>

      {/* Filter bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="🔍 Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 sm:max-w-xs"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 sm:max-w-xs"
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Custom checkbox */}
        <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-neutral-600">
          <input
            type="checkbox"
            checked={onlyActive}
            onChange={(e) => setOnlyActive(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 accent-emerald-600 focus:ring-2 focus:ring-emerald-500/30"
          />
          Hanya Aktif
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <SkeletonTable />
      ) : products.length === 0 ? (
        <EmptyState
          onCreate={handleOpenCreate}
          hasFilter={search || category}
        />
      ) : (
        <ProductTable
          products={products}
          onEdit={handleOpenEdit}
          onDelete={(p) => setConfirmDelete(p)}
          onAdjustStock={(p) => setStockModal({ open: true, product: p })}
        />
      )}

      {/* Modals */}
      {formOpen && (
        <ProductFormModal
          key={editing?.id ?? "new"} // ⬅️ KEY untuk reset state
          initial={editing}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmitForm}
        />
      )}

      {stockModal.open && stockModal.product && (
        <StockAdjustModal
          key={stockModal.product.id} // ⬅️ KEY untuk reset state
          product={stockModal.product}
          onClose={() => setStockModal({ open: false, product: null })}
          onSubmit={handleAdjustStock}
        />
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <ConfirmDialog
          title="Hapus Produk?"
          message={`Produk "${confirmDelete.name}" akan dihapus permanen.`}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

// ===== Sub-components =====

function RpIcon({ size }) {
  return (
    <span style={{ fontSize: size * 0.8 }} className="font-bold">
      Rp
    </span>
  );
}

function MiniStat({ label, value, Icon, accent = "emerald", isText }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full p-2 ${colors[accent]}`}
      >
        {Icon && <Icon size={18} strokeWidth={2} />}
      </div>
      <div>
        <p className="text-xs text-neutral-500">{label}</p>
        <p
          className={`font-bold text-neutral-800 ${isText ? "text-base" : "text-xl"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function ProductTable({ products, onEdit, onDelete, onAdjustStock }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-y border-gray-200 bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Produk
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Kategori
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Harga
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                Stok
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const min = Number(p.min_stock ?? 5);
              const isLow = Number(p.stock) <= min;
              return (
                <tr
                  key={p.id}
                  className="border-t border-neutral-50 hover:bg-neutral-50/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-neutral-400">
                            <Package size={16} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800">{p.name}</p>
                        {p.description && (
                          <p className="line-clamp-1 text-xs text-neutral-400">
                            {p.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {p.category || "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-neutral-700">
                    {formatCurrency(p.price)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onAdjustStock(p)}
                        className={`min-w-[52px] rounded-lg px-2 py-1 text-xs font-semibold transition ${
                          isLow
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                        }`}
                        title="Klik untuk sesuaikan stok"
                      >
                        {p.stock}
                      </button>
                      {isLow && (
                        <AlertTriangle
                          size={13}
                          className="text-red-500"
                          title={`Min: ${min}`}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {p.is_active ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Aktif
                      </span>
                    ) : (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
                        Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onAdjustStock(p)}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                        title="Sesuaikan stok"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(p)}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(p)}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyState({ onCreate, hasFilter }) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-10 text-center">
      <Package size={40} className="mx-auto text-neutral-300" strokeWidth={1.5} />
      <h3 className="mt-3 font-semibold text-neutral-700">
        {hasFilter ? "Produk tidak ditemukan" : "Belum ada produk"}
      </h3>
      <p className="mt-1 text-sm text-neutral-500">
        {hasFilter
          ? "Coba ubah kata kunci atau filter kategori."
          : "Tambahkan produk pertama kamu untuk mulai berjualan."}
      </p>
      {!hasFilter && (
        <button
          onClick={onCreate}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#0a3d3a] px-4 py-2 text-sm font-medium text-white hover:bg-[#0a3d3a]/90"
        >
          <Plus size={16} strokeWidth={2.5} />
          Tambah Produk
        </button>
      )}
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="space-y-2 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-14 animate-pulse rounded-xl bg-neutral-100" />
      ))}
    </div>
  );
}

function ConfirmDialog({ title, message, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="font-semibold text-neutral-800">{title}</h3>
        <p className="mt-2 text-sm text-neutral-600">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}