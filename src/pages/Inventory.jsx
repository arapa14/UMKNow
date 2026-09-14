// src/pages/Inventory.jsx
import { useMemo, useState } from "react";
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
          className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700"
        >
          ➕ Tambah Produk
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MiniStat label="Total Produk" value={summary.total} icon="📦" />
        <MiniStat
          label="Stok Menipis"
          value={summary.lowStock}
          icon="⚠️"
          accent={summary.lowStock > 0 ? "red" : "green"}
        />
        <MiniStat
          label="Nilai Inventori"
          value={formatCurrency(summary.totalValue)}
          icon="💰"
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
          className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-green-500 sm:max-w-xs"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-green-500 sm:max-w-xs"
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-neutral-600">
          <input
            type="checkbox"
            checked={onlyActive}
            onChange={(e) => setOnlyActive(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-green-600"
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

function MiniStat({ label, value, icon, accent = "green", isText }) {
  const colors = {
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[accent]}`}
      >
        <span className="text-lg">{icon}</span>
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
          <thead className="bg-neutral-50 text-left text-xs text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Produk</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium text-right">Harga</th>
              <th className="px-4 py-3 font-medium text-center">Stok</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Aksi</th>
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
                            📦
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
                        <span
                          className="text-xs text-red-500"
                          title={`Min: ${min}`}
                        >
                          ⚠️
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {p.is_active ? (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
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
                        className="rounded-lg p-2 text-neutral-500 hover:bg-green-50 hover:text-green-600"
                        title="Sesuaikan stok"
                      >
                        🔄
                      </button>
                      <button
                        onClick={() => onEdit(p)}
                        className="rounded-lg p-2 text-neutral-500 hover:bg-blue-50 hover:text-blue-600"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(p)}
                        className="rounded-lg p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600"
                        title="Hapus"
                      >
                        🗑️
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
      <p className="text-4xl">📦</p>
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
          className="mt-4 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          ➕ Tambah Produk
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
