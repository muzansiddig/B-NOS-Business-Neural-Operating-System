import { X, AlertTriangle, AlertCircle, Info, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Alert } from "@shared/schema";

interface AlertCardProps {
  alert: Alert;
  onDismiss?: (id: string) => void;
  className?: string;
}

const alertConfig = {
  tax_risk: {
    icon: AlertTriangle,
    bgClass: "bg-destructive/10 dark:bg-destructive/20",
    borderClass: "border-destructive/30",
    iconClass: "text-destructive",
    label: "Tax Risk",
  },
  cash_warning: {
    icon: AlertCircle,
    bgClass: "bg-warning/10 dark:bg-warning/20",
    borderClass: "border-warning/30",
    iconClass: "text-warning",
    label: "Cash Warning",
  },
  overspend: {
    icon: AlertTriangle,
    bgClass: "bg-chart-4/10 dark:bg-chart-4/20",
    borderClass: "border-chart-4/30",
    iconClass: "text-chart-4",
    label: "Overspend",
  },
  opportunity: {
    icon: Lightbulb,
    bgClass: "bg-chart-2/10 dark:bg-chart-2/20",
    borderClass: "border-chart-2/30",
    iconClass: "text-chart-2",
    label: "Opportunity",
  },
  insight: {
    icon: Info,
    bgClass: "bg-chart-1/10 dark:bg-chart-1/20",
    borderClass: "border-chart-1/30",
    iconClass: "text-chart-1",
    label: "Insight",
  },
};

export function AlertCard({ alert, onDismiss, className }: AlertCardProps) {
  const config = alertConfig[alert.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 rounded-md border p-4",
        config.bgClass,
        config.borderClass,
        className
      )}
      data-testid={`alert-${alert.id}`}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", config.iconClass)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-medium uppercase tracking-wider", config.iconClass)}>
            {config.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(alert.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <p className="mt-1 text-sm font-medium">{alert.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{alert.message}</p>
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={() => onDismiss(alert.id)}
          data-testid={`button-dismiss-alert-${alert.id}`}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Dismiss</span>
        </Button>
      )}
    </div>
  );
}

interface AlertListProps {
  alerts: Alert[];
  onDismiss?: (id: string) => void;
  className?: string;
}

export function AlertList({ alerts, onDismiss, className }: AlertListProps) {
  const activeAlerts = alerts.filter((a) => !a.dismissed);

  if (activeAlerts.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)} data-testid="alert-list">
      {activeAlerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
