import { z } from "zod";

// ROI Dimensions
export const roiDimensionSchema = z.object({
  financial: z.number().min(0).max(100),
  operational: z.number().min(0).max(100),
  market: z.number().min(0).max(100),
  strategic: z.number().min(0).max(100),
});

export type ROIDimension = z.infer<typeof roiDimensionSchema>;

// Department
export const departmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  roiScore: z.number().min(0).max(100),
  roiDimensions: roiDimensionSchema,
  revenue: z.number(),
  expenses: z.number(),
  headcount: z.number(),
  trend: z.enum(["up", "down", "stable"]),
  trendPercent: z.number(),
});

export type Department = z.infer<typeof departmentSchema>;

// Product
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  roiScore: z.number().min(0).max(100),
  revenue: z.number(),
  cost: z.number(),
  margin: z.number(),
  unitsSold: z.number(),
  trend: z.enum(["up", "down", "stable"]),
});

export type Product = z.infer<typeof productSchema>;

// Campaign
export const campaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  channel: z.string(),
  roiScore: z.number().min(0).max(100),
  spend: z.number(),
  revenue: z.number(),
  conversions: z.number(),
  cpa: z.number(),
  status: z.enum(["active", "paused", "completed"]),
});

export type Campaign = z.infer<typeof campaignSchema>;

// Employee
export const employeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  department: z.string(),
  role: z.string(),
  productivityScore: z.number().min(0).max(100),
  costToServe: z.number(),
  revenueGenerated: z.number(),
  tenure: z.number(),
});

export type Employee = z.infer<typeof employeeSchema>;

// Asset
export const assetSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  value: z.number(),
  roiScore: z.number().min(0).max(100),
  utilization: z.number(),
  maintenanceCost: z.number(),
});

export type Asset = z.infer<typeof assetSchema>;

// Financial Metrics
export const financialMetricsSchema = z.object({
  revenue: z.number(),
  expenses: z.number(),
  cogs: z.number(),
  opex: z.number(),
  capex: z.number(),
  netProfit: z.number(),
  grossMargin: z.number(),
  ebitda: z.number(),
  burnRate: z.number(),
  cashRunway: z.number(),
  marginStrengthIndex: z.number(),
  taxRisk: z.number(),
});

export type FinancialMetrics = z.infer<typeof financialMetricsSchema>;

// Market Data
export const marketDataSchema = z.object({
  opportunityScore: z.number().min(0).max(100),
  priceSensitivityIndex: z.number(),
  trendDirection: z.enum(["bullish", "bearish", "neutral"]),
  competitorPricing: z.array(z.object({
    competitor: z.string(),
    price: z.number(),
    change: z.number(),
  })),
  demandTrends: z.array(z.object({
    month: z.string(),
    demand: z.number(),
  })),
  seasonalPatterns: z.array(z.object({
    quarter: z.string(),
    performance: z.number(),
  })),
});

export type MarketData = z.infer<typeof marketDataSchema>;

// Operational Metrics
export const operationalMetricsSchema = z.object({
  productivityScore: z.number().min(0).max(100),
  costToServe: z.number(),
  deliverySlaHealth: z.number(),
  processEfficiency: z.number(),
  inventoryRotation: z.number(),
  supplyChainHealth: z.number(),
  bottlenecks: z.array(z.object({
    process: z.string(),
    severity: z.enum(["low", "medium", "high", "critical"]),
    impact: z.number(),
  })),
});

export type OperationalMetrics = z.infer<typeof operationalMetricsSchema>;

// Customer Intelligence
export const customerIntelligenceSchema = z.object({
  cac: z.number(),
  ltv: z.number(),
  ltvCacRatio: z.number(),
  retentionRate: z.number(),
  churnRate: z.number(),
  nps: z.number(),
  segments: z.array(z.object({
    name: z.string(),
    customers: z.number(),
    revenue: z.number(),
    profitability: z.number(),
  })),
  channels: z.array(z.object({
    name: z.string(),
    acquisitions: z.number(),
    cost: z.number(),
    conversion: z.number(),
  })),
  churnSignals: z.array(z.object({
    signal: z.string(),
    risk: z.enum(["low", "medium", "high"]),
    affectedCustomers: z.number(),
  })),
});

export type CustomerIntelligence = z.infer<typeof customerIntelligenceSchema>;

// Forecast Scenario
export const forecastScenarioSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["pricing", "scaling", "hiring", "marketing", "product_launch"]),
  parameters: z.record(z.number()),
  expectedRoi: z.number(),
  riskLevel: z.enum(["low", "medium", "high"]),
  timeToBreakeven: z.number(),
  revenueImpact: z.number(),
  confidenceLevel: z.number(),
});

export type ForecastScenario = z.infer<typeof forecastScenarioSchema>;

// Strategy Recommendation
export const recommendationSchema = z.object({
  id: z.string(),
  action: z.enum(["scale", "optimize", "monitor", "test", "stop"]),
  title: z.string(),
  description: z.string(),
  expectedRoiImpact: z.number(),
  reasoning: z.string(),
  timeToResult: z.string(),
  priority: z.number().min(1).max(5),
  category: z.string(),
  metrics: z.array(z.object({
    name: z.string(),
    current: z.number(),
    projected: z.number(),
  })),
});

export type Recommendation = z.infer<typeof recommendationSchema>;

// Alert
export const alertSchema = z.object({
  id: z.string(),
  type: z.enum(["tax_risk", "cash_warning", "overspend", "opportunity", "insight"]),
  severity: z.enum(["info", "warning", "critical"]),
  title: z.string(),
  message: z.string(),
  timestamp: z.string(),
  dismissed: z.boolean(),
});

export type Alert = z.infer<typeof alertSchema>;

// Global ROI Summary
export const globalRoiSchema = z.object({
  overallScore: z.number().min(0).max(100),
  dimensions: roiDimensionSchema,
  burnToReturnRatio: z.number(),
  cashRunway: z.number(),
  marginStrengthIndex: z.number(),
  trend: z.enum(["up", "down", "stable"]),
  trendPercent: z.number(),
});

export type GlobalROI = z.infer<typeof globalRoiSchema>;

// Time Series Data Point
export const timeSeriesPointSchema = z.object({
  date: z.string(),
  value: z.number(),
});

export type TimeSeriesPoint = z.infer<typeof timeSeriesPointSchema>;

// Dashboard Summary
export const dashboardSummarySchema = z.object({
  globalRoi: globalRoiSchema,
  financialMetrics: financialMetricsSchema,
  marketData: marketDataSchema,
  operationalMetrics: operationalMetricsSchema,
  customerIntelligence: customerIntelligenceSchema,
  alerts: z.array(alertSchema),
  recommendations: z.array(recommendationSchema),
  revenueHistory: z.array(timeSeriesPointSchema),
  roiHistory: z.array(timeSeriesPointSchema),
});

export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;

// View Mode
export type ViewMode = "pilot" | "deep-dive" | "action";

// Keep user schema for compatibility
import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
