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
import { Package, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { Product } from "@shared/schema";

export default function ProductsPage() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
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

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-chart-2" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
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

  if (!products || products.length === 0) {
    return (
      <div className="min-h-full p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl">
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-6 text-lg font-semibold">No Products</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Product data will appear once your catalog is configured.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const avgMargin = products.reduce((sum, p) => sum + p.margin, 0) / products.length;
  const topProduct = [...products].sort((a, b) => b.roiScore - a.roiScore)[0];
  const totalUnits = products.reduce((sum, p) => sum + p.unitsSold, 0);

  return (
    <div className="min-h-full p-6 lg:p-8" data-testid="products-page">
      <div className="mx-auto max-w-screen-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Product ROI Analysis</h1>
          <p className="text-sm text-muted-foreground">
            Performance metrics and profitability by product
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Products
              </p>
              <p className="mt-2 font-mono text-2xl font-bold">{products.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Revenue
              </p>
              <p className="mt-2 font-mono text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Avg. Margin
              </p>
              <p className="mt-2 font-mono text-2xl font-bold">{avgMargin.toFixed(1)}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Units Sold
              </p>
              <p className="mt-2 font-mono text-2xl font-bold">{totalUnits.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Product Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">ROI Score</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead className="text-right">Units</TableHead>
                  <TableHead className="text-center">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} data-testid={`product-row-${product.id}`}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className={cn("font-mono", getScoreColor(product.roiScore))}>
                        {product.roiScore}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(product.revenue)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {formatCurrency(product.cost)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {product.margin.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {product.unitsSold.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <TrendIcon trend={product.trend} />
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
