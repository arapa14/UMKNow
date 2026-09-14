// src/services/dashboardService.js
import supabase from "../lib/supabase-client";

/**
 * Ambil ringkasan statistik dashboard untuk toko tertentu
 * @param {number} storeId
 * @param {'today'|'7d'|'30d'} range
 */
export async function getDashboardStats(storeId, range = "today") {
  const { startDate, endDate } = getDateRange(range);

  // Total penjualan & jumlah transaksi
  // CATATAN: kolomnya `total`, bukan `total_amount`
  const { data: transactions, error: txError } = await supabase
    .from("transactions")
    .select("id, total, created_at, status")
    .eq("store_id", storeId)
    .gte("created_at", startDate)
    .lte("created_at", endDate);

  if (txError) throw txError;

  // Filter status: hanya hitung transaksi yang bukan void/cancel (opsional)
  const validTx = (transactions || []).filter(
    (t) => !["void", "cancelled", "canceled"].includes(t.status),
  );

  const totalRevenue = validTx.reduce(
    (sum, t) => sum + (Number(t.total) || 0),
    0,
  );
  const totalTransactions = validTx.length;
  const avgTransaction = totalTransactions
    ? totalRevenue / totalTransactions
    : 0;

  // Jumlah produk & stok menipis
  const { data: products, error: prodError } = await supabase
    .from("products")
    .select("id, stock, min_stock, is_active")
    .eq("store_id", storeId)
    .eq("is_active", true); // hanya produk aktif

  if (prodError) throw prodError;

  const totalProducts = products?.length || 0;
  const lowStockCount =
    products?.filter((p) => {
      const min = Number(p.min_stock ?? 5);
      return Number(p.stock) <= min;
    }).length || 0;

  return {
    totalRevenue,
    totalTransactions,
    avgTransaction,
    totalProducts,
    lowStockCount,
  };
}

/**
 * Grafik penjualan per hari
 */
export async function getSalesChart(storeId, days = 7) {
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("transactions")
    .select("total, created_at, status")
    .eq("store_id", storeId)
    .gte("created_at", start.toISOString())
    .order("created_at", { ascending: true });

  if (error) throw error;

  // Group per hari
  const map = new Map();
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = toDateKey(d);
    map.set(key, 0);
  }

  data?.forEach((tx) => {
    if (["void", "cancelled", "canceled"].includes(tx.status)) return;
    const key = toDateKey(new Date(tx.created_at));
    if (map.has(key)) {
      map.set(key, map.get(key) + (Number(tx.total) || 0));
    }
  });

  return Array.from(map.entries()).map(([date, total]) => ({
    date,
    total,
  }));
}

/**
 * Transaksi terbaru
 * Kolom: invoice_no, total, payment_method, created_at
 */
export async function getRecentTransactions(storeId, limit = 5) {
  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      id,
      invoice_no,
      total,
      payment_method,
      status,
      created_at
    `,
    )
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/**
 * Produk dengan stok menipis
 * Skema kamu tidak punya `unit`, jadi kita drop field itu
 */
export async function getLowStockProducts(storeId, limit = 5) {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, stock, min_stock, category")
    .eq("store_id", storeId)
    .eq("is_active", true)
    .order("stock", { ascending: true })
    .limit(limit);

  if (error) throw error;

  return (data || []).filter((p) => {
    const min = Number(p.min_stock ?? 5);
    return Number(p.stock) <= min;
  });
}

// ===== Helpers =====
function getDateRange(range) {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (range === "7d") start.setDate(start.getDate() - 6);
  if (range === "30d") start.setDate(start.getDate() - 29);

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
}

// Local date key (YYYY-MM-DD) supaya tidak kena timezone shift
function toDateKey(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
