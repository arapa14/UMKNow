<<<<<<< HEAD
import {
  TrendingUp,
  Receipt,
  Package,
  AlertTriangle,
  ShoppingBasket,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

/* ---------------------------------- Dummy data ---------------------------------- */

const STATS = [
  {
    label: "Omzet Hari Ini",
    value: "Rp 1.420.000",
    trend: "+12% dari kemarin",
    icon: TrendingUp,
    highlight: false,
  },
  {
    label: "Total Transaksi",
    value: "38 Transaksi",
    trend: "+5% dari kemarin",
    icon: Receipt,
    highlight: false,
  },
  {
    label: "Produk Terjual",
    value: "84 Pcs",
    trend: "paling laris: Kopi Aren",
    icon: ShoppingBasket,
    highlight: false,
  },
  {
    label: "Stok Menipis",
    value: "3 Barang",
    trend: "Segera restok",
    icon: AlertTriangle,
    highlight: true,
  },
];

const WEEKLY_SALES = [
  { day: "Sen", total: 800000 },
  { day: "Sel", total: 1100000 },
  { day: "Rab", total: 600000 },
  { day: "Kam", total: 1300000 },
  { day: "Jum", total: 1400000, isPeak: true },
  { day: "Sab", total: 1600000 },
  { day: "Min", total: 1500000 },
];

const RECENT_TRANSACTIONS = [
  { id: "#TX-10492", method: "Tunai", status: "Selesai", total: "Rp 45.000" },
  { id: "#TX-10491", method: "QRIS", status: "Selesai", total: "Rp 128.000" },
  { id: "#TX-10490", method: "Transfer Bank", status: "Pending", total: "Rp 210.000" },
];

const LOW_STOCK = [
  { name: "Kopi Arabica Gayo 250g", note: "Tinggal 2 pcs" },
  { name: "Susu UHT Full Cream 1L", note: "Tinggal 1 pcs" },
  { name: "Gula Pasir Rose Brand 1kg", note: "Habis total" },
];

const STATUS_STYLES = {
  Selesai: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
};

function formatShort(value) {
  return `Rp ${(value / 1000).toFixed(0)}k`;
}

/* ---------------------------------- Page ---------------------------------- */
=======
// src/pages/Dashboard.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import StatCard from "../components/features/dashboard/StatCard";
import SalesChart from "../components/features/dashboard/SalesChart";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDateTime } from "../utils/formatDate";
>>>>>>> 7d00f68f1399d5afbd7237fa4377d6e2062a1808

