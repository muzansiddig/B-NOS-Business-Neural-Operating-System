import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerIntelligencePanel } from "@/components/dashboard";
import type { CustomerIntelligence } from "@shared/schema";

export default function CustomerIntelligencePage() {
  const { data, isLoading } = useQuery<CustomerIntelligence>({
    queryKey: ["/api/customer-intelligence"],
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
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-64" />
            <Skeleton className="h-64 lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <p className="text-muted-foreground">Unable to load customer intelligence data</p>
      </div>
    );
  }

  return (
    <div className="min-h-full p-6 lg:p-8" data-testid="customer-intelligence-page">
      <div className="mx-auto max-w-screen-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Lifetime Intelligence Hub</h1>
          <p className="text-sm text-muted-foreground">
            Track CAC, LTV, retention, churn, and customer segment profitability
          </p>
        </div>

        <CustomerIntelligencePanel data={data} />
      </div>
    </div>
  );
}
