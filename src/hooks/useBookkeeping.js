// src/hooks/useBookkeeping.js
import { useCallback, useEffect, useState } from "react";
import {
  getProfitLossReport,
  getTransactionSummary,
  getTopProducts,
} from "../services/bookkeepingService";

export function useBookkeeping(storeId, range) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profitLoss, setProfitLoss] = useState(null);
  const [txSummary, setTxSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  // ⬇️ Extract nilai sebelum effect — ESLint akan tahu ini primitif
  const startDate = range?.startDate;
  const endDate = range?.endDate;

  useEffect(() => {
    if (!storeId || !startDate || !endDate) return;

    let ignore = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [pl, tx, top] = await Promise.all([
          getProfitLossReport(storeId, { startDate, endDate }),
          getTransactionSummary(storeId, { startDate, endDate }),
          getTopProducts(storeId, { startDate, endDate, limit: 5 }),
        ]);

        if (ignore) return;
        setProfitLoss(pl);
        setTxSummary(tx);
        setTopProducts(top);
      } catch (err) {
        if (ignore) return;
        console.error("useBookkeeping error:", err);
        setError(err.message || "Gagal memuat laporan");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [storeId, startDate, endDate, refreshKey]); // ✅ ESLint puas

  return {
    loading,
    error,
    profitLoss,
    txSummary,
    topProducts,
    refetch,
  };
}

// getDateRange tetap sama
export function getDateRange(preset) {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  switch (preset) {
    case "today":
      break;
    case "7d":
      start.setDate(start.getDate() - 6);
      break;
    case "30d":
      start.setDate(start.getDate() - 29);
      break;
    case "month":
      start.setDate(1);
      break;
    case "lastMonth": {
      const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lmEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      lmEnd.setHours(23, 59, 59, 999);
      return {
        startDate: toISODate(lm),
        endDate: toISODate(lmEnd),
      };
    }
    default:
      break;
  }

  return {
    startDate: toISODate(start),
    endDate: toISODate(end),
  };
}

function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}