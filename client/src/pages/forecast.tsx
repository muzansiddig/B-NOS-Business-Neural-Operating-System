import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ForecastSimulator } from "@/components/dashboard";
import { cn } from "@/lib/utils";
import { Play, TrendingUp, Clock, AlertTriangle, BarChart3 } from "lucide-react";
import type { ForecastScenario } from "@shared/schema";

export default function ForecastPage() {
  const [simulatorOpen, setSimulatorOpen] = useState(false);

  const { data: scenarios, isLoading } = useQuery<ForecastScenario[]>({
    queryKey: ["/api/forecasts"],
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-chart-2/15 text-chart-2";
      case "medium":
        return "bg-chart-4/15 text-chart-4";
      case "high":
        return "bg-destructive/15 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      pricing: "Pricing Change",
      scaling: "Scaling Strategy",
      hiring: "Hiring Plan",
      marketing: "Marketing Spend",
      product_launch: "Product Launch",
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <div className="min-h-full p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-36" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-6 lg:p-8" data-testid="forecast-page">
      <div className="mx-auto max-w-screen-2xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Forecast & Scenario Simulator</h1>
            <p className="text-sm text-muted-foreground">
              Model business scenarios and predict ROI outcomes
            </p>
          </div>
          <Button onClick={() => setSimulatorOpen(true)} data-testid="button-new-simulation">
            <Play className="mr-2 h-4 w-4" />
            New Simulation
          </Button>
        </div>

        {!scenarios || scenarios.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-6 text-lg font-semibold">No Simulations Yet</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Create your first scenario simulation to model pricing changes, scaling strategies, hiring plans, and more.
              </p>
              <Button className="mt-6" onClick={() => setSimulatorOpen(true)}>
                <Play className="mr-2 h-4 w-4" />
                Create Simulation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} data-testid={`scenario-${scenario.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {getTypeLabel(scenario.type)}
                      </p>
                    </div>
                    <Badge className={cn(getRiskColor(scenario.riskLevel))}>
                      {scenario.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-md bg-muted/50 p-3 text-center">
                      <TrendingUp className="mx-auto h-5 w-5 text-chart-2" />
                      <p className="mt-2 font-mono text-2xl font-bold text-chart-2">
                        +{scenario.expectedRoi.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Expected ROI</p>
                    </div>
                    <div className="rounded-md bg-muted/50 p-3 text-center">
                      <Clock className="mx-auto h-5 w-5 text-chart-4" />
                      <p className="mt-2 font-mono text-2xl font-bold">
                        {scenario.timeToBreakeven}
                      </p>
                      <p className="text-xs text-muted-foreground">Months to Break-even</p>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-md bg-muted/50 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Revenue Impact</span>
                      <span className="font-mono font-semibold">
                        ${scenario.revenueImpact.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Confidence Level</span>
                      <span className="font-mono font-semibold">
                        {scenario.confidenceLevel.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {scenario.riskLevel === "high" && (
                    <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                      <p className="text-xs text-destructive">
                        High risk scenario. Consider reducing scope or testing with smaller parameters.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <ForecastSimulator open={simulatorOpen} onOpenChange={setSimulatorOpen} />
      </div>
    </div>
  );
}
