import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, TrendingUp, ArrowRight, Zap, Settings, Eye, FlaskConical, StopCircle } from "lucide-react";
import type { Recommendation } from "@shared/schema";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAction?: (id: string) => void;
  compact?: boolean;
  className?: string;
}

const actionConfig = {
  scale: {
    icon: Zap,
    bgClass: "bg-chart-2/15",
    textClass: "text-chart-2",
    borderClass: "border-l-chart-2",
    label: "Scale",
  },
  optimize: {
    icon: Settings,
    bgClass: "bg-chart-1/15",
    textClass: "text-chart-1",
    borderClass: "border-l-chart-1",
    label: "Optimize",
  },
  monitor: {
    icon: Eye,
    bgClass: "bg-chart-4/15",
    textClass: "text-chart-4",
    borderClass: "border-l-chart-4",
    label: "Monitor",
  },
  test: {
    icon: FlaskConical,
    bgClass: "bg-chart-3/15",
    textClass: "text-chart-3",
    borderClass: "border-l-chart-3",
    label: "Test",
  },
  stop: {
    icon: StopCircle,
    bgClass: "bg-destructive/15",
    textClass: "text-destructive",
    borderClass: "border-l-destructive",
    label: "Stop",
  },
};

export function RecommendationCard({
  recommendation,
  onAction,
  compact = false,
  className,
}: RecommendationCardProps) {
  const config = actionConfig[recommendation.action];
  const Icon = config.icon;

  const formatRoi = (value: number) => {
    const prefix = value >= 0 ? "+" : "";
    return `${prefix}${value.toFixed(1)}%`;
  };

  if (compact) {
    return (
      <Card
        className={cn("border-l-4", config.borderClass, className)}
        data-testid={`recommendation-${recommendation.id}`}
      >
        <CardContent className="flex items-center gap-4 p-4">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-md", config.bgClass)}>
            <Icon className={cn("h-5 w-5", config.textClass)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={cn("text-[10px] uppercase", config.bgClass, config.textClass)}>
                {config.label}
              </Badge>
              <span className="font-mono text-sm font-semibold text-chart-2">
                {formatRoi(recommendation.expectedRoiImpact)} ROI
              </span>
            </div>
            <p className="mt-1 text-sm font-medium truncate">{recommendation.title}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{recommendation.timeToResult}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn("border-l-4", config.borderClass, className)}
      data-testid={`recommendation-${recommendation.id}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-md", config.bgClass)}>
              <Icon className={cn("h-6 w-6", config.textClass)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className={cn("text-xs uppercase", config.bgClass, config.textClass)}>
                  {config.label}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Priority {recommendation.priority}
                </Badge>
                <span className="text-xs text-muted-foreground">{recommendation.category}</span>
              </div>
              <h3 className="mt-2 text-lg font-semibold">{recommendation.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{recommendation.description}</p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1">
            <div className="flex items-center gap-1 text-chart-2">
              <TrendingUp className="h-4 w-4" />
              <span className="font-mono text-xl font-bold">{formatRoi(recommendation.expectedRoiImpact)}</span>
            </div>
            <span className="text-xs text-muted-foreground">Expected ROI</span>
          </div>
        </div>

        <div className="mt-4 rounded-md bg-muted/50 p-3">
          <p className="text-sm text-muted-foreground">{recommendation.reasoning}</p>
        </div>

        {recommendation.metrics && recommendation.metrics.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {recommendation.metrics.map((metric) => (
              <div key={metric.name} className="text-center">
                <p className="text-xs text-muted-foreground">{metric.name}</p>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">{metric.current}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="font-mono text-sm font-semibold text-chart-2">{metric.projected}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Time to result: {recommendation.timeToResult}</span>
          </div>
          {onAction && (
            <Button onClick={() => onAction(recommendation.id)} data-testid={`button-action-${recommendation.id}`}>
              Take Action
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
