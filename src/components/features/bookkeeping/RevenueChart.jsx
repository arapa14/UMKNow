// src/components/features/bookkeeping/RevenueChart.jsx
import { BarChart3 } from "lucide-react";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function RevenueChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-solid border-gray-200 bg-gray-50 text-center">
        <BarChart3 className="mx-auto mb-3 h-10 w-10 text-gray-300" />
        <p className="text-sm text-gray-500">
          Belum ada data untuk periode ini
        </p>
      </div>
    );
  }

  const max = Math.max(
    ...data.map((d) => Math.max(d.revenue, d.netProfit, 1)),
    1,
  );
  const W = 100;
  const H = 40;

  const toPath = (key) => {
    return data
      .map((d, i) => {
        const x = (i / (data.length - 1 || 1)) * W;
        const y = H - (d[key] / max) * H;
        return `${i === 0 ? "M" : "L"} ${x},${y}`;
      })
      .join(" ");
  };

  const revenuePath = toPath("revenue");
  const profitPath = toPath("netProfit");
  const revenueArea = `${revenuePath} L ${W},${H} L 0,${H} Z`;

  return (
    <div>
      {/* Legend */}
      <div className="mb-3 flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
          Pendapatan
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
          Laba Bersih
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="h-48 w-full"
      >
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={revenueArea} fill="url(#revGrad)" />
        <path
          d={revenuePath}
          fill="none"
          stroke="#22c55e"
          strokeWidth="0.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d={profitPath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="0.6"
          strokeDasharray="1.5 1"
          strokeLinejoin="round"
        />
      </svg>

      {/* X labels */}
      <div className="mt-2 flex justify-between text-[10px] text-neutral-400">
        {data.map((d, i) => (
          <span key={i}>
            {new Date(d.date).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
            })}
          </span>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
        <Stat
          label="Total Pendapatan"
          value={formatCurrency(data.reduce((s, d) => s + d.revenue, 0))}
        />
        <Stat
          label="Total Laba Kotor"
          value={formatCurrency(data.reduce((s, d) => s + d.grossProfit, 0))}
        />
        <Stat
          label="Total Laba Bersih"
          value={formatCurrency(data.reduce((s, d) => s + d.netProfit, 0))}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-neutral-50 px-3 py-2">
      <p className="text-[10px] text-neutral-500">{label}</p>
      <p className="mt-0.5 font-semibold text-neutral-800">{value}</p>
    </div>
  );
}
