// src/pages/Catalog.jsx
import { useState } from "react";
import { Search } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useCatalog } from "../hooks/useCatalog";
import { formatCurrency } from "../utils/formatCurrency";

export default function Catalog() {
  const { currentStore } = useAuth();
  const {
    products,
    loading,
    error,
    search,
    setSearch,
    stats,
    publicUrl,
    toggleCatalog,
  } = useCatalog(currentStore);

  const [copied, setCopied] = useState(false);

  if (!currentStore?.id) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
        <p className="text-3xl">🏪</p>
        <h2 className="mt-2 font-semibold text-amber-800">
          Belum ada toko aktif
        </h2>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Gagal copy. Copy manual: " + publicUrl);
    }
  };

  const handleShareWA = () => {
    const text = `Halo! Cek katalog ${currentStore.name} di sini ya 👇\n${publicUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleOpen = () => {
    window.open(publicUrl, "_blank");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Katalog Online</h1>
        <p className="text-sm text-neutral-500">
          Bagikan link katalog ke pelanggan — mereka bisa lihat & pesan via
          WhatsApp
        </p>
      </div>

      {/* Public link card */}
      <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-100 text-xl">
            🔗
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-green-700">
              Link Katalog Publik Kamu
            </p>
            <p className="mt-1 break-all text-sm font-medium text-neutral-700">
              {publicUrl || "Memuat..."}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={handleCopy}
                disabled={!publicUrl}
                className="rounded-xl bg-white px-3 py-2 text-xs font-medium text-neutral-700 shadow-sm ring-1 ring-neutral-200 hover:bg-neutral-50 disabled:opacity-50"
              >
                {copied ? "✅ Tersalin!" : "📋 Copy Link"}
              </button>
              <button
                onClick={handleShareWA}
                disabled={!publicUrl}
                className="rounded-xl bg-green-600 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
              >
                💬 Share ke WhatsApp
              </button>
              <button
                onClick={handleOpen}
                disabled={!publicUrl}
                className="rounded-xl bg-white px-3 py-2 text-xs font-medium text-neutral-700 shadow-sm ring-1 ring-neutral-200 hover:bg-neutral-50 disabled:opacity-50"
              >
                👁️ Lihat Katalog
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <MiniStat label="Total Produk" value={stats.total} icon="📦" />
        <MiniStat
          label="Tampil di Katalog"
          value={stats.shown}
          icon="🌐"
          accent="green"
        />
        <MiniStat
          label="Belum Ditampilkan"
          value={stats.total - stats.shown}
          icon="🚫"
          accent="amber"
        />
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 pl-9 pr-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </div>
        <span className="ml-auto text-xs text-neutral-400">
          {products.length} produk
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* List */}
      {loading ? (
        <SkeletonList />
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-10 text-center">
          <p className="text-4xl">📦</p>
          <h3 className="mt-2 font-semibold text-neutral-700">
            Belum ada produk
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Tambah produk di halaman Inventory dulu.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <ProductCatalogRow
              key={p.id}
              product={p}
              onToggle={toggleCatalog}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ===== Sub-components =====

function MiniStat({ label, value, icon, accent = "neutral" }) {
  const colors = {
    neutral: "bg-neutral-100 text-neutral-600",
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
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
        <p className="text-xl font-bold text-neutral-800">{value}</p>
      </div>
    </div>
  );
}

function ProductCatalogRow({ product, onToggle }) {
  const [busy, setBusy] = useState(false);

  const handleToggle = async () => {
    setBusy(true);
    try {
      await onToggle(product.id, !product.is_catalog);
    } catch (err) {
      alert("Gagal update: " + err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm transition hover:shadow-md">
      {/* Image */}
      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl text-neutral-300">
            📦
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-medium text-neutral-800">
          {product.name}
        </p>
        <p className="text-xs text-neutral-500">
          {formatCurrency(product.price)}
          {product.category && ` • ${product.category}`}
        </p>
        <div className="mt-1 flex items-center gap-2 text-[10px]">
          <span
            className={`rounded-full px-2 py-0.5 font-medium ${
              product.is_active
                ? "bg-green-50 text-green-700"
                : "bg-neutral-100 text-neutral-500"
            }`}
          >
            {product.is_active ? "Aktif" : "Nonaktif"}
          </span>
          <span className="text-neutral-400">Stok: {product.stock}</span>
        </div>
      </div>

      {/* Toggle */}
      <button
        onClick={handleToggle}
        disabled={busy || !product.is_active}
        title={
          !product.is_active
            ? "Aktifkan produk dulu di Inventory"
            : product.is_catalog
              ? "Sembunyikan dari katalog"
              : "Tampilkan di katalog"
        }
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition disabled:opacity-40 ${
          product.is_catalog ? "bg-green-500" : "bg-neutral-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            product.is_catalog ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-20 animate-pulse rounded-2xl bg-white shadow-sm"
        />
      ))}
    </div>
  );
}