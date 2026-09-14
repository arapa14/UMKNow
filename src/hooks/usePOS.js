// src/hooks/usePOS.js
import { useCallback, useEffect, useMemo, useState } from "react";
import { checkout, getPosProducts } from "../services/posService";

export function usePOS(storeId) {
  // Products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // Cart
  const [cart, setCart] = useState([]);

  // Checkout
  const [submitting, setSubmitting] = useState(false);

  // ===== Fetch products =====
  useEffect(() => {
    if (!storeId) return;
    let ignore = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPosProducts(storeId, { search, category });
        if (ignore) return;
        setProducts(data);
      } catch (err) {
        if (ignore) return;
        console.error("usePOS fetch error:", err);
        setError(err.message || "Gagal memuat produk");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [storeId, search, category, refreshKey]);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  // ===== Derived =====
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => p.category && set.add(p.category));
    return [...set].sort();
  }, [products]);

  const cartCount = useMemo(
    () => cart.reduce((s, it) => s + it.quantity, 0),
    [cart],
  );

  const subtotal = useMemo(
    () => cart.reduce((s, it) => s + it.price * it.quantity, 0),
    [cart],
  );

  // ===== Cart actions =====
  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((it) => it.product_id === product.id);
      if (existing) {
        // Jangan melebihi stok
        if (existing.quantity + 1 > product.stock) return prev;
        return prev.map((it) =>
          it.product_id === product.id
            ? { ...it, quantity: it.quantity + 1 }
            : it,
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          product_name: product.name,
          price: Number(product.price),
          cost_price: 0, // isi kalau ada kolom cost di products
          quantity: 1,
          stock: product.stock,
        },
      ];
    });
  }, []);

  const setQty = useCallback((productId, qty) => {
    setCart((prev) =>
      prev
        .map((it) => {
          if (it.product_id !== productId) return it;
          const max = it.stock ?? Infinity;
          const next = Math.max(0, Math.min(Number(qty) || 0, max));
          return { ...it, quantity: next };
        })
        .filter((it) => it.quantity > 0),
    );
  }, []);

  const increment = useCallback((productId) => {
    setCart((prev) =>
      prev.map((it) =>
        it.product_id === productId
          ? { ...it, quantity: Math.min(it.quantity + 1, it.stock ?? Infinity) }
          : it,
      ),
    );
  }, []);

  const decrement = useCallback((productId) => {
    setCart((prev) =>
      prev
        .map((it) =>
          it.product_id === productId
            ? { ...it, quantity: Math.max(0, it.quantity - 1) }
            : it,
        )
        .filter((it) => it.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((it) => it.product_id !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // ===== Checkout =====
  const submitCheckout = useCallback(
    async (payment) => {
      if (!storeId) throw new Error("Store belum dipilih");
      if (cart.length === 0) throw new Error("Cart kosong");

      setSubmitting(true);
      try {
        const result = await checkout({
          storeId,
          items: cart,
          payment,
        });
        clearCart();
        refetch(); // refresh produk karena stok berubah
        return result;
      } finally {
        setSubmitting(false);
      }
    },
    [storeId, cart, clearCart, refetch],
  );

  return {
    // products
    products,
    categories,
    loading,
    error,
    refetch,
    // filters
    search,
    setSearch,
    category,
    setCategory,
    // cart
    cart,
    cartCount,
    subtotal,
    addToCart,
    setQty,
    increment,
    decrement,
    removeFromCart,
    clearCart,
    // checkout
    submitCheckout,
    submitting,
  };
}
