// src/services/posService.js
import supabase from "../lib/supabase-client";

/**
 * Generate invoice number: INV-YYYYMMDD-NNN
 * NNN = urutan transaksi hari ini untuk store ini
 */
async function generateInvoiceNo(storeId) {
  const today = new Date();
  const ymd =
    today.getFullYear() +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0");

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("transactions")
    .select("id", { count: "exact", head: true })
    .eq("store_id", storeId)
    .gte("created_at", startOfDay.toISOString());

  if (error) throw error;

  const seq = String((count || 0) + 1).padStart(3, "0");
  return `INV-${ymd}-${seq}`;
}

/**
 * Checkout — insert transaction + items + bookkeeping + potong stok
 *
 * @param {Object} params
 * @param {number} params.storeId
 * @param {Array}  params.items      - [{ product_id, product_name, price, cost_price, quantity, subtotal }]
 * @param {Object} params.payment    - { method, paid_amount, discount, tax, notes }
 * @returns {Object} transaction lengkap
 */
export async function checkout({ storeId, items, payment }) {
  if (!storeId) throw new Error("Store belum dipilih");
  if (!items || items.length === 0) throw new Error("Cart masih kosong");

  // 1. Hitung total
  const subtotal = items.reduce(
    (sum, it) => sum + Number(it.price) * Number(it.quantity),
    0,
  );
  const discount = Number(payment.discount || 0);
  const tax = Number(payment.tax || 0);
  const total = Math.max(0, subtotal - discount + tax);
  const paidAmount = Number(payment.paid_amount || total);
  const changeAmount = Math.max(0, paidAmount - total);

  // 2. Generate invoice
  const invoiceNo = await generateInvoiceNo(storeId);

  // 3. Insert transaction header
  const { data: tx, error: txErr } = await supabase
    .from("transactions")
    .insert({
      store_id: storeId,
      invoice_no: invoiceNo,
      subtotal,
      discount,
      tax,
      total,
      paid_amount: paidAmount,
      change_amount: changeAmount,
      payment_method: payment.method || "cash",
      status: "paid",
      source: "pos",
      notes: payment.notes || null,
      transaction_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (txErr) throw txErr;

  // 4. Insert transaction_items
  const itemRows = items.map((it) => ({
    transaction_id: tx.id,
    product_id: it.product_id,
    product_name: it.product_name,
    price: Number(it.price),
    cost_price: Number(it.cost_price || 0),
    quantity: Number(it.quantity),
    subtotal: Number(it.price) * Number(it.quantity),
  }));

  const { error: itemErr } = await supabase
    .from("transaction_items")
    .insert(itemRows);

  if (itemErr) throw itemErr;

  // 5. Insert bookkeeping (auto laporan laba-rugi)
  const cogs = items.reduce(
    (sum, it) => sum + Number(it.cost_price || 0) * Number(it.quantity),
    0,
  );
  const grossProfit = subtotal - cogs;
  const netProfit = grossProfit - discount;

  const { error: bkErr } = await supabase.from("bookkeeping").insert({
    store_id: storeId,
    transaction_id: tx.id,
    period_date: new Date().toISOString().slice(0, 10),
    type: "sales",
    category: "pos",
    revenue: subtotal,
    cogs,
    gross_profit: grossProfit,
    expenses: discount,
    net_profit: netProfit,
    description: `POS ${invoiceNo}`,
    created_at: new Date().toISOString(),
  });

  if (bkErr) throw bkErr;

  // 6. Potong stok tiap produk (via RPC atau manual)
  // Cara simpel: update satu per satu. Untuk volume tinggi, ganti dengan RPC.
  for (const it of items) {
    if (!it.product_id) continue;
    // Ambil stok dulu
    const { data: prod } = await supabase
      .from("products")
      .select("stock")
      .eq("id", it.product_id)
      .maybeSingle();

    if (prod) {
      const newStock = Math.max(0, Number(prod.stock) - Number(it.quantity));
      await supabase
        .from("products")
        .update({ stock: newStock, updated_at: new Date().toISOString() })
        .eq("id", it.product_id);
    }
  }

  return { ...tx, items: itemRows };
}

/**
 * Ambil produk untuk POS (hanya yang aktif & stok > 0)
 */
export async function getPosProducts(
  storeId,
  { search = "", category = "" } = {},
) {
  if (!storeId) return [];

  let q = supabase
    .from("products")
    .select("id, name, price, stock, min_stock, category, image_url, is_active")
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