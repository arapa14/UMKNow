// src/components/features/bookkeeping/PLSummary.jsx
import { formatCurrency } from "../../../utils/formatCurrency";

export default function PLSummary({ summary }) {
  if (!summary) return null;

  const { revenue, cogs, grossProfit, expenses, netProfit } = summary;
  const grossMargin = revenue ? (grossProfit / revenue) * 100 : 0;
  const netMargin = revenue ? (netProfit / revenue) * 100 : 0;

  return (
    <div className="space-y-3">
      {/* Big cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PLCard
          label="Pendapatan"
          value={formatCurrency(revenue)}
          icon="💰"
          accent="green"
        />
        <PLCard
          label="HPP (COGS)"
          value={formatCurrency(cogs)}
          icon="📦"
          accent="amber"
        />
        <PLCard
          label="Laba Kotor"
          value={formatCurrency(grossProfit)}
          sub={`Margin ${grossMargin.toFixed(1)}%`}
          icon="📈"
          accent="blue"
        />
        <PLCard
          label="Laba Bersih"
          value={formatCurrency(netProfit)}
          sub={`Margin ${netMargin.toFixed(1)}%`}
          icon="✨"
          accent={netProfit >= 0 ? "green" : "red"}
        />
      </div>

      {/* Detail breakdown */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
        <h3 className="mb-3 font-semibold text-neutral-800">
          Rincian Laba-Rugi
        </h3>
        <div className="space-y-2 text-sm">
          <PLRow label="Pendapatan Bruto" value={formatCurrency(revenue)} />
          <PLRow
            label="− Harga Pokok Penjualan"
            value={`− ${formatCurrency(cogs)}`}
            muted
          />
          <div className="my-2 border-t border-dashed border-neutral-200" />
          <PLRow
            label="= Laba Kotor"
            value={formatCurrency(grossProfit)}
            bold
          />
          <PLRow
            label="− Beban Operasional (Diskon)"
            value={`− ${formatCurrency(expenses)}`}
            muted
          />
          <div className="my-2 border-t border-dashed border-neutral-200" />
          <PLRow
            label="= Laba Bersih"
            value={formatCurrency(netProfit)}
            bold
            accent={netProfit >= 0 ? "text-green-600" : "text-red-600"}
          />
        </div>
      </div>
    </div>
  );
}

function PLCard({ label, value, sub, icon, accent }) {
  const colors = {
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-neutral-500">{label}</p>
          <p className="mt-1 text-xl font-bold text-neutral-800">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-neutral-400">{sub}</p>}
        </div>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors[accent]}`}
        >
          <span>{icon}</span>
        </div>
      </div>
    </div>
  );
}

function PLRow({ label, value, bold, muted, accent = "" }) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`${muted ? "text-neutral-500" : "text-neutral-700"} ${
          bold ? "font-semibold" : ""
        }`}
      >
        {label}
      </span>
      <span
        className={`${bold ? "font-bold" : ""} ${
          accent || (muted ? "text-neutral-500" : "text-neutral-800")
        }`}
      >
        {value}
      </span>
    </div>
  );
}
