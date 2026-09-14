// src/components/features/inventory/ProductFormModal.jsx
import { useState } from "react";

// ⚠️ Perhatikan: component sekarang menerima initial sebagai INITIAL VALUE useState,
// jadi tidak perlu useEffect reset
export default function ProductFormModal({ onClose, onSubmit, initial }) {
  const [form, setForm] = useState(() => ({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? "",
    stock: initial?.stock ?? "",
    min_stock: initial?.min_stock ?? 5,
    category: initial?.category ?? "",
    image_url: initial?.image_url ?? "",
    is_active: initial?.is_active ?? true,
    is_catalog: initial?.is_catalog ?? false,
  }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Nama produk wajib diisi");
    if (form.price === "" || Number(form.price) < 0)
      return setError("Harga wajib diisi (min 0)");
    if (form.stock === "" || Number(form.stock) < 0)
      return setError("Stok wajib diisi (min 0)");

    try {
      setSubmitting(true);
      await onSubmit({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        min_stock: Number(form.min_stock) || 5,
      });
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal menyimpan produk");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <h2 className="font-semibold text-neutral-800">
            {initial ? "Edit Produk" : "Tambah Produk"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <Field label="Nama Produk *">
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder="Contoh: Nasi Goreng"
              className="input"
              autoFocus
            />
          </Field>

          <Field label="Deskripsi">
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={2}
              placeholder="Opsional"
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Harga (Rp) *">
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={set("price")}
                placeholder="0"
                className="input"
              />
            </Field>
            <Field label="Kategori">
              <input
                type="text"
                value={form.category}
                onChange={set("category")}
                placeholder="Makanan / Minuman"
                className="input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Stok Saat Ini *">
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={set("stock")}
                placeholder="0"
                className="input"
              />
            </Field>
            <Field label="Stok Minimum">
              <input
                type="number"
                min="0"
                value={form.min_stock}
                onChange={set("min_stock")}
                placeholder="5"
                className="input"
              />
            </Field>
          </div>

          <Field label="URL Gambar">
            <input
              type="url"
              value={form.image_url}
              onChange={set("image_url")}
              placeholder="https://..."
              className="input"
            />
          </Field>

          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={set("is_active")}
                className="h-4 w-4 rounded border-neutral-300 text-green-600"
              />
              Produk Aktif
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={form.is_catalog}
                onChange={set("is_catalog")}
                className="h-4 w-4 rounded border-neutral-300 text-green-600"
              />
              Tampilkan di Katalog
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
              className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? "Menyimpan..." : initial ? "Simpan" : "Tambah"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e5e5e5;
          background: #fff;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #262626;
          outline: none;
        }
        .input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.15);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-neutral-600">
        {label}
      </span>
      {children}
    </label>
  );
}