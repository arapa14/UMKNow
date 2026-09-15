// src/pages/POS.jsx
import { useState } from "react";
import { ShoppingCart, Store, Search } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { usePOS } from "../hooks/usePOS";
import ProductGrid from "../components/features/pos/ProductGrid";
import CartItem from "../components/features/pos/CartItem";
import PaymentModal from "../components/features/pos/PaymentModal";
import ReceiptPreview from "../components/features/pos/ReceiptPreview";
import { formatCurrency } from "../utils/formatCurrency";

export default function POS() {
  const { currentStore } = useAuth();
  const storeId = currentStore?.id;

  const {
    products,
    categories,
    loading,
    error,
    search,
    setSearch,
    category,
    setCategory,
    cart,
    cartCount,
    subtotal,
    addToCart,
    increment,
    decrement,
    setQty,
    removeFromCart,
    clearCart,
    submitCheckout,
    submitting,
  } = usePOS(storeId);

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [lastTx, setLastTx] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  if (!storeId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center flex flex-col items-center">
        <Store size={48} strokeWidth={1.5} className="text-amber-300" />
        <h2 className="mt-2 font-semibold text-amber-800">
          Belum ada toko aktif
        </h2>
        <p className="mt-1 text-sm text-amber-700">
          Pilih atau buat toko terlebih dahulu.
        </p>
      </div>
    );
  }

  const handleConfirmPayment = async (payment) => {
    try {
      const tx = await submitCheckout(payment);
      setPaymentOpen(false);
      setLastTx(tx);
      setReceiptOpen(true);
      setMobileCartOpen(false);
    } catch (err) {
      alert("Checkout gagal: " + err.message);
    }
  };

  const handleClearCart = () => {
    if (cart.length > 0 && !window.confirm("Kosongkan cart?")) return;
    clearCart();
  };

  return (
    <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
      {/* ==== Kiri: Produk ==== */}
      <div className="flex flex-col gap-4">
        {/* Header mobile */}
        <div className="flex items-center justify-between lg:hidden">
          <h1 className="text-xl font-bold text-neutral-800">Kasir</h1>
          <button
            onClick={() => setMobileCartOpen(true)}
            className="relative flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-medium text-white"
          >
            <ShoppingCart size={16} /> Cart ({cartCount})
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
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
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Grid produk */}
        <ProductGrid products={products} loading={loading} onPick={addToCart} />
      </div>

      {/* ==== Kanan: Cart (desktop) ==== */}
      <aside className="hidden flex-col rounded-2xl border border-neutral-100 bg-white shadow-sm lg:flex">
        <CartPanel
          cart={cart}
          subtotal={subtotal}
          cartCount={cartCount}
          onIncrement={increment}
          onDecrement={decrement}
          onRemove={removeFromCart}
          onSetQty={setQty}
          onClear={handleClearCart}
          onCheckout={() => setPaymentOpen(true)}
        />
      </aside>

      {/* ==== Cart drawer (mobile) ==== */}
      {mobileCartOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setMobileCartOpen(false)}
          />
          <div className="flex w-full max-w-sm flex-col bg-white shadow-xl">
            <CartPanel
              cart={cart}
              subtotal={subtotal}
              cartCount={cartCount}
              onIncrement={increment}
              onDecrement={decrement}
              onRemove={removeFromCart}
              onSetQty={setQty}
              onClear={handleClearCart}
              onCheckout={() => setPaymentOpen(true)}
              onClose={() => setMobileCartOpen(false)}
              mobile
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        total={subtotal}
        onConfirm={handleConfirmPayment}
        submitting={submitting}
      />

      <ReceiptPreview
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        transaction={lastTx}
        store={currentStore}
      />
    </div>
  );
}

// ===== Cart Panel =====
function CartPanel({
  cart,
  subtotal,
  cartCount,
  onIncrement,
  onDecrement,
  onRemove,
  onSetQty,
  onClear,
  onCheckout,
  onClose,
  mobile,
}) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <ShoppingCart size={20} className="text-emerald-600" />
          <h2 className="font-semibold text-neutral-800">
            Cart{mobile && ` (${cartCount})`}
          </h2>
          {!mobile && cartCount > 0 && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
              {cartCount} item
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {cart.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs text-neutral-400 hover:text-red-500"
            >
              Kosongkan
            </button>
          )}
          {mobile && (
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4">
        {cart.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-10 text-center">
            <ShoppingCart size={48} strokeWidth={1.5} className="text-neutral-300" />
            <p className="mt-4 text-sm text-neutral-400">
              Klik produk untuk menambahkan
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <CartItem
              key={item.product_id}
              item={item}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onRemove={onRemove}
              onSetQty={onSetQty}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-100 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-neutral-500">Subtotal</span>
          <span className="text-lg font-bold text-neutral-800">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <button
          onClick={onCheckout}
          disabled={cart.length === 0}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
        >
          Bayar • {formatCurrency(subtotal)}
        </button>
      </div>
    </>
  );
}