// src/services/bookkeepingService.js
import supabase from "../lib/supabase-client";

/**
 * Ambil laporan laba-rugi agregat dari tabel bookkeeping
 * @param {number} storeId
 * @param {{startDate: string, endDate: string}} range - ISO strings
 */
export async function getProfitLossReport(storeId, { startDate, endDate }) {
  if (!storeId) throw new Error("storeId wajib");

  const { data, error } = await supabase
    .from("bookkeeping")
    .select(
      "id, transaction_id, period_date, type, category, revenue, cogs, gross_profit, expenses, net_profit",
    )
    .eq("store_id", storeId)
    .gte("period_date", startDate)
    .lte("period_date", endDate)
    .order("period_date", { ascending: true });

  if (error) throw error;

  const rows = data || [];
  const summary = rows.reduce(
    (acc, r) => ({
      revenue: acc.revenue + Number(r.revenue || 0),
      cogs: acc.cogs + Number(r.cogs || 0),
      grossProfit: acc.grossProfit + Number(r.gross_profit || 0),
      expenses: acc.expenses + Number(r.expenses || 0),
      netProfit: acc.netProfit + Number(r.net_profit || 0),
      count: acc.count + 1,
    }),
    {
      revenue: 0,
      cogs: 0,
      grossProfit: 0,
      expenses: 0,
      netProfit: 0,
      count: 0,
    },
  );

  // Breakdown per hari (untuk grafik)
  const byDay = new Map();
  rows.forEach((r) => {
    const key = r.period_date;
    const curr = byDay.get(key) || {
      date: key,
      revenue: 0,
      cogs: 0,
      grossProfit: 0,
      netProfit: 0,
    };
    curr.revenue += Number(r.revenue || 0);
    curr.cogs += Number(r.cogs || 0);
    curr.grossProfit += Number(r.gross_profit || 0);
    curr.netProfit += Number(r.net_profit || 0);
    byDay.set(key, curr);
  });

  return {
    summary,
    byDay: [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date)),
    rows,
  };
}

/**
 * Ambil ringkasan transaksi + breakdown metode bayar
 */
export async function getTransactionSummary(storeId, { startDate, endDate }) {
  if (!storeId) throw new Error("storeId wajib");

  const { data, error } = await supabase
    .from("transactions")
    .select(
      "id, invoice_no, total, subtotal, discount, tax, payment_method, status, source, created_at",
    )
    .eq("store_id", storeId)
    .gte("created_at", startDate)
    .lte("created_at", endDate)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const valid = (data || []).filter(
    (t) => !["void", "cancelled", "canceled"].includes(t.status),
  );

  const totalRevenue = valid.reduce((s, t) => s + Number(t.total || 0), 0);
  const totalTransactions = valid.length;
  const avgOrderValue = totalTransactions
    ? totalRevenue / totalTransactions
    : 0;

  // Breakdown metode bayar
  const byMethod = {};
  valid.forEach((t) => {
    const m = t.payment_method || "other";
    byMethod[m] = (byMethod[m] || 0) + Number(t.total || 0);
  });

  // Breakdown per jam
  const byHour = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    count: 0,
    revenue: 0,
  }));
  valid.forEach((t) => {
    const h = new Date(t.created_at).getHours();
    byHour[h].count += 1;
    byHour[h].revenue += Number(t.total || 0);
  });

  return {
    transactions: valid,
    totalRevenue,
    totalTransactions,
    avgOrderValue,
    byMethod,
    byHour,
  };
}

/**
 * Ambil top produk terlaris
 */
export async function getTopProducts(
  storeId,
  { startDate, endDate, limit = 5 },
) {
  if (!storeId) return [];

  // Ambil transaction_ids dalam periode
  const { data: txs, error: txErr } = await supabase
    .from("transactions")
    .select("id")
    .eq("store_id", storeId)
    .gte("created_at", startDate)
    .lte("created_at", endDate);

  if (txErr) throw txErr;
  const txIds = (txs || []).map((t) => t.id);
  if (txIds.length === 0) return [];

  // Ambil items
  const { data: items, error: itemErr } = await supabase
    .from("transaction_items")
    .select("product_id, product_name, quantity, subtotal, cost_price, price")
    .in("transaction_id", txIds);

  if (itemErr) throw itemErr;

  // Aggregate by product_id (fallback: product_name)
  const map = new Map();
  (items || []).forEach((it) => {
    const key = it.product_id ?? `name:${it.product_name}`;
    const curr = map.get(key) || {
      product_id: it.product_id,
      product_name: it.product_name,
      qty: 0,
      revenue: 0,
      profit: 0,
    };
    curr.qty += Number(it.quantity || 0);
    curr.revenue += Number(it.subtotal || 0);
    curr.profit +=
      (Number(it.price || 0) - Number(it.cost_price || 0)) *
      Number(it.quantity || 0);
    map.set(key, curr);
  });

  const sorted = [...map.values()].sort((a, b) => b.qty - a.qty);
  return sorted.slice(0, limit);
}

/**
 * Ambil detail 1 transaksi + items (untuk modal detail)
 */
export async function getTransactionDetail(transactionId) {
  const { data: tx, error: txErr } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", transactionId)
    .maybeSingle();

  if (txErr) throw txErr;

  const { data: items, error: itemErr } = await supabase
    .from("transaction_items")
    .select("*")
    .eq("transaction_id", transactionId);

  if (itemErr) throw itemErr;

  return { ...tx, items: items || [] };
}

/**
 * Export CSV string dari array transaksi
 */
export function transactionsToCSV(transactions) {
  const headers = [
    "Invoice",
    "Tanggal",
    "Metode",
    "Status",
    "Subtotal",
    "Diskon",
    "Pajak",
    "Total",
  ];
  const rows = transactions.map((t) => [
    t.invoice_no || "",
    new Date(t.created_at).toLocaleString("id-ID"),
    t.payment_method || "",
    t.status || "",
    t.subtotal || 0,
    t.discount || 0,
    t.tax || 0,
    t.total || 0,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => {
          const s = String(cell ?? "");
          return s.includes(",") || s.includes('"') || s.includes("\n")
            ? `"${s.replace(/"/g, '""')}"`
            : s;
        })
        .join(","),
    )
    .join("\n");

  return csv;
}
