import type { DashboardSummary } from "@shared/schema";
import { generateSmartRecommendations } from "./ai-recommendations";

export interface UserBusinessData {
  revenue: number;
  expenses: number;
  cogs: number;
  opex: number;
  capex: number;
  burnRate: number;
  employees: number;
  customers: number;
  cac: number;
  ltv: number;
  retentionRate: number;
  churnRate: number;
}

const DEFAULT_DATA: UserBusinessData = {
  revenue: 11500000,
  expenses: 7140000,
  cogs: 3450000,
  opex: 2890000,
  capex: 800000,
  burnRate: 425000,
  employees: 150,
  customers: 4815,
  cac: 485,
  ltv: 4200,
  retentionRate: 92.5,
  churnRate: 7.5,
};

const STORAGE_KEY = "bnos_user_data";

export function saveUserData(data: UserBusinessData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadUserData(): UserBusinessData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_DATA;
    }
  }
  return DEFAULT_DATA;
}

export function calculateMetrics(data: UserBusinessData): DashboardSummary {
  const netProfit = data.revenue - data.expenses;
  const grossMargin = (data.revenue - data.cogs) / data.revenue;
  const ebitda = netProfit + (data.opex * 0.2); // Simplified
  const cashRunway = Math.floor((netProfit * 12) / Math.max(data.burnRate, 1));
  const marginStrengthIndex = grossMargin * 100;
  const ltvCacRatio = data.ltv / Math.max(data.cac, 1);
  const burnToReturnRatio = data.burnRate / Math.max(data.revenue / 12, 1);

  // Calculate ROI scores
  const financialRoi = Math.min(100, (netProfit / data.revenue) * 100 + 50);
  const operationalRoi = Math.min(100, (data.employees > 0 ? (data.revenue / data.employees) / 50000 * 100 : 50));
  const marketRoi = Math.min(100, ltvCacRatio * 10);
  const strategicRoi = Math.min(100, (data.retentionRate + 50));
  const overallScore = Math.round((financialRoi + operationalRoi + marketRoi + strategicRoi) / 4);

  return {
    globalRoi: {
      overallScore,
      dimensions: {
        financial: Math.round(financialRoi),
        operational: Math.round(operationalRoi),
        market: Math.round(marketRoi),
        strategic: Math.round(strategicRoi),
      },
      burnToReturnRatio: Math.round(burnToReturnRatio * 100) / 100,
      cashRunway: Math.max(0, cashRunway),
      marginStrengthIndex: Math.round(marginStrengthIndex * 10) / 10,
      trend: netProfit > 0 ? "up" : "down",
      trendPercent: Math.round((netProfit / data.revenue) * 1000) / 10,
    },
    financialMetrics: {
      revenue: data.revenue,
      expenses: data.expenses,
      cogs: data.cogs,
      opex: data.opex,
      capex: data.capex,
      netProfit,
      grossMargin,
      ebitda: Math.round(ebitda),
      burnRate: data.burnRate,
      cashRunway,
      marginStrengthIndex,
      taxRisk: Math.max(0, Math.min(100, 35 - (netProfit / data.revenue) * 10)),
    },
    marketData: {
      opportunityScore: Math.round(marketRoi),
      priceSensitivityIndex: 0.68,
      trendDirection: "bullish",
      competitorPricing: [
        { competitor: "CompetitorA", price: 899, change: 5 },
        { competitor: "CompetitorB", price: 749, change: -3 },
        { competitor: "CompetitorC", price: 1199, change: 0 },
        { competitor: "CompetitorD", price: 649, change: 8 },
      ],
      demandTrends: Array.from({ length: 12 }, (_, i) => ({
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
        demand: Math.round(200 + (data.revenue / 12000) + Math.random() * 100),
      })),
      seasonalPatterns: [
        { quarter: "Q1", performance: 82 },
        { quarter: "Q2", performance: 95 },
        { quarter: "Q3", performance: 88 },
        { quarter: "Q4", performance: 115 },
      ],
    },
    operationalMetrics: {
      productivityScore: Math.min(100, (data.revenue / (data.employees * 50000)) * 100),
      costToServe: Math.round(data.expenses / Math.max(data.customers, 1)),
      deliverySlaHealth: 94.2,
      processEfficiency: 82.5,
      inventoryRotation: 8.4,
      supplyChainHealth: 88,
      bottlenecks: [
        { process: "Customer Onboarding", severity: "medium" as const, impact: 12.5 },
        { process: "Invoice Processing", severity: "low" as const, impact: 5.2 },
        { process: "Support Ticket Resolution", severity: "high" as const, impact: 18.8 },
      ],
    },
    customerIntelligence: {
      cac: data.cac,
      ltv: data.ltv,
      ltvCacRatio,
      retentionRate: data.retentionRate,
      churnRate: data.churnRate,
      nps: 42,
      segments: [
        { name: "Enterprise", customers: Math.round(data.customers * 0.03), revenue: Math.round(data.revenue * 0.42), profitability: 68 },
        { name: "Mid-Market", customers: Math.round(data.customers * 0.09), revenue: Math.round(data.revenue * 0.26), profitability: 55 },
        { name: "SMB", customers: Math.round(data.customers * 0.38), revenue: Math.round(data.revenue * 0.19), profitability: 42 },
        { name: "Startup", customers: Math.round(data.customers * 0.50), revenue: Math.round(data.revenue * 0.13), profitability: 35 },
      ],
      channels: [
        { name: "Direct Sales", acquisitions: 180, cost: 162000, conversion: 28 },
        { name: "Inbound", acquisitions: 450, cost: 67500, conversion: 12 },
        { name: "Partner", acquisitions: 120, cost: 48000, conversion: 35 },
        { name: "Referral", acquisitions: 280, cost: 28000, conversion: 45 },
      ],
      churnSignals: [
        { signal: "Decreased Login Frequency", risk: "high" as const, affectedCustomers: 85 },
        { signal: "Support Ticket Surge", risk: "medium" as const, affectedCustomers: 42 },
        { signal: "Feature Underutilization", risk: "low" as const, affectedCustomers: 120 },
      ],
    },
    alerts: [
      { id: "1", type: "cash_warning" as const, severity: "warning" as const, title: "Cash Runway", message: `Current runway is ${cashRunway} months. Monitor burn rate.`, timestamp: new Date().toISOString(), dismissed: false },
    ],
    recommendations: generateSmartRecommendations(data),
    revenueHistory: Array.from({ length: 12 }, (_, i) => ({
      date: ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"][i] + " 25",
      value: Math.round(data.revenue / 12 + Math.random() * (data.revenue * 0.1)),
    })),
    roiHistory: Array.from({ length: 12 }, () => ({ date: "Monthly", value: overallScore })),
  };
}
