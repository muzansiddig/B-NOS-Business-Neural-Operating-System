import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import type { FinancialMetrics } from "@shared/schema";

interface FinancialPanelProps {
  metrics: FinancialMetrics;
  className?: string;
}

export function FinancialPanel({ metrics, className }: FinancialPanelProps) {
  const formatCurrency = (value: number, compact = false) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: compact ? "compact" : "standard",
      maximumFractionDigits: compact ? 1 : 0,
    }).format(value);
  };

  const profitMargin = metrics.revenue > 0 ? (metrics.netProfit / metrics.revenue) * 100 : 0;
  const isProfit = metrics.netProfit >= 0;
  const cashHealth = metrics.cashRunway >= 12 ? "healthy" : metrics.cashRunway >= 6 ? "warning" : "critical";

  const mainMetrics = [
    {
      label: "Total Revenue",
      value: formatCurrency(metrics.revenue, true),
      icon: DollarSign,
      trend: "up",
    },
    {
      label: "Net Profit",
      value: formatCurrency(metrics.netProfit, true),
      icon: isProfit ? TrendingUp : TrendingDown,
      trend: isProfit ? "up" : "down",
    },
    {
      label: "Gross Margin",
      value: `${(metrics.grossMargin * 100).toFixed(1)}%`,
      icon: TrendingUp,
      trend: metrics.grossMargin >= 0.3 ? "up" : "down",
    },
    {
      label: "EBITDA",
      value: formatCurrency(metrics.ebitda, true),
      icon: DollarSign,
      trend: metrics.ebitda >= 0 ? "up" : "down",
    },
  ];

  const costBreakdown = [
    { label: "COGS", value: metrics.cogs, color: "bg-chart-1" },
    { label: "OPEX", value: metrics.opex, color: "bg-chart-2" },
    { label: "CAPEX", value: metrics.capex, color: "bg-chart-3" },
  ];

  const totalCosts = metrics.cogs + metrics.opex + metrics.capex;

  return (
    <div className={cn("space-y-6", className)} data-testid="financial-panel">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mainMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {metric.label}
                </p>
                <metric.icon
                  className={cn(
                    "h-4 w-4",
                    metric.trend === "up" ? "text-chart-2" : "text-destructive"
                  )}
                />
              </div>
              <p className="mt-2 font-mono text-2xl font-bold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Cost Structure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {costBreakdown.map((cost) => {
              const percentage = totalCosts > 0 ? (cost.value / totalCosts) * 100 : 0;
              return (
                <div key={cost.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{cost.label}</span>
                    <span className="font-mono font-medium">{formatCurrency(cost.value, true)}</span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full transition-all", cost.color)}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-right text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Financial Health Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Burn Rate</p>
                <p className="text-xs text-muted-foreground">Monthly cash consumption</p>
              </div>
              <span className="font-mono text-lg font-semibold text-chart-4">
                {formatCurrency(metrics.burnRate, true)}/mo
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Cash Runway</p>
                  <p className="text-xs text-muted-foreground">Months of operation remaining</p>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    cashHealth === "healthy"
                      ? "bg-chart-2/15 text-chart-2"
                      : cashHealth === "warning"
                      ? "bg-chart-4/15 text-chart-4"
                      : "bg-destructive/15 text-destructive"
                  )}
                >
                  {metrics.cashRunway} months
                </Badge>
              </div>
              <Progress
                value={Math.min((metrics.cashRunway / 24) * 100, 100)}
                className={cn(
                  "h-2",
                  cashHealth === "healthy"
                    ? "[&>div]:bg-chart-2"
                    : cashHealth === "warning"
                    ? "[&>div]:bg-chart-4"
                    : "[&>div]:bg-destructive"
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Margin Strength Index</p>
                <p className="text-xs text-muted-foreground">Overall margin health score</p>
              </div>
              <span className="font-mono text-lg font-semibold">
                {metrics.marginStrengthIndex.toFixed(1)}
              </span>
            </div>

            {metrics.taxRisk > 50 && (
              <div className="flex items-start gap-2 rounded-md border border-chart-4/30 bg-chart-4/10 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-chart-4" />
                <div>
                  <p className="text-sm font-medium text-chart-4">Tax Risk Alert</p>
                  <p className="text-xs text-muted-foreground">
                    Tax exposure is {metrics.taxRisk}% above optimal levels. Review deductibles and consider consulting a tax advisor.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
