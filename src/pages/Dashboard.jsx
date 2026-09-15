// src/pages/Dashboard.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import StatCard from "../components/features/dashboard/StatCard";
import SalesChart from "../components/features/dashboard/SalesChart";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDateTime } from "../utils/formatDate";
import {
  TrendingUp,
  ArrowLeftRight,
  Package,
  AlertTriangle,
  ShoppingCart,
  Box,
  Globe,
  BookOpen,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";

export default function Dashboard() {
  const { user, currentStore } = useAuth();
  const [range, setRange] = useState("today");

  const storeId = currentStore?.id;
  const { loading, error, stats, chart, recentTx, lowStock, refetch } =
    useDashboard(storeId, range);

  const greeting = getGreeting(user?.name || "Pemilik");

  const RANGE_OPTIONS = [
    { key: "today", label: "Hari ini" },
    { key: "7d", label: "7 Hari" },
    { key: "30d", label: "30 Hari" },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting}</h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            {currentStore?.name
              ? `Ringkasan usaha ${currentStore.name}`
              : "Pilih toko dulu untuk melihat ringkasan"}
          </p>
        </div>

        {/* Filter & Refresh */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Segmented control */}
          <div className="flex rounded-xl border border-neutral-200 bg-white p-1 shadow-sm">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setRange(opt.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                  range === opt.key
                    ? "bg-[#0a3d3a] text-white shadow-sm"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Tombol Refresh */}
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-600 shadow-sm hover:bg-neutral-50 hover:text-neutral-800 transition-all duration-150 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Loading / Content ── */}
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Stat Cards — 1 kolom di mobile, 2 kolom di sm, 4 kolom di lg */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              Icon={TrendingUp}
              label="Penjualan"
              value={formatCurrency(stats?.totalRevenue)}
              sublabel={`${stats?.totalTransactions || 0} transaksi`}
              accent="green"
            />
            <StatCard
              Icon={ArrowLeftRight}
              label="Rata-rata Transaksi"
              value={formatCurrency(stats?.avgTransaction)}
              sublabel="per transaksi"
              accent="blue"
            />
            <StatCard
              Icon={Package}
              label="Total Produk"
              value={stats?.totalProducts || 0}
              sublabel="produk aktif"
              accent="purple"
            />
            <StatCard
              Icon={AlertTriangle}
              label="Stok Menipis"
              value={stats?.lowStockCount || 0}
              sublabel="perlu restock"
              accent={stats?.lowStockCount > 0 ? "red" : "amber"}
            />
          </div>

          {/* Grafik + Stok Menipis */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Grafik Penjualan */}
            <div className="lg:col-span-2 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-neutral-800">
                  Grafik Penjualan
                </h2>
                <span className="rounded-lg bg-neutral-50 px-2 py-1 text-xs font-medium text-neutral-400 border border-neutral-100">
                  {range === "today"
                    ? "Hari ini"
                    : range === "7d"
                      ? "7 hari terakhir"
                      : "30 hari terakhir"}
                </span>
              </div>
              <SalesChart data={chart} />
            </div>

            {/* Stok Menipis */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <TriangleAlert size={15} className="text-amber-500" />
                <h2 className="font-semibold text-neutral-800">Stok Menipis</h2>
              </div>
              {lowStock.length === 0 ? (
                <p className="text-sm text-neutral-400">Semua stok aman</p>
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
                          {p.category ? ` · ${p.category}` : ""}
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
                Transaksi Terbaru
              </h2>
              <a
                href="/bookkeeping"
                className="text-xs font-medium text-[#0a3d3a] hover:text-green-700 transition-colors"
              >
                Lihat semua →
              </a>
            </div>

            {recentTx.length === 0 ? (
              <p className="text-sm text-neutral-400">
                Belum ada transaksi. Mulai jualan di halaman POS.
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
                        className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors"
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              { Icon: ShoppingCart, label: "Kasir (POS)", href: "/pos", accent: "text-green-600 bg-green-50" },
              { Icon: Box, label: "Kelola Produk", href: "/inventory", accent: "text-blue-600 bg-blue-50" },
              { Icon: Globe, label: "Katalog", href: "/catalog", accent: "text-purple-600 bg-purple-50" },
              { Icon: BookOpen, label: "Pembukuan", href: "/bookkeeping", accent: "text-amber-600 bg-amber-50" },
            ].map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="group flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-neutral-100 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.accent} transition-transform duration-200 group-hover:scale-110`}>
                  <a.Icon size={18} strokeWidth={2} />
                </div>
                <span className="text-xs font-medium text-neutral-700">
                  {a.label}
                </span>
              </a>
            ))}
          </div>
        </>
      )}
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-white shadow-sm border border-neutral-100"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 h-72 animate-pulse rounded-2xl bg-white shadow-sm border border-neutral-100" />
        <div className="h-72 animate-pulse rounded-2xl bg-white shadow-sm border border-neutral-100" />
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm border border-neutral-100" />
    </div>
  );
}