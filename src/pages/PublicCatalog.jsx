// src/pages/PublicCatalog.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicCatalogBySlug } from "../services/publicCatalogService";
import { formatCurrency } from "../utils/formatCurrency";

export default function PublicCatalog() {
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    let ignore = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { store: s, products: p } = await getPublicCatalogBySlug(slug);
        if (ignore) return;
        setStore(s);
        setProducts(p);
      } catch (err) {
        if (ignore) return;
        console.error("PublicCatalog error:", err);
        setError(err.message || "Gagal memuat katalog");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [slug]);

  // Derived
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => p.category && set.add(p.category));
    return [...set].sort();
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (category) list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [products, category, search]);

  const waLink = (product) => {
    const phone = String(store?.phone || "").replace(/\D/g, "");
    const normalized = phone.startsWith("0")
      ? "62" + phone.slice(1)
      : phone.startsWith("62")
        ? phone
        : phone;
    const text = `Halo ${store?.name}, saya mau pesan:\n\n*${product.name}*\nHarga: ${formatCurrency(product.price)}\n\nApakah tersedia?`;
    return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
  };

  // ===== Loading =====
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5ef]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          <p className="mt-3 text-sm text-neutral-500">Memuat katalog...</p>
        </div>
      </div>
    );
  }

  // ===== Not found =====
  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5ef] px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-5xl">🔍</p>
          <h1 className="mt-3 text-lg font-bold text-neutral-800">
            Toko Tidak Ditemukan
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Link katalog mungkin salah atau toko sudah tidak aktif.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] pb-20">
      {/* ==== Hero ==== */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 px-4 pb-16 pt-10 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/20 backdrop-blur">
              {store.logo_url ? (
                <img
                  src={store.logo_url}
                  alt={store.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold">
                  {store.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-2xl font-bold">{store.name}</h1>
              {store.category && (
                <span className="mt-1 inline-block rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">
                  {store.category}
                </span>
              )}
            </div>
          </div>

          {store.description && (
            <p className="mt-4 max-w-2xl text-sm text-white/90">
              {store.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/90">
            {store.address && (
              <span className="flex items-center gap-1">
                📍 {store.address}
              </span>
            )}
            {store.phone && (
              <a
                href={`https://wa.me/${String(store.phone).replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
              >
                📱 {store.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ==== Content ==== */}
      <div className="mx-auto -mt-10 max-w-4xl px-4">
        {/* Search & filter */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-3 shadow-md">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="🔍 Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-green-500"
            />
            {categories.length > 0 && (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-green-500 sm:max-w-[180px]"
              >
                <option value="">Semua</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Products */}
        {filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-neutral-200 bg-white p-10 text-center">
            <p className="text-4xl">🛒</p>
            <p className="mt-2 font-medium text-neutral-700">
              {products.length === 0
                ? "Belum ada produk di katalog"
                : "Produk tidak ditemukan"}
            </p>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                waHref={waLink(p)}
                hasPhone={!!store.phone}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-neutral-400">
          <p>Katalog ini dibuat dengan</p>
          <p className="mt-1 font-semibold text-neutral-600">🏪 UMKNow</p>
        </div>
      </div>
    </div>
  );
}

// ===== Product Card =====
function ProductCard({ product, waHref, hasPhone }) {
  const outOfStock = Number(product.stock) <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-neutral-300">
            📦
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-red-600">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <p className="line-clamp-2 text-sm font-medium text-neutral-800">
          {product.name}
        </p>
        {product.category && (
          <p className="mt-0.5 text-[10px] uppercase tracking-wide text-neutral-400">
            {product.category}
          </p>
        )}
        <p className="mt-2 text-base font-bold text-green-600">
          {formatCurrency(product.price)}
        </p>

        <a
          href={hasPhone ? waHref : undefined}
          target={hasPhone ? "_blank" : undefined}
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!hasPhone || outOfStock) e.preventDefault();
          }}
          className={`mt-3 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
            outOfStock || !hasPhone
              ? "cursor-not-allowed bg-neutral-100 text-neutral-400"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {outOfStock ? (
            "Stok Habis"
          ) : hasPhone ? (
            <>
              <span>💬</span> Pesan via WA
            </>
          ) : (
            "Toko belum ada WA"
          )}
        </a>
      </div>
    </div>
  );
}