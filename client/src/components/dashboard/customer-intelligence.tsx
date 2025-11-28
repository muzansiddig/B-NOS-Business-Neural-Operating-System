import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Users, DollarSign, TrendingUp, AlertTriangle, Heart, Target } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import type { CustomerIntelligence } from "@shared/schema";

interface CustomerIntelligenceProps {
  data: CustomerIntelligence;
  className?: string;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function CustomerIntelligencePanel({ data, className }: CustomerIntelligenceProps) {
  const formatCurrency = (value: number, compact = false) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: compact ? "compact" : "standard",
      maximumFractionDigits: compact ? 1 : 0,
    }).format(value);
  };

  const getRatioColor = (ratio: number) => {
    if (ratio >= 3) return "text-chart-2";
    if (ratio >= 2) return "text-chart-4";
    return "text-destructive";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-destructive/15 text-destructive border-destructive/30";
      case "medium":
        return "bg-chart-4/15 text-chart-4 border-chart-4/30";
      default:
        return "bg-chart-2/15 text-chart-2 border-chart-2/30";
    }
  };

  const segmentData = data.segments.map((seg) => ({
    name: seg.name,
    value: seg.revenue,
  }));

  return (
    <div className={cn("space-y-6", className)} data-testid="customer-intelligence">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-5/15">
                <DollarSign className="h-5 w-5 text-chart-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">CAC</p>
                <p className="font-mono text-xl font-bold">{formatCurrency(data.cac)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-2/15">
                <TrendingUp className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">LTV</p>
                <p className="font-mono text-xl font-bold">{formatCurrency(data.ltv)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-md", 
                data.ltvCacRatio >= 3 ? "bg-chart-2/15" : data.ltvCacRatio >= 2 ? "bg-chart-4/15" : "bg-destructive/15"
              )}>
                <Target className={cn("h-5 w-5", getRatioColor(data.ltvCacRatio))} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">LTV:CAC</p>
                <p className={cn("font-mono text-xl font-bold", getRatioColor(data.ltvCacRatio))}>
                  {data.ltvCacRatio.toFixed(1)}:1
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-1/15">
                <Heart className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">NPS</p>
                <p className="font-mono text-xl font-bold">{data.nps}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Retention & Churn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Retention Rate</span>
                <span className="font-mono font-semibold text-chart-2">{data.retentionRate.toFixed(1)}%</span>
              </div>
              <Progress value={data.retentionRate} className="h-2 [&>div]:bg-chart-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Churn Rate</span>
                <span className="font-mono font-semibold text-destructive">{data.churnRate.toFixed(1)}%</span>
              </div>
              <Progress value={data.churnRate} className="h-2 [&>div]:bg-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              Customer Segments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={segmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {segmentData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                      formatter={(value: number) => [formatCurrency(value, true), "Revenue"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {data.segments.map((segment, index) => (
                  <div key={segment.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-muted-foreground">{segment.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{segment.customers} customers</span>
                      <span className="font-mono font-medium">{formatCurrency(segment.revenue, true)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Acquisition Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.channels} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="acquisitions" name="Acquisitions" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4" />
              Churn Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.churnSignals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Heart className="h-10 w-10 text-chart-2" />
                <p className="mt-3 text-sm font-medium">No Churn Signals Detected</p>
                <p className="text-xs text-muted-foreground">Customer base is healthy</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.churnSignals.map((signal, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between rounded-md border p-3",
                      getRiskColor(signal.risk)
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">{signal.signal}</p>
                        <p className="text-xs opacity-80">
                          {signal.affectedCustomers} customers affected
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={cn("uppercase", getRiskColor(signal.risk))}>
                      {signal.risk}
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
