// src/hooks/useProducts.js
import { useCallback, useEffect, useState } from "react";
import {
  getProducts,
  getProductCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
} from "../services/productService";

export function useProducts(storeId, filters = {}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { search = "", category = "", onlyActive = true } = filters;

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    // ⛔ Jangan setState di sini kalau storeId kosong
    // Biarkan loading sebagai derived, bukan di-set manual
    if (!storeId) return;

    let ignore = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [data, cats] = await Promise.all([
          getProducts(storeId, { search, category, onlyActive }),
          getProductCategories(storeId),
        ]);
        if (ignore) return;
        setProducts(data);
        setCategories(cats);
      } catch (err) {
        if (ignore) return;
        console.error("useProducts error:", err);
        setError(err.message || "Gagal memuat produk");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [storeId, search, category, onlyActive, refreshKey]);

  // ===== Actions =====
  const add = async (payload) => {
    const created = await createProduct({ ...payload, store_id: storeId });
    refetch();
    return created;
  };

  const edit = async (id, payload) => {
    const updated = await updateProduct(id, payload);
    refetch();
    return updated;
  };

  const remove = async (id) => {
    await deleteProduct(id);
    refetch();
  };

  const adjust = async (id, delta) => {
    const updated = await adjustStock(id, delta);
    refetch();
    return updated;
  };

  return {
    products,
    categories,
    loading,
    error,
    refetch,
    add,
    edit,
    remove,
    adjust,
  };
}