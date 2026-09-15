// src/services/posService.js
import supabase from "../lib/supabase-client";

export async function generateInvoiceNo(storeId) {
  const { data, error } = await supabase.rpc("generate_invoice_no", {
    p_store_id: storeId,
  });
  if (error) throw error;
  return data;
}

export async function checkout({ storeId, items, payment }) {
  if (!storeId) throw new Error("Store belum dipilih");
  if (!items || items.length === 0) throw new Error("Cart masih kosong");

  // Normalisasi items — TANPA cost_price
  const normalizedItems = items.map((it) => ({
    product_id: it.product_id ?? null,
    product_name: it.product_name ?? "",
    price: Number(it.price) || 0,
    cost_price: 0, // ⬅️ Set 0 — HPP tidak diketahui
    quantity: Number(it.quantity) || 0,
  }));

  const normalizedPayment = {
    method: payment?.method || "cash",
    paid_amount: Number(payment?.paid_amount) || 0,
    discount: Number(payment?.discount) || 0,
    tax: Number(payment?.tax) || 0,
    notes: payment?.notes || null,
  };

  const { data, error } = await supabase.rpc("checkout_transaction", {
    p_store_id: storeId,
    p_items: normalizedItems,
    p_payment: normalizedPayment,
  });

  if (error) {
    console.error("checkout_transaction RPC error:", error);
    throw new Error(error.message || "Checkout gagal");
  }

  return data;
}

export async function getPosProducts(
  storeId,
  { search = "", category = "" } = {},
) {
  if (!storeId) return [];

  let q = supabase
    .from("products")
    .select("id, name, price, stock, min_stock, category, image_url, is_active")
    //           ⬆️ cost DIHAPUS
    .eq("store_id", storeId)
    .eq("is_active", true)
    .gt("stock", 0)
    .order("name", { ascending: true });

  if (category) q = q.eq("category", category);
  if (search) q = q.ilike("name", `%${search}%`);

  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}
