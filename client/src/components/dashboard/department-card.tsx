import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Users } from "lucide-react";
import type { Department } from "@shared/schema";

interface DepartmentCardProps {
  department: Department;
  onClick?: (id: string) => void;
  className?: string;
}

export function DepartmentCard({ department, onClick, className }: DepartmentCardProps) {
  const TrendIcon = department.trend === "up" ? TrendingUp : department.trend === "down" ? TrendingDown : Minus;

  const getScoreColor = (value: number) => {
    if (value >= 75) return "text-chart-2";
    if (value >= 50) return "text-chart-4";
    if (value >= 25) return "text-chart-5";
    return "text-destructive";
  };

  const getScoreBg = (value: number) => {
    if (value >= 75) return "bg-chart-2/15";
    if (value >= 50) return "bg-chart-4/15";
    if (value >= 25) return "bg-chart-5/15";
    return "bg-destructive/15";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover-elevate active-elevate-2",
        className
      )}
      onClick={() => onClick?.(department.id)}
      data-testid={`department-${department.id}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold">{department.name}</h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{department.headcount} employees</span>
            </div>
          </div>
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-md", getScoreBg(department.roiScore))}>
            <span className={cn("font-mono text-lg font-bold", getScoreColor(department.roiScore))}>
              {department.roiScore}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Revenue</p>
            <p className="font-mono text-sm font-semibold">{formatCurrency(department.revenue)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Expenses</p>
            <p className="font-mono text-sm font-semibold">{formatCurrency(department.expenses)}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t pt-3">
          <span className="text-xs text-muted-foreground">Trend</span>
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            department.trend === "up" ? "text-chart-2" : department.trend === "down" ? "text-destructive" : "text-muted-foreground"
          )}>
            <TrendIcon className="h-3 w-3" />
            <span>{department.trendPercent >= 0 ? "+" : ""}{department.trendPercent}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DepartmentGridProps {
  departments: Department[];
  onDepartmentClick?: (id: string) => void;
  className?: string;
}

export function DepartmentGrid({ departments, onDepartmentClick, className }: DepartmentGridProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)} data-testid="department-grid">
      {departments.map((dept) => (
        <DepartmentCard
          key={dept.id}
          department={dept}
          onClick={onDepartmentClick}
        />
      ))}
    </div>
  );
}
