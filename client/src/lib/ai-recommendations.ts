import type { UserBusinessData } from "./user-data";
import type { Recommendation } from "@shared/schema";

export function generateSmartRecommendations(data: UserBusinessData): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const netProfit = data.revenue - data.expenses;
  const grossMargin = (data.revenue - data.cogs) / data.revenue;
  const ltvCacRatio = data.ltv / Math.max(data.cac, 1);
  const costPerEmployee = data.expenses / Math.max(data.employees, 1);
  const revenuePerEmployee = data.revenue / Math.max(data.employees, 1);

  // Recommendation 1: Profitability optimization
  if (netProfit / data.revenue < 0.3) {
    recommendations.push({
      id: "rec-1",
      action: "optimize",
      title: "Improve Profit Margins",
      description: `Your profit margin is ${(grossMargin * 100).toFixed(1)}%. Consider reducing COGS or increasing prices.`,
      expectedRoiImpact: Math.min(25, (0.35 - grossMargin) * 100),
      reasoning: `Current margin of ${(grossMargin * 100).toFixed(1)}% is below industry average of 40-45%. Even 5% improvement adds $${Math.round(data.revenue * 0.05).toLocaleString()} annually.`,
      timeToResult: "2-3 months",
      priority: 1,
      category: "Finance",
      metrics: [
        { name: "Gross Margin", current: Math.round(grossMargin * 100), projected: 45 },
        { name: "Net Profit", current: Math.round(netProfit), projected: Math.round(data.revenue * 0.35) },
      ],
    });
  }

  // Recommendation 2: Customer acquisition efficiency
  if (ltvCacRatio < 3) {
    recommendations.push({
      id: "rec-2",
      action: "optimize",
      title: "Reduce Customer Acquisition Cost",
      description: `Your LTV:CAC ratio is ${ltvCacRatio.toFixed(2)}x. Industry standard is 3:1. Improve organic channels.`,
      expectedRoiImpact: 18.2,
      reasoning: `With CAC of $${data.cac} and LTV of $${data.ltv}, each customer barely breaks even. Reducing CAC by 20% improves profitability significantly.`,
      timeToResult: "1-2 months",
      priority: ltvCacRatio < 2 ? 1 : 2,
      category: "Marketing",
      metrics: [
        { name: "CAC", current: data.cac, projected: Math.round(data.cac * 0.8) },
        { name: "LTV:CAC Ratio", current: Math.round(ltvCacRatio * 100) / 100, projected: 3 },
      ],
    });
  }

  // Recommendation 3: Workforce optimization
  const industry_rev_per_employee = 150000;
  if (revenuePerEmployee < industry_rev_per_employee * 0.7) {
    recommendations.push({
      id: "rec-3",
      action: "optimize",
      title: "Improve Workforce Productivity",
      description: `Revenue per employee is $${Math.round(revenuePerEmployee).toLocaleString()}. Target is $${industry_rev_per_employee.toLocaleString()}.`,
      expectedRoiImpact: 15.3,
      reasoning: `Your team generates $${Math.round(revenuePerEmployee).toLocaleString()} per person vs industry avg $${industry_rev_per_employee.toLocaleString()}. Automation or training could boost this.`,
      timeToResult: "3-6 months",
      priority: 2,
      category: "Operations",
      metrics: [
        { name: "Revenue per Employee", current: Math.round(revenuePerEmployee), projected: Math.round(industry_rev_per_employee * 0.9) },
      ],
    });
  }

  // Recommendation 4: Retention focus
  if (data.churnRate > 10) {
    recommendations.push({
      id: "rec-4",
      action: "monitor",
      title: "Reduce Customer Churn",
      description: `Your churn rate of ${data.churnRate}% is high. Reducing by 2% adds $${Math.round(data.customers * data.ltv * 0.02).toLocaleString()} in lifetime value.`,
      expectedRoiImpact: Math.min(30, data.churnRate * 2),
      reasoning: `Each 1% reduction in churn increases LTV by ~${(data.ltv * 0.01).toFixed(0)}. Focus on customer success and onboarding.`,
      timeToResult: "2-4 months",
      priority: 2,
      category: "Customer Success",
      metrics: [
        { name: "Churn Rate", current: data.churnRate, projected: Math.max(2, data.churnRate - 2) },
        { name: "Customer LTV", current: data.ltv, projected: Math.round(data.ltv * 1.15) },
      ],
    });
  }

  // Recommendation 5: Scaling opportunity
  if (data.revenue > 5000000 && data.employees < 100) {
    recommendations.push({
      id: "rec-5",
      action: "scale",
      title: "Scale Sales Organization",
      description: `With $${Math.round(data.revenue / 1000000).toLocaleString()}M revenue and lean team, add sales capacity to capture demand.`,
      expectedRoiImpact: 28.5,
      reasoning: `Your revenue-to-employee ratio suggests strong demand. Scaling sales team 3x could capture more market share with existing efficiency.`,
      timeToResult: "6-9 months",
      priority: 1,
      category: "Sales",
      metrics: [
        { name: "Sales Team Size", current: Math.max(1, Math.floor(data.employees * 0.2)), projected: Math.floor(data.employees * 0.4) },
        { name: "Revenue", current: Math.round(data.revenue), projected: Math.round(data.revenue * 1.4) },
      ],
    });
  }

  // Recommendation 6: Cash runway warning
  const monthly_burn = data.burnRate;
  const monthly_profit = netProfit / 12;
  const months_runway = Math.abs(monthly_profit - monthly_burn) > 0 
    ? Math.round(1000000 / Math.max(monthly_burn - monthly_profit, 1))
    : 36;

  if (months_runway < 12) {
    recommendations.push({
      id: "rec-6",
      action: "monitor",
      title: "Monitor Cash Position",
      description: `Current cash runway is ~${months_runway} months at current burn rate. Prioritize profitability.`,
      expectedRoiImpact: 5,
      reasoning: `With burn rate of $${monthly_burn.toLocaleString()} and profit of $${Math.round(monthly_profit).toLocaleString()}/month, ensure 12+ month runway.`,
      timeToResult: "Immediate",
      priority: months_runway < 6 ? 1 : 3,
      category: "Finance",
      metrics: [
        { name: "Monthly Burn", current: monthly_burn, projected: Math.round(monthly_burn * 0.8) },
        { name: "Cash Runway", current: months_runway, projected: 12 },
      ],
    });
  }

  return recommendations.slice(0, 5); // Return top 5 recommendations
}
