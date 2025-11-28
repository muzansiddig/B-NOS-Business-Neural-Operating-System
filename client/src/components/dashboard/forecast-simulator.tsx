import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, Clock, AlertTriangle, DollarSign, BarChart3, Play } from "lucide-react";
import type { ForecastScenario } from "@shared/schema";

interface ForecastSimulatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSimulate?: (params: SimulationParams) => Promise<ForecastScenario>;
}

interface SimulationParams {
  type: "pricing" | "scaling" | "hiring" | "marketing" | "product_launch";
  name: string;
  parameters: Record<string, number>;
}

const scenarioTypes = [
  { value: "pricing", label: "Pricing Change", icon: DollarSign },
  { value: "scaling", label: "Scaling Strategy", icon: TrendingUp },
  { value: "hiring", label: "Hiring Plan", icon: BarChart3 },
  { value: "marketing", label: "Marketing Spend", icon: TrendingUp },
  { value: "product_launch", label: "Product Launch", icon: Play },
];

const defaultParams: Record<string, { label: string; min: number; max: number; step: number; unit: string }[]> = {
  pricing: [
    { label: "Price Change", min: -50, max: 50, step: 1, unit: "%" },
    { label: "Volume Impact", min: -30, max: 30, step: 1, unit: "%" },
  ],
  scaling: [
    { label: "Capacity Increase", min: 10, max: 200, step: 10, unit: "%" },
    { label: "Investment", min: 50000, max: 1000000, step: 50000, unit: "$" },
  ],
  hiring: [
    { label: "New Hires", min: 1, max: 50, step: 1, unit: "" },
    { label: "Salary Per Hire", min: 40000, max: 200000, step: 10000, unit: "$" },
  ],
  marketing: [
    { label: "Budget Increase", min: 10, max: 300, step: 10, unit: "%" },
    { label: "Campaign Duration", min: 1, max: 12, step: 1, unit: "months" },
  ],
  product_launch: [
    { label: "Development Cost", min: 100000, max: 2000000, step: 100000, unit: "$" },
    { label: "Expected Revenue", min: 200000, max: 5000000, step: 100000, unit: "$" },
  ],
};

export function ForecastSimulator({ open, onOpenChange, onSimulate }: ForecastSimulatorProps) {
  const [scenarioType, setScenarioType] = useState<string>("pricing");
  const [scenarioName, setScenarioName] = useState("");
  const [parameters, setParameters] = useState<Record<string, number>>({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<ForecastScenario | null>(null);

  const currentParams = defaultParams[scenarioType] || [];

  const handleParameterChange = (label: string, value: number) => {
    setParameters((prev) => ({ ...prev, [label]: value }));
  };

  const handleSimulate = async () => {
    if (!onSimulate) {
      setResult({
        id: "sim-1",
        name: scenarioName || `${scenarioType} Simulation`,
        type: scenarioType as ForecastScenario["type"],
        parameters,
        expectedRoi: Math.random() * 40 + 10,
        riskLevel: Math.random() > 0.6 ? "high" : Math.random() > 0.3 ? "medium" : "low",
        timeToBreakeven: Math.floor(Math.random() * 18) + 3,
        revenueImpact: Math.floor(Math.random() * 500000) + 100000,
        confidenceLevel: Math.random() * 30 + 60,
      });
      return;
    }

    setIsSimulating(true);
    try {
      const scenario = await onSimulate({
        type: scenarioType as ForecastScenario["type"],
        name: scenarioName,
        parameters,
      });
      setResult(scenario);
    } finally {
      setIsSimulating(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-chart-2/15 text-chart-2";
      case "medium":
        return "bg-chart-4/15 text-chart-4";
      case "high":
        return "bg-destructive/15 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="forecast-simulator-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Forecast & Scenario Simulator
          </DialogTitle>
          <DialogDescription>
            Model different business scenarios and see projected ROI, risk levels, and time to break-even.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Scenario Type</Label>
              <Select value={scenarioType} onValueChange={setScenarioType}>
                <SelectTrigger data-testid="select-scenario-type">
                  <SelectValue placeholder="Select scenario type" />
                </SelectTrigger>
                <SelectContent>
                  {scenarioTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Scenario Name</Label>
              <Input
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                placeholder="Enter a name for this scenario"
                data-testid="input-scenario-name"
              />
            </div>

            <div className="space-y-4">
              <Label>Parameters</Label>
              {currentParams.map((param) => (
                <div key={param.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{param.label}</span>
                    <span className="font-mono text-sm">
                      {param.unit === "$" && "$"}
                      {parameters[param.label] ?? param.min}
                      {param.unit !== "$" && param.unit}
                    </span>
                  </div>
                  <Slider
                    value={[parameters[param.label] ?? param.min]}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    onValueChange={([value]) => handleParameterChange(param.label, value)}
                    data-testid={`slider-${param.label.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Simulation Results</Label>
            {result ? (
              <Card data-testid="simulation-result">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{result.name}</h3>
                    <Badge className={cn(getRiskColor(result.riskLevel))}>
                      {result.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-md bg-muted/50 p-3 text-center">
                      <TrendingUp className="mx-auto h-5 w-5 text-chart-2" />
                      <p className="mt-2 font-mono text-2xl font-bold text-chart-2">
                        +{result.expectedRoi.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Expected ROI</p>
                    </div>
                    <div className="rounded-md bg-muted/50 p-3 text-center">
                      <Clock className="mx-auto h-5 w-5 text-chart-4" />
                      <p className="mt-2 font-mono text-2xl font-bold">
                        {result.timeToBreakeven}
                      </p>
                      <p className="text-xs text-muted-foreground">Months to Break-even</p>
                    </div>
                  </div>

                  <div className="rounded-md bg-muted/50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Revenue Impact</span>
                      <span className="font-mono font-semibold">
                        ${result.revenueImpact.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Confidence Level</span>
                      <span className="font-mono font-semibold">{result.confidenceLevel.toFixed(0)}%</span>
                    </div>
                  </div>

                  {result.riskLevel === "high" && (
                    <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                      <p className="text-xs text-destructive">
                        High risk scenario. Consider reducing scope or testing with smaller parameters first.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Configure your scenario parameters and run a simulation to see projected results.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-close-simulator">
            Cancel
          </Button>
          <Button onClick={handleSimulate} disabled={isSimulating} data-testid="button-run-simulation">
            {isSimulating ? (
              <>Simulating...</>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Simulation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
