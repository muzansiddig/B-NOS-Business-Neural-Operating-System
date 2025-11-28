import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "stable";
  format?: "currency" | "percent" | "number";
  prefix?: string;
  suffix?: string;
  className?: string;
  sparkline?: number[];
  testId?: string;
}

export function MetricCard({
  label,
  value,
  change,
  trend = "stable",
  format = "number",
  prefix = "",
  suffix = "",
  className,
  sparkline,
  testId,
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === "string") return val;
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: val >= 1000000 ? "compact" : "standard",
          maximumFractionDigits: val >= 1000000 ? 1 : 0,
        }).format(val);
      case "percent":
        return `${val.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat("en-US", {
          notation: val >= 10000 ? "compact" : "standard",
          maximumFractionDigits: 1,
        }).format(val);
    }
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  const maxSparkline = sparkline ? Math.max(...sparkline) : 0;
  const minSparkline = sparkline ? Math.min(...sparkline) : 0;
  const range = maxSparkline - minSparkline || 1;

  return (
    <Card className={cn("relative overflow-hidden", className)} data-testid={testId || `metric-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 font-mono text-2xl font-bold tracking-tight">
              {prefix}{formatValue(value)}{suffix}
            </p>
            {change !== undefined && (
              <div className={cn(
                "mt-1 flex items-center gap-1 text-xs font-medium",
                trend === "up" ? "text-chart-2" : trend === "down" ? "text-destructive" : "text-muted-foreground"
              )}>
                <TrendIcon className="h-3 w-3" />
                <span>{change >= 0 ? "+" : ""}{change.toFixed(1)}%</span>
              </div>
            )}
          </div>

          {sparkline && sparkline.length > 0 && (
            <div className="ml-4 h-12 w-20">
              <svg
                className="h-full w-full"
                viewBox={`0 0 ${sparkline.length * 6} 48`}
                preserveAspectRatio="none"
              >
                <path
                  d={sparkline
                    .map((val, i) => {
                      const x = i * 6;
                      const y = 48 - ((val - minSparkline) / range) * 44 - 2;
                      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                    })
                    .join(" ")}
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={cn(
                    "transition-colors",
                    trend === "up" ? "stroke-chart-2" : trend === "down" ? "stroke-destructive" : "stroke-chart-1"
                  )}
                />
              </svg>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
