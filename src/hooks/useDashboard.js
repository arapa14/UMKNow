// src/hooks/useDashboard.js
import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getSalesChart,
  getRecentTransactions,
  getLowStockProducts,
} from "../services/dashboardService";

export function useDashboard(storeId, range = "today") {
  const statsQuery = useQuery({
    queryKey: ["dashboard", "stats", storeId, range],
    queryFn: () => getDashboardStats(storeId, range),
    enabled: !!storeId,
  });

  const chartQuery = useQuery({
    queryKey: ["dashboard", "chart", storeId, range],
    queryFn: () => getSalesChart(storeId, range === "30d" ? 30 : 7),
    enabled: !!storeId,
  });

  const txQuery = useQuery({
    queryKey: ["dashboard", "recentTx", storeId],
    queryFn: () => getRecentTransactions(storeId, 5),
    enabled: !!storeId,
  });

  const stockQuery = useQuery({
    queryKey: ["dashboard", "lowStock", storeId],
    queryFn: () => getLowStockProducts(storeId, 5),
    enabled: !!storeId,
  });

  return {
    loading:
      statsQuery.isLoading ||
      chartQuery.isLoading ||
      txQuery.isLoading ||
      stockQuery.isLoading,
    error: statsQuery.error?.message || null,
    stats: statsQuery.data,
    chart: chartQuery.data || [],
    recentTx: txQuery.data || [],
    lowStock: stockQuery.data || [],
    refetch: () => {
      statsQuery.refetch();
      chartQuery.refetch();
      txQuery.refetch();
      stockQuery.refetch();
    },
  };
}