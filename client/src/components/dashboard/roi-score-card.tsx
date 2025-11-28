import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ROIDimension } from "@shared/schema";

interface ROIScoreCardProps {
  score: number;
  dimensions: ROIDimension;
  trend?: "up" | "down" | "stable";
  trendPercent?: number;
  className?: string;
}

export function ROIScoreCard({
  score,
  dimensions,
  trend = "stable",
  trendPercent = 0,
  className,
}: ROIScoreCardProps) {
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (value: number) => {
    if (value >= 75) return "text-chart-2";
    if (value >= 50) return "text-chart-4";
    if (value >= 25) return "text-chart-5";
    return "text-destructive";
  };

  const getStrokeColor = (value: number) => {
    if (value >= 75) return "stroke-chart-2";
    if (value >= 50) return "stroke-chart-4";
    if (value >= 25) return "stroke-chart-5";
    return "stroke-destructive";
  };

  const dimensionLabels = [
    { key: "financial", label: "Financial", value: dimensions.financial },
    { key: "operational", label: "Operational", value: dimensions.operational },
    { key: "market", label: "Market", value: dimensions.market },
    { key: "strategic", label: "Strategic", value: dimensions.strategic },
  ];

  return (
    <Card className={cn("", className)} data-testid="card-roi-score">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Global ROI Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg
              className="h-32 w-32 -rotate-90 transform"
              viewBox="0 0 120 120"
            >
              <circle
                cx="60"
                cy="60"
                r="52"
                strokeWidth="8"
                fill="none"
                className="stroke-muted"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className={cn("transition-all duration-1000", getStrokeColor(score))}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("font-mono text-3xl font-bold", getScoreColor(score))} data-testid="text-roi-score">
                {score}
              </span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>

          {trend !== "stable" && (
            <div className={cn(
              "mt-2 flex items-center gap-1 text-xs font-medium",
              trend === "up" ? "text-chart-2" : "text-destructive"
            )}>
              <span>{trend === "up" ? "+" : ""}{trendPercent}%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          )}

          <div className="mt-6 grid w-full grid-cols-2 gap-3">
            {dimensionLabels.map((dim) => (
              <div
                key={dim.key}
                className="flex flex-col items-center rounded-md bg-muted/50 p-2"
                data-testid={`roi-dimension-${dim.key}`}
              >
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {dim.label}
                </span>
                <span className={cn("font-mono text-lg font-semibold", getScoreColor(dim.value))}>
                  {dim.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
