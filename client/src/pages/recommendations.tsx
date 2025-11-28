import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RecommendationCard } from "@/components/dashboard";
import { Target, Zap, Settings, Eye, FlaskConical, StopCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@shared/schema";

export default function RecommendationsPage() {
  const { data: recommendations, isLoading } = useQuery<Recommendation[]>({
    queryKey: ["/api/recommendations"],
  });

  if (isLoading) {
    return (
      <div className="min-h-full p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const sortedRecommendations = [...(recommendations || [])].sort((a, b) => a.priority - b.priority);

  const actionStats = {
    scale: sortedRecommendations.filter((r) => r.action === "scale").length,
    optimize: sortedRecommendations.filter((r) => r.action === "optimize").length,
    monitor: sortedRecommendations.filter((r) => r.action === "monitor").length,
    test: sortedRecommendations.filter((r) => r.action === "test").length,
    stop: sortedRecommendations.filter((r) => r.action === "stop").length,
  };

  const statCards = [
    { label: "Scale", count: actionStats.scale, icon: Zap, color: "text-chart-2 bg-chart-2/15" },
    { label: "Optimize", count: actionStats.optimize, icon: Settings, color: "text-chart-1 bg-chart-1/15" },
    { label: "Monitor", count: actionStats.monitor, icon: Eye, color: "text-chart-4 bg-chart-4/15" },
    { label: "Test", count: actionStats.test, icon: FlaskConical, color: "text-chart-3 bg-chart-3/15" },
    { label: "Stop", count: actionStats.stop, icon: StopCircle, color: "text-destructive bg-destructive/15" },
  ];

  return (
    <div className="min-h-full p-6 lg:p-8" data-testid="recommendations-page">
      <div className="mx-auto max-w-screen-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Strategy Output System</h1>
          <p className="text-sm text-muted-foreground">
            AI-generated decision recommendations ranked by expected ROI impact
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-5">
          {statCards.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-md", stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="font-mono text-xl font-bold">{stat.count}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedRecommendations.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Target className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-6 text-lg font-semibold">No Recommendations</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                The system is analyzing your business data. Recommendations will appear once patterns are identified.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedRecommendations.map((rec, index) => (
              <div key={rec.id} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <RecommendationCard recommendation={rec} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
