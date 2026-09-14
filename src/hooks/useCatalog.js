// src/hooks/useCatalog.js
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllProductsForCatalog,
  setProductCatalogFlag,
  ensureStoreSlug,
} from "../services/catalogService";

export function useCatalog(store) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    if (!store?.id) return;
    let ignore = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Kalau slug belum ada, generate
        if (!store.slug) {
          await ensureStoreSlug(store.id, store.name);
          // Reload halaman supaya currentStore dapat slug baru
          window.location.reload();
          return;
        }

        const data = await getAllProductsForCatalog(store.id);
        if (ignore) return;
        setProducts(data);
      } catch (err) {
        if (ignore) return;
        console.error("useCatalog error:", err);
        setError(err.message || "Gagal memuat katalog");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [store?.id, store?.slug, store?.name, refreshKey]);

  // ===== Derived =====
  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, search]);

  const stats = useMemo(() => {
    const total = products.length;
    const shown = products.filter((p) => p.is_catalog).length;
    return { total, shown };
  }, [products]);

  const publicUrl = store?.slug
    ? `${window.location.origin}/toko/${store.slug}`
    : "";

  // ===== Actions =====
  const toggleCatalog = async (productId, next) => {
    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, is_catalog: next } : p)),
    );
    try {
      await setProductCatalogFlag(productId, next);
    } catch (err) {
      // Rollback
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, is_catalog: !next } : p)),
      );
      throw err;
    }
  };

  return {
    products: filtered,
    loading,
    error,
    search,
    setSearch,
    stats,
    publicUrl,
    refetch,
    toggleCatalog,
  };
}
