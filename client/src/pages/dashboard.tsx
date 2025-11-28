import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ROIScoreCard,
  MetricCard,
  AlertList,
  RecommendationCard,
  ViewModeSwitcher,
  DepartmentGrid,
  RevenueChart,
  ROITrendChart,
  ForecastSimulator,
} from "@/components/dashboard";
import { AIAgent } from "@/components/ai-agent";
import { DataInputForm } from "@/components/data-input-form";
import { loadUserData, saveUserData, calculateMetrics, type UserBusinessData } from "@/lib/user-data";
import type { DashboardSummary, ViewMode, Department } from "@shared/schema";
import { LineChart, Play, RefreshCw, Edit } from "lucide-react";

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>("pilot");
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [userData, setUserData] = useState<UserBusinessData>(loadUserData());
  const [data, setData] = useState<DashboardSummary>(calculateMetrics(userData));

  useEffect(() => {
    setData(calculateMetrics(userData));
  }, [userData]);

  const handleDataSave = (newData: UserBusinessData) => {
    setUserData(newData);
    saveUserData(newData);
  };

  const { data: departments } = useQuery<Department[]>({
    queryKey: ["/api/departments"],
  });

  const revenueChartData = data.revenueHistory.map((point) => ({
    date: point.date,
    revenue: point.value,
    expenses: Math.round(point.value * 0.62),
  }));

  const roiChartData = data.roiHistory.map((point) => ({
    date: point.date,
    value: point.value,
  }));

  return (
    <div className="min-h-full p-6 lg:p-8" data-testid="dashboard-page">
      <DataInputForm 
        open={editFormOpen} 
        onClose={() => setEditFormOpen(false)} 
        onSave={handleDataSave}
        initialData={userData}
      />

      <div className="mx-auto max-w-screen-2xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ROI Brain Core</h1>
            <p className="text-sm text-muted-foreground">
              Real-time business intelligence across all dimensions
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <AIAgent dashboardData={data} />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditFormOpen(true)}
              data-testid="button-edit-data"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Data
            </Button>
            <Button size="sm" onClick={() => setSimulatorOpen(true)} data-testid="button-simulate">
              <Play className="mr-2 h-4 w-4" />
              Simulate
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <ViewModeSwitcher value={viewMode} onChange={setViewMode} />
        </div>

        {viewMode === "pilot" && (
          <PilotView
            data={data}
            departments={departments || []}
            revenueChartData={revenueChartData}
            roiChartData={roiChartData}
          />
        )}

        {viewMode === "deep-dive" && (
          <DeepDiveView
            data={data}
            departments={departments || []}
            revenueChartData={revenueChartData}
          />
        )}

        {viewMode === "action" && <ActionView data={data} />}

        <ForecastSimulator open={simulatorOpen} onOpenChange={setSimulatorOpen} />
      </div>
    </div>
  );
}

interface ViewProps {
  data: DashboardSummary;
  departments: Department[];
  revenueChartData?: Array<{ date: string; revenue: number; expenses?: number }>;
  roiChartData?: Array<{ date: string; value: number }>;
}

