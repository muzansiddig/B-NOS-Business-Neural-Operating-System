import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Activity, Clock, Package, AlertCircle, CheckCircle, Gauge } from "lucide-react";
import type { OperationalMetrics } from "@shared/schema";

interface OperationalPanelProps {
  metrics: OperationalMetrics;
  className?: string;
}

export function OperationalPanel({ metrics, className }: OperationalPanelProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-chart-2";
    if (value >= 60) return "text-chart-4";
    return "text-destructive";
  };

  const getScoreBg = (value: number) => {
    if (value >= 80) return "bg-chart-2/15";
    if (value >= 60) return "bg-chart-4/15";
    return "bg-destructive/15";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive/15 text-destructive border-destructive/30";
      case "high":
        return "bg-chart-5/15 text-chart-5 border-chart-5/30";
      case "medium":
        return "bg-chart-4/15 text-chart-4 border-chart-4/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const mainMetrics = [
    {
      label: "Productivity Score",
      value: metrics.productivityScore,
      icon: Gauge,
      format: "score",
    },
    {
      label: "Cost to Serve",
      value: metrics.costToServe,
      icon: Activity,
      format: "currency",
    },
    {
      label: "Delivery SLA Health",
      value: metrics.deliverySlaHealth,
      icon: Clock,
      format: "percent",
    },
    {
      label: "Process Efficiency",
      value: metrics.processEfficiency,
      icon: CheckCircle,
      format: "percent",
    },
  ];

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case "currency":
        return `$${value.toLocaleString()}`;
      case "percent":
        return `${value.toFixed(1)}%`;
      default:
        return value.toFixed(0);
    }
  };

  return (
    <div className={cn("space-y-6", className)} data-testid="operational-panel">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mainMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-md", getScoreBg(metric.value))}>
                  <metric.icon className={cn("h-5 w-5", getScoreColor(metric.value))} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className={cn("font-mono text-xl font-bold", getScoreColor(metric.value))}>
                    {formatValue(metric.value, metric.format)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Package className="h-4 w-4" />
              Supply Chain Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Supply Chain Score</span>
                <span className={cn("font-mono font-semibold", getScoreColor(metrics.supplyChainHealth))}>
                  {metrics.supplyChainHealth.toFixed(0)}%
                </span>
              </div>
              <Progress
                value={metrics.supplyChainHealth}
                className={cn(
                  "h-2",
                  metrics.supplyChainHealth >= 80
                    ? "[&>div]:bg-chart-2"
                    : metrics.supplyChainHealth >= 60
                    ? "[&>div]:bg-chart-4"
                    : "[&>div]:bg-destructive"
                )}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Inventory Rotation</span>
                <span className="font-mono font-semibold">{metrics.inventoryRotation.toFixed(1)}x</span>
              </div>
              <Progress
                value={Math.min((metrics.inventoryRotation / 12) * 100, 100)}
                className="h-2 [&>div]:bg-chart-1"
              />
              <p className="text-right text-xs text-muted-foreground">
                {metrics.inventoryRotation >= 6 ? "Healthy rotation" : "Consider inventory optimization"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="h-4 w-4" />
              Process Bottlenecks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.bottlenecks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-10 w-10 text-chart-2" />
                <p className="mt-3 text-sm font-medium">No Critical Bottlenecks</p>
                <p className="text-xs text-muted-foreground">All processes running smoothly</p>
              </div>
            ) : (
              <div className="space-y-3">
                {metrics.bottlenecks.map((bottleneck, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between rounded-md border p-3",
                      getSeverityColor(bottleneck.severity)
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">{bottleneck.process}</p>
                        <p className="text-xs opacity-80">
                          Impact: {bottleneck.impact.toFixed(1)}% efficiency loss
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={cn("uppercase", getSeverityColor(bottleneck.severity))}>
                      {bottleneck.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
