import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Activity, TrendingUp, DollarSign, Target } from "lucide-react";
import type { Campaign } from "@shared/schema";

export default function CampaignsPage() {
  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: value >= 1000000 ? "compact" : "standard",
      maximumFractionDigits: value >= 1000000 ? 1 : 0,
    }).format(value);
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-chart-2 bg-chart-2/15";
    if (score >= 50) return "text-chart-4 bg-chart-4/15";
    return "text-destructive bg-destructive/15";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-chart-2/15 text-chart-2";
      case "paused":
        return "bg-chart-4/15 text-chart-4";
      case "completed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="min-h-full p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl">
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Activity className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-6 text-lg font-semibold">No Campaigns</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Campaign data will appear once your marketing campaigns are configured.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const avgCpa = totalConversions > 0 ? totalSpend / totalConversions : 0;

  return (
    <div className="min-h-full p-6 lg:p-8" data-testid="campaigns-page">
      <div className="mx-auto max-w-screen-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campaign Performance</h1>
          <p className="text-sm text-muted-foreground">
            Marketing campaign ROI and conversion metrics
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-2/15">
                  <Activity className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Active Campaigns
                  </p>
                  <p className="font-mono text-xl font-bold">{activeCampaigns.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-5/15">
                  <DollarSign className="h-5 w-5 text-chart-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Total Spend
                  </p>
                  <p className="font-mono text-xl font-bold">{formatCurrency(totalSpend)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-1/15">
                  <TrendingUp className="h-5 w-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Revenue Generated
                  </p>
                  <p className="font-mono text-xl font-bold">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-4/15">
                  <Target className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Avg. CPA
                  </p>
                  <p className="font-mono text-xl font-bold">{formatCurrency(avgCpa)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">All Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">ROI Score</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Conversions</TableHead>
                  <TableHead className="text-right">CPA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id} data-testid={`campaign-row-${campaign.id}`}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {campaign.channel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn("uppercase", getStatusColor(campaign.status))}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className={cn("font-mono", getScoreColor(campaign.roiScore))}>
                        {campaign.roiScore}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {formatCurrency(campaign.spend)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(campaign.revenue)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {campaign.conversions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(campaign.cpa)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
