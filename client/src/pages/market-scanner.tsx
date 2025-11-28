import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketScanner as MarketScannerPanel } from "@/components/dashboard";
import type { MarketData } from "@shared/schema";

export default function MarketScannerPage() {
  const { data, isLoading } = useQuery<MarketData>({
    queryKey: ["/api/market-data"],
  });

  if (isLoading) {
    return (
      <div className="min-h-full p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
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

  if (!data) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <p className="text-muted-foreground">Unable to load market data</p>
      </div>
    );
  }

  return (
    <div className="min-h-full p-6 lg:p-8" data-testid="market-scanner-page">
      <div className="mx-auto max-w-screen-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Market Reality Scanner</h1>
          <p className="text-sm text-muted-foreground">
            Track competitor pricing, demand trends, and market opportunities
          </p>
        </div>

        <MarketScannerPanel data={data} />
      </div>
    </div>
  );
}