export default function Dashboard() {
  const { user, currentStore } = useAuth();
  const [range, setRange] = useState("today");

  const storeId = currentStore?.id;
  const { loading, error, stats, chart, recentTx, lowStock, refetch } =
    useDashboard(storeId, range);

  const greeting = getGreeting(user?.name || "Pemilik");

  return (
<<<<<<< HEAD
    <div className="flex flex-col gap-6">
      {/* Sapaan */}
      <div>
        <h1 className="text-xl font-semibold text-stone-900">Halo, Toko Berkah!</h1>
        <p className="mt-1 text-sm text-stone-500">Inilah performa toko Anda hari ini.</p>
      </div>

      {/* Kartu statistik */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ label, value, trend, icon: Icon, highlight }) => (
          <div
            key={label}
            className={`rounded-xl border p-5 ${
              highlight
                ? "border-amber-200 bg-amber-50"
                : "border-black/5 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-sm ${
                  highlight ? "text-amber-800" : "text-stone-500"
                }`}
              >
                {label}
              </span>
              <Icon
                size={16}
                className={highlight ? "text-amber-600" : "text-stone-400"}
              />
            </div>
            <p
              className={`mt-2 text-2xl font-semibold ${
                highlight ? "text-amber-800" : "text-stone-900"
              }`}
            >
              {value}
            </p>
            <p
              className={`mt-1 text-xs ${
                highlight ? "text-amber-600" : "text-emerald-600"
              }`}
            >
              {trend}
            </p>
          </div>
        ))}
      </div>

      {/* Chart + Peringatan stok */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Tren penjualan mingguan */}
        <div className="rounded-xl border border-black/5 bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-stone-900">
            Tren Penjualan Mingguan
          </h2>
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_SALES}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#78716c" }}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {WEEKLY_SALES.map((entry) => (
                    <Cell
                      key={entry.day}
                      fill={entry.isPeak ? "#f59e0b" : "#0a3d3a"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peringatan stok habis */}
        <div className="rounded-xl border border-black/5 bg-white p-5">
          <h2 className="text-sm font-semibold text-stone-900">
            Peringatan Stok Habis
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {LOW_STOCK.map((item) => (
              <li key={item.name} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100">
                  <Package size={16} className="text-stone-400" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm text-stone-700">{item.name}</p>
                  <p className="text-xs font-medium text-red-500">{item.note}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-4 w-full rounded-lg bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800 hover:bg-teal-100"
          >
            Belanja Stok / Supplier
          </button>
        </div>
      </div>

      {/* Transaksi terbaru */}
      <div className="rounded-xl border border-black/5 bg-white p-5">
        <h2 className="text-sm font-semibold text-stone-900">Transaksi Terbaru</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-xs text-stone-400">
                <th className="pb-2 font-medium">ID Transaksi</th>
                <th className="pb-2 font-medium">Metode</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="border-b border-black/5 last:border-0">
                  <td className="py-3 text-stone-700">{tx.id}</td>
                  <td className="py-3 text-stone-500">{tx.method}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[tx.status]}`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 text-right font-medium text-stone-900">
                    {tx.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
=======
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{greeting} 👋</h1>
          <p className="text-sm text-neutral-500">
            {currentStore?.name
              ? `Ringkasan usaha ${currentStore.name}`
              : "Pilih toko dulu untuk melihat ringkasan"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-neutral-200 bg-white p-1 shadow-sm">
            {[
              { key: "today", label: "Hari ini" },
              { key: "7d", label: "7 Hari" },
              { key: "30d", label: "30 Hari" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setRange(opt.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  range === opt.key
                    ? "bg-green-600 text-white shadow"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={refetch}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-600 shadow-sm hover:bg-neutral-50"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon="💰"
              label="Penjualan"
              value={formatCurrency(stats?.totalRevenue)}
              sublabel={`${stats?.totalTransactions || 0} transaksi`}
              accent="green"
            />
            <StatCard
              icon="🧾"
              label="Rata-rata Transaksi"
              value={formatCurrency(stats?.avgTransaction)}
              sublabel="per transaksi"
              accent="blue"
            />
            <StatCard
              icon="📦"
              label="Total Produk"
              value={stats?.totalProducts || 0}
              sublabel="produk aktif"
              accent="purple"
            />
            <StatCard
              icon="⚠️"
              label="Stok Menipis"
              value={stats?.lowStockCount || 0}
              sublabel="perlu restock"
              accent={stats?.lowStockCount > 0 ? "red" : "amber"}
            />
          </div>

          {/* Chart + Low Stock */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-neutral-800">
                  Grafik Penjualan
                </h2>
                <span className="text-xs text-neutral-400">
                  {range === "today"
                    ? "Hari ini"
                    : range === "7d"
                      ? "7 hari terakhir"
                      : "30 hari terakhir"}
                </span>
              </div>
              <SalesChart data={chart} />
            </div>

            <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-neutral-800">
                ⚠️ Stok Menipis
              </h2>
              {lowStock.length === 0 ? (
                <p className="text-sm text-neutral-400">Semua stok aman 👍</p>
              ) : (
                <ul className="space-y-3">
                  {lowStock.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between border-b border-neutral-50 pb-2 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-neutral-700">
                          {p.name}
                        </p>
                        <p className="text-xs text-neutral-400">
                          Min: {p.min_stock ?? 5}
                          {p.category ? ` • ${p.category}` : ""}
                        </p>
                      </div>
                      <span className="rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                        {p.stock}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Transaksi Terbaru */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-800">
                🧾 Transaksi Terbaru
              </h2>
              <a
                href="/bookkeeping"
                className="text-xs font-medium text-green-600 hover:text-green-700"
              >
                Lihat semua →
              </a>
            </div>

            {recentTx.length === 0 ? (
              <p className="text-sm text-neutral-400">
                Belum ada transaksi. Mulai jualan di halaman POS 🛒
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 text-left text-xs text-neutral-400">
                      <th className="pb-2 font-medium">Invoice</th>
                      <th className="pb-2 font-medium">Waktu</th>
                      <th className="pb-2 font-medium">Metode</th>
                      <th className="pb-2 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTx.map((tx) => (
                      <tr
                        key={tx.id}
                        className="border-b border-neutral-50 last:border-0"
                      >
                        <td className="py-3 font-medium text-neutral-700">
                          {tx.invoice_no || `#${tx.id}`}
                        </td>
                        <td className="py-3 text-neutral-500">
                          {formatDateTime(tx.created_at)}
                        </td>
                        <td className="py-3">
                          <span className="rounded-lg bg-neutral-100 px-2 py-0.5 text-xs capitalize text-neutral-600">
                            {tx.payment_method || "cash"}
                          </span>
                        </td>
                        <td className="py-3 text-right font-semibold text-neutral-800">
                          {formatCurrency(tx.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: "🛒", label: "Kasir (POS)", href: "/pos" },
              { icon: "📦", label: "Kelola Produk", href: "/inventory" },
              { icon: "🌐", label: "Katalog", href: "/catalog" },
              { icon: "📖", label: "Pembukuan", href: "/bookkeeping" },
            ].map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-100 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="text-2xl">{a.icon}</span>
                <span className="text-xs font-medium text-neutral-700">
                  {a.label}
                </span>
              </a>
            ))}
          </div>
        </>
      )}
>>>>>>> 7d00f68f1399d5afbd7237fa4377d6e2062a1808
    </div>
  );
}

// ==== Helpers ====
function getGreeting(name) {
  const hour = new Date().getHours();
  let time = "Selamat pagi";
  if (hour >= 11 && hour < 15) time = "Selamat siang";
  else if (hour >= 15 && hour < 19) time = "Selamat sore";
  else if (hour >= 19 || hour < 4) time = "Selamat malam";
  return `${time}, ${name}`;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-white shadow-sm"
          />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-white shadow-sm" />
      <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm" />
    </div>
  );
}
