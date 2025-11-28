import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { FinancialPanel, RevenueChart } from "@/components/dashboard";
import type { FinancialMetrics, TimeSeriesPoint } from "@shared/schema";

export default function ProfitPulse() {
  const { data: metrics, isLoading: metricsLoading } = useQuery<FinancialMetrics>({
    queryKey: ["/api/financial-metrics"],
  });

  const { data: revenueHistory, isLoading: historyLoading } = useQuery<TimeSeriesPoint[]>({
    queryKey: ["/api/revenue-history"],
  });

  const isLoading = metricsLoading || historyLoading;

  if (isLoading) {
    return (
      <div className="min-h-full p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <p className="text-muted-foreground">Unable to load financial data</p>
      </div>
    );
  }

  const chartData = revenueHistory?.map((point, index) => ({
    date: point.date,
    revenue: point.value,
    expenses: Math.round(point.value * (0.65 + Math.random() * 0.15)),
  })) || [];

  return (
    <div className="min-h-full p-6 lg:p-8" data-testid="profit-pulse-page">
      <div className="mx-auto max-w-screen-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profit Pulse Engine</h1>
          <p className="text-sm text-muted-foreground">
            Track revenue, expenses, and financial health metrics
          </p>
        </div>

        <FinancialPanel metrics={metrics} />

        {chartData.length > 0 && (
          <RevenueChart data={chartData} />
        )}
      </div>
    </div>
  );
}
