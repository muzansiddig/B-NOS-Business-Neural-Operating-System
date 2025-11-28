import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DepartmentGrid, DepartmentBarChart } from "@/components/dashboard";
import { Layers } from "lucide-react";
import type { Department } from "@shared/schema";

export default function DepartmentsPage() {
  const { data: departments, isLoading } = useQuery<Department[]>({
    queryKey: ["/api/departments"],
  });

  if (isLoading) {
    return (
      <div className="min-h-full p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-80" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!departments || departments.length === 0) {
    return (
      <div className="min-h-full p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl">
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Layers className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-6 text-lg font-semibold">No Departments</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Department data will appear once your organization structure is configured.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const chartData = departments.map((dept) => ({
    name: dept.name,
    roiScore: dept.roiScore,
    revenue: dept.revenue,
  }));

  const sortedByRoi = [...departments].sort((a, b) => b.roiScore - a.roiScore);
  const topPerformer = sortedByRoi[0];
  const needsAttention = sortedByRoi.filter((d) => d.roiScore < 50);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className="min-h-full p-6 lg:p-8" data-testid="departments-page">
      <div className="mx-auto max-w-screen-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Department Breakdown</h1>
          <p className="text-sm text-muted-foreground">
            ROI performance analysis by department
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Departments
              </p>
              <p className="mt-2 font-mono text-2xl font-bold">{departments.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Top Performer
              </p>
              <p className="mt-2 text-lg font-semibold">{topPerformer.name}</p>
              <p className="text-sm text-chart-2">ROI Score: {topPerformer.roiScore}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Need Attention
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-chart-4">
                {needsAttention.length}
              </p>
              <p className="text-xs text-muted-foreground">Departments below 50 ROI</p>
            </CardContent>
          </Card>
        </div>

        <DepartmentBarChart data={chartData} />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">All Departments</h2>
          <DepartmentGrid departments={departments} />
        </div>
      </div>
    </div>
  );
}