function PilotView({ data, departments, revenueChartData, roiChartData }: ViewProps) {
  const sparklineData = data.roiHistory.map((p) => p.value);

  return (
    <div className="space-y-8">
      {data.alerts.filter((a) => !a.dismissed).length > 0 && (
        <AlertList alerts={data.alerts.filter((a) => a.severity === "critical")} />
      )}

      <div className="grid gap-6 lg:grid-cols-4">
        <ROIScoreCard
          score={data.globalRoi.overallScore}
          dimensions={data.globalRoi.dimensions}
          trend={data.globalRoi.trend}
          trendPercent={data.globalRoi.trendPercent}
          className="lg:row-span-2"
        />

        <MetricCard
          label="Revenue"
          value={data.financialMetrics.revenue}
          format="currency"
          change={12.5}
          trend="up"
          sparkline={sparklineData}
        />
        <MetricCard
          label="Net Profit"
          value={data.financialMetrics.netProfit}
          format="currency"
          change={8.3}
          trend={data.financialMetrics.netProfit >= 0 ? "up" : "down"}
          sparkline={sparklineData}
        />
        <MetricCard
          label="Gross Margin"
          value={data.financialMetrics.grossMargin * 100}
          format="percent"
          change={2.1}
          trend="up"
        />

        <MetricCard
          label="Burn-to-Return"
          value={data.globalRoi.burnToReturnRatio.toFixed(2)}
          suffix="x"
          change={-5.2}
          trend="up"
        />
        <MetricCard
          label="Cash Runway"
          value={data.globalRoi.cashRunway}
          suffix=" months"
          trend={data.globalRoi.cashRunway >= 12 ? "up" : "down"}
        />
        <MetricCard
          label="Margin Strength"
          value={data.globalRoi.marginStrengthIndex.toFixed(1)}
          change={3.8}
          trend="up"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {revenueChartData && <RevenueChart data={revenueChartData} />}
        {roiChartData && <ROITrendChart data={roiChartData} />}
      </div>

      {departments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Department Performance</h2>
          <DepartmentGrid departments={departments.slice(0, 6)} />
        </div>
      )}

      {data.recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top Recommendations</h2>
            <Button variant="ghost" size="sm" asChild>
              <a href="/recommendations" data-testid="link-all-recommendations">View all</a>
            </Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {data.recommendations.slice(0, 2).map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DeepDiveView({ data, departments, revenueChartData }: ViewProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="EBITDA"
          value={data.financialMetrics.ebitda}
          format="currency"
          trend={data.financialMetrics.ebitda >= 0 ? "up" : "down"}
        />
        <MetricCard
          label="COGS"
          value={data.financialMetrics.cogs}
          format="currency"
        />
        <MetricCard
          label="OPEX"
          value={data.financialMetrics.opex}
          format="currency"
        />
        <MetricCard
          label="CAPEX"
          value={data.financialMetrics.capex}
          format="currency"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {revenueChartData && <RevenueChart data={revenueChartData} />}
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Market Indicators</h3>
          <MetricCard
            label="Opportunity Score"
            value={data.marketData.opportunityScore}
            format="number"
          />
          <MetricCard
            label="Price Sensitivity"
            value={data.marketData.priceSensitivityIndex.toFixed(2)}
          />
          <MetricCard
            label="Customer LTV"
            value={data.customerIntelligence.ltv}
            format="currency"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Operational Metrics</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard
              label="Productivity"
              value={data.operationalMetrics.productivityScore}
              format="percent"
            />
            <MetricCard
              label="SLA Health"
              value={data.operationalMetrics.deliverySlaHealth}
              format="percent"
            />
            <MetricCard
              label="Cost to Serve"
              value={data.operationalMetrics.costToServe}
              format="currency"
            />
            <MetricCard
              label="Process Efficiency"
              value={data.operationalMetrics.processEfficiency}
              format="percent"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Customer Intelligence</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard
              label="CAC"
              value={data.customerIntelligence.cac}
              format="currency"
            />
            <MetricCard
              label="LTV:CAC Ratio"
              value={data.customerIntelligence.ltvCacRatio.toFixed(1)}
              suffix=":1"
            />
            <MetricCard
              label="Retention Rate"
              value={data.customerIntelligence.retentionRate}
              format="percent"
            />
            <MetricCard
              label="NPS"
              value={data.customerIntelligence.nps}
            />
          </div>
        </div>
      </div>

      {departments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">All Departments</h2>
          <DepartmentGrid departments={departments} />
        </div>
      )}

      <AlertList alerts={data.alerts} />
    </div>
  );
}

function ActionView({ data }: { data: DashboardSummary }) {
  const sortedRecommendations = [...data.recommendations].sort((a, b) => a.priority - b.priority);

  return (
    <div className="space-y-8">
      <AlertList alerts={data.alerts.filter((a) => !a.dismissed)} />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <LineChart className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Recommended Actions</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Prioritized list of actions to maximize ROI across all business dimensions
        </p>
      </div>

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
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <div className="mx-auto max-w-screen-2xl space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        <div className="flex justify-center">
          <Skeleton className="h-11 w-96" />
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <Skeleton className="h-64 lg:row-span-2" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    </div>
  );
}
