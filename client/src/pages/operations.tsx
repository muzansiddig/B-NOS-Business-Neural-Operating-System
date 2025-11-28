import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { OperationalPanel } from "@/components/dashboard";
import type { OperationalMetrics } from "@shared/schema";

export default function OperationsPage() {
  const { data, isLoading } = useQuery<OperationalMetrics>({
    queryKey: ["/api/operational-metrics"],
  });

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
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <p className="text-muted-foreground">Unable to load operational data</p>
      </div>
    );
  }

  return (
    <div className="min-h-full p-6 lg:p-8" data-testid="operations-page">
      <div className="mx-auto max-w-screen-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Operational Efficiency Engine</h1>
          <p className="text-sm text-muted-foreground">
            Measure employee productivity, process efficiency, and identify bottlenecks
          </p>
        </div>

        <OperationalPanel metrics={data} />
      </div>
    </div>
  );
}
