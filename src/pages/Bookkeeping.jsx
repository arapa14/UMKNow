// src/pages/Bookkeeping.jsx
import { useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useBookkeeping, getDateRange } from "../hooks/useBookkeeping";
import PeriodFilter from "../components/features/bookkeeping/PeriodFilter";
import PLSummary from "../components/features/bookkeeping/PLSummary";
import RevenueChart from "../components/features/bookkeeping/RevenueChart";
import TopProducts from "../components/features/bookkeeping/TopProducts";
import TransactionTable from "../components/features/bookkeeping/TransactionTable";
import TransactionDetailModal from "../components/features/bookkeeping/TransactionDetailModal";
import { transactionsToCSV } from "../services/bookkeepingService";

export default function Bookkeeping() {
  const { currentStore } = useAuth();
  const storeId = currentStore?.id;

  const [preset, setPreset] = useState("7d");
  const [customRange, setCustomRange] = useState(() => {
    const now = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 6);
    return {
      startDate: start.toISOString().slice(0, 10),
      endDate: now.toISOString().slice(0, 10),
    };
  });

  const range = useMemo(() => {
    if (preset === "custom") return customRange;
    return getDateRange(preset);
  }, [preset, customRange]);

  const { loading, error, profitLoss, txSummary, topProducts } = useBookkeeping(
    storeId,
    range,
  );

  const [detailId, setDetailId] = useState(null);

  // Export CSV
  const handleExport = () => {
    if (!txSummary?.transactions?.length) {
      return alert("Tidak ada transaksi untuk diexport");
    }
    const csv = transactionsToCSV(txSummary.transactions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-${range.startDate}_${range.endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!storeId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
        <p className="text-3xl">🏪</p>
        <h2 className="mt-2 font-semibold text-amber-800">
          Belum ada toko aktif
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">
            Laporan Keuangan
          </h1>
          <p className="text-sm text-neutral-500">
            Laba-rugi & rekap transaksi {currentStore?.name}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <PeriodFilter
            preset={preset}
            onPresetChange={setPreset}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
          />
          <button
            onClick={handleExport}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-600 shadow-sm hover:bg-neutral-50"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <SkeletonBookkeeping />
      ) : (
        <>
          {/* Laba-Rugi summary */}
          <PLSummary summary={profitLoss?.summary} />

          {/* Chart + Top Products */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm lg:col-span-2">
              <h2 className="mb-3 font-semibold text-neutral-800">
                Tren Harian
              </h2>
              <RevenueChart data={profitLoss?.byDay || []} />
            </div>
            <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
              <h2 className="mb-3 font-semibold text-neutral-800">
                🏆 Top 5 Produk
              </h2>
              <TopProducts products={topProducts} />
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MiniStat
              label="Total Transaksi"
              value={txSummary?.totalTransactions || 0}
            />
            <MiniStat
              label="Rata-rata Transaksi"
              value={formatRupiah(txSummary?.avgOrderValue || 0)}
            />
            <MiniStat
              label="Metode Terbanyak"
              value={topMethod(txSummary?.byMethod)}
            />
            <MiniStat
              label="Periode"
              value={`${range.startDate} → ${range.endDate}`}
              small
            />
          </div>

          {/* Transactions */}
          <div>
            <h2 className="mb-3 font-semibold text-neutral-800">
              🧾 Detail Transaksi
            </h2>
            <TransactionTable
              transactions={txSummary?.transactions || []}
              onRowClick={setDetailId}
            />
          </div>
        </>
      )}

      {/* Detail Modal */}
      <TransactionDetailModal
        open={!!detailId}
        transactionId={detailId}
        onClose={() => setDetailId(null)}
      />
    </div>
  );
}

// ===== helpers =====
function formatRupiah(v) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(v) || 0);
}

function topMethod(byMethod) {
  if (!byMethod) return "-";
  const entries = Object.entries(byMethod);
  if (entries.length === 0) return "-";
  return entries.sort((a, b) => b[1] - a[1])[0][0].toUpperCase();
}

function MiniStat({ label, value, small }) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
      <p className="text-xs text-neutral-500">{label}</p>
      <p
        className={`mt-1 font-bold text-neutral-800 ${
          small ? "text-xs" : "text-lg"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SkeletonBookkeeping() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl bg-white shadow-sm"
          />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-white shadow-sm" />
      <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm" />
    </div>
  );
}