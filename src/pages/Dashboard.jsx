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

export default function Dashboard() {
  return (
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
    </div>
  );
}