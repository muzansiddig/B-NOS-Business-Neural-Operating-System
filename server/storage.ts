import { randomUUID, scryptSync, randomBytes } from "crypto";
import type {
  User,
  InsertUser,
  Department,
  Product,
  Campaign,
  Employee,
  Asset,
  FinancialMetrics,
  MarketData,
  OperationalMetrics,
  CustomerIntelligence,
  ForecastScenario,
  Recommendation,
  Alert,
  GlobalROI,
  TimeSeriesPoint,
  DashboardSummary,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getDashboardSummary(): Promise<DashboardSummary>;
  getGlobalROI(): Promise<GlobalROI>;
  getDepartments(): Promise<Department[]>;
  getProducts(): Promise<Product[]>;
  getCampaigns(): Promise<Campaign[]>;
  getEmployees(): Promise<Employee[]>;
  getAssets(): Promise<Asset[]>;
  getFinancialMetrics(): Promise<FinancialMetrics>;
  getMarketData(): Promise<MarketData>;
  getOperationalMetrics(): Promise<OperationalMetrics>;
  getCustomerIntelligence(): Promise<CustomerIntelligence>;
  getForecasts(): Promise<ForecastScenario[]>;
  getRecommendations(): Promise<Recommendation[]>;
  getAlerts(): Promise<Alert[]>;
  getRevenueHistory(): Promise<TimeSeriesPoint[]>;
  getROIHistory(): Promise<TimeSeriesPoint[]>;
  dismissAlert(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User & { passwordHash: string }>;
  private departments: Department[];
  private products: Product[];
  private campaigns: Campaign[];
  private employees: Employee[];
  private assets: Asset[];
  private forecasts: ForecastScenario[];
  private recommendations: Recommendation[];
  private alerts: Alert[];

  constructor() {
    this.users = new Map();
    this.departments = this.generateDepartments();
    this.products = this.generateProducts();
    this.campaigns = this.generateCampaigns();
    this.employees = this.generateEmployees();
    this.assets = this.generateAssets();
    this.forecasts = this.generateForecasts();
    this.recommendations = this.generateRecommendations();
    this.alerts = this.generateAlerts();
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16);
    const derivedKey = scryptSync(password, salt, 64);
    return `${salt.toString("hex")}:${derivedKey.toString("hex")}`;
  }

  private verifyPassword(password: string, hash: string): boolean {
    const [saltHex, hashHex] = hash.split(":");
    const salt = Buffer.from(saltHex, "hex");
    const derivedKey = scryptSync(password, salt, 64);
    return derivedKey.toString("hex") === hashHex;
  }

  private generateDepartments(): Department[] {
    return [
      {
        id: "dept-1",
        name: "Engineering",
        roiScore: 82,
        roiDimensions: { financial: 78, operational: 88, market: 75, strategic: 87 },
        revenue: 2450000,
        expenses: 1850000,
        headcount: 45,
        trend: "up",
        trendPercent: 12.5,
      },
      {
        id: "dept-2",
        name: "Sales",
        roiScore: 76,
        roiDimensions: { financial: 85, operational: 72, market: 80, strategic: 68 },
        revenue: 4200000,
        expenses: 2100000,
        headcount: 32,
        trend: "up",
        trendPercent: 8.3,
      },
      {
        id: "dept-3",
        name: "Marketing",
        roiScore: 68,
        roiDimensions: { financial: 62, operational: 70, market: 78, strategic: 62 },
        revenue: 1800000,
        expenses: 1200000,
        headcount: 18,
        trend: "stable",
        trendPercent: 2.1,
      },
      {
        id: "dept-4",
        name: "Operations",
        roiScore: 71,
        roiDimensions: { financial: 68, operational: 82, market: 60, strategic: 74 },
        revenue: 980000,
        expenses: 720000,
        headcount: 28,
        trend: "up",
        trendPercent: 5.7,
      },
      {
        id: "dept-5",
        name: "Customer Success",
        roiScore: 79,
        roiDimensions: { financial: 72, operational: 85, market: 82, strategic: 76 },
        revenue: 1650000,
        expenses: 890000,
        headcount: 22,
        trend: "up",
        trendPercent: 9.2,
      },
      {
        id: "dept-6",
        name: "Finance",
        roiScore: 65,
        roiDimensions: { financial: 75, operational: 68, market: 52, strategic: 65 },
        revenue: 420000,
        expenses: 380000,
        headcount: 12,
        trend: "stable",
        trendPercent: 1.4,
      },
    ];
  }

  private generateProducts(): Product[] {
    return [
      {
        id: "prod-1",
        name: "Enterprise Suite",
        category: "Software",
        roiScore: 88,
        revenue: 3200000,
        cost: 1280000,
        margin: 60.0,
        unitsSold: 245,
        trend: "up",
      },
      {
        id: "prod-2",
        name: "Professional Plan",
        category: "Subscription",
        roiScore: 82,
        revenue: 1850000,
        cost: 555000,
        margin: 70.0,
        unitsSold: 1420,
        trend: "up",
      },
      {
        id: "prod-3",
        name: "Starter Package",
        category: "Subscription",
        roiScore: 72,
        revenue: 680000,
        cost: 272000,
        margin: 60.0,
        unitsSold: 3200,
        trend: "stable",
      },
      {
        id: "prod-4",
        name: "API Access",
        category: "Service",
        roiScore: 91,
        revenue: 920000,
        cost: 184000,
        margin: 80.0,
        unitsSold: 680,
        trend: "up",
      },
      {
        id: "prod-5",
        name: "Consulting Services",
        category: "Service",
        roiScore: 65,
        revenue: 480000,
        cost: 312000,
        margin: 35.0,
        unitsSold: 48,
        trend: "down",
      },
      {
        id: "prod-6",
        name: "Training Programs",
        category: "Education",
        roiScore: 58,
        revenue: 220000,
        cost: 132000,
        margin: 40.0,
        unitsSold: 890,
        trend: "stable",
      },
    ];
  }

  private generateCampaigns(): Campaign[] {
    return [
      {
        id: "camp-1",
        name: "Q4 Product Launch",
        channel: "Multi-channel",
        roiScore: 85,
        spend: 180000,
        revenue: 720000,
        conversions: 1240,
        cpa: 145.16,
        status: "active",
      },
      {
        id: "camp-2",
        name: "LinkedIn B2B",
        channel: "Social",
        roiScore: 78,
        spend: 45000,
        revenue: 198000,
        conversions: 320,
        cpa: 140.63,
        status: "active",
      },
      {
        id: "camp-3",
        name: "Google Ads SEM",
        channel: "Paid Search",
        roiScore: 72,
        spend: 85000,
        revenue: 340000,
        conversions: 580,
        cpa: 146.55,
        status: "active",
      },
      {
        id: "camp-4",
        name: "Content Marketing",
        channel: "Organic",
        roiScore: 81,
        spend: 32000,
        revenue: 145000,
        conversions: 890,
        cpa: 35.96,
        status: "active",
      },
      {
        id: "camp-5",
        name: "Email Nurture",
        channel: "Email",
        roiScore: 88,
        spend: 12000,
        revenue: 98000,
        conversions: 420,
        cpa: 28.57,
        status: "completed",
      },
      {
        id: "camp-6",
        name: "Industry Webinars",
        channel: "Events",
        roiScore: 62,
        spend: 28000,
        revenue: 65000,
        conversions: 180,
        cpa: 155.56,
        status: "paused",
      },
    ];
  }

  private generateEmployees(): Employee[] {
    const departments = ["Engineering", "Sales", "Marketing", "Operations", "Customer Success", "Finance"];
    const roles = ["Manager", "Senior", "Lead", "Specialist", "Analyst"];
    
    return Array.from({ length: 20 }, (_, i) => ({
      id: `emp-${i + 1}`,
      name: `Employee ${i + 1}`,
      department: departments[i % departments.length],
      role: roles[i % roles.length],
      productivityScore: 60 + Math.floor(Math.random() * 35),
      costToServe: 4500 + Math.floor(Math.random() * 3000),
      revenueGenerated: 25000 + Math.floor(Math.random() * 75000),
      tenure: 1 + Math.floor(Math.random() * 8),
    }));
  }

  private generateAssets(): Asset[] {
    return [
      {
        id: "asset-1",
        name: "Cloud Infrastructure",
        type: "Technology",
        value: 850000,
        roiScore: 85,
        utilization: 78,
        maintenanceCost: 42000,
      },
      {
        id: "asset-2",
        name: "Office Space HQ",
        type: "Real Estate",
        value: 2200000,
        roiScore: 62,
        utilization: 65,
        maintenanceCost: 180000,
      },
      {
        id: "asset-3",
        name: "Development Tools",
        type: "Software",
        value: 120000,
        roiScore: 92,
        utilization: 95,
        maintenanceCost: 24000,
      },
      {
        id: "asset-4",
        name: "Sales Automation",
        type: "Software",
        value: 85000,
        roiScore: 78,
        utilization: 82,
        maintenanceCost: 18000,
      },
    ];
  }

  private generateForecasts(): ForecastScenario[] {
    return [
      {
        id: "forecast-1",
        name: "Price Increase 15%",
        type: "pricing",
        parameters: { priceChange: 15, volumeImpact: -8 },
        expectedRoi: 22.5,
        riskLevel: "medium",
        timeToBreakeven: 4,
        revenueImpact: 480000,
        confidenceLevel: 72,
      },
      {
        id: "forecast-2",
        name: "Engineering Scale-up",
        type: "scaling",
        parameters: { capacityIncrease: 50, investment: 350000 },
        expectedRoi: 35.2,
        riskLevel: "medium",
        timeToBreakeven: 8,
        revenueImpact: 1200000,
        confidenceLevel: 68,
      },
      {
        id: "forecast-3",
        name: "Marketing Budget 2x",
        type: "marketing",
        parameters: { budgetIncrease: 100, campaignDuration: 6 },
        expectedRoi: 28.4,
        riskLevel: "high",
        timeToBreakeven: 5,
        revenueImpact: 650000,
        confidenceLevel: 58,
      },
      {
        id: "forecast-4",
        name: "New Product Line",
        type: "product_launch",
        parameters: { developmentCost: 450000, expectedRevenue: 1500000 },
        expectedRoi: 42.8,
        riskLevel: "high",
        timeToBreakeven: 12,
        revenueImpact: 1500000,
        confidenceLevel: 52,
      },
    ];
  }

  private generateRecommendations(): Recommendation[] {
    return [
      {
        id: "rec-1",
        action: "scale",
        title: "Expand Enterprise Sales Team",
        description: "Add 5 enterprise account executives to capture growing market demand",
        expectedRoiImpact: 32.5,
        reasoning: "Enterprise segment shows 40% higher LTV and current team is at capacity. Win rate has dropped 15% due to bandwidth constraints.",
        timeToResult: "6-9 months",
        priority: 1,
        category: "Sales",
        metrics: [
          { name: "Pipeline", current: 2400000, projected: 4200000 },
          { name: "Win Rate", current: 28, projected: 35 },
          { name: "Deal Size", current: 85000, projected: 95000 },
        ],
      },
      {
        id: "rec-2",
        action: "optimize",
        title: "Reduce Customer Acquisition Cost",
        description: "Shift 30% of paid marketing budget to content and referral programs",
        expectedRoiImpact: 18.2,
        reasoning: "Organic and referral channels show 3x better ROI than paid acquisition. Content leads have 45% higher conversion rate.",
        timeToResult: "3-4 months",
        priority: 2,
        category: "Marketing",
        metrics: [
          { name: "CAC", current: 485, projected: 340 },
          { name: "Organic Traffic", current: 45000, projected: 72000 },
          { name: "Referral Rate", current: 12, projected: 22 },
        ],
      },
      {
        id: "rec-3",
        action: "monitor",
        title: "Track Consulting Service Performance",
        description: "Consulting services showing declining margins - monitor for next quarter",
        expectedRoiImpact: 5.0,
        reasoning: "Margin dropped from 42% to 35% over last 2 quarters. May need pricing adjustment or service restructuring.",
        timeToResult: "1 quarter",
        priority: 3,
        category: "Operations",
        metrics: [
          { name: "Margin", current: 35, projected: 40 },
          { name: "Utilization", current: 68, projected: 75 },
        ],
      },
      {
        id: "rec-4",
        action: "test",
        title: "A/B Test New Pricing Tier",
        description: "Introduce mid-tier pricing between Professional and Enterprise",
        expectedRoiImpact: 15.8,
        reasoning: "30% of lost deals cite pricing as barrier. Mid-tier could capture segment willing to pay more than Pro but not ready for Enterprise.",
        timeToResult: "2-3 months",
        priority: 2,
        category: "Product",
        metrics: [
          { name: "Conversion", current: 3.2, projected: 4.8 },
          { name: "ARPU", current: 720, projected: 850 },
        ],
      },
      {
        id: "rec-5",
        action: "stop",
        title: "Discontinue Industry Webinars",
        description: "Webinar campaign showing negative ROI after 6 months",
        expectedRoiImpact: 8.5,
        reasoning: "Cost per acquisition $155 vs $35 for content marketing. Audience engagement declining 20% month over month.",
        timeToResult: "Immediate",
        priority: 4,
        category: "Marketing",
        metrics: [
          { name: "CPA", current: 155, projected: 0 },
          { name: "Budget Saved", current: 0, projected: 28000 },
        ],
      },
    ];
  }

  private generateAlerts(): Alert[] {
    const now = new Date();
    return [
      {
        id: "alert-1",
        type: "cash_warning",
        severity: "warning",
        title: "Cash Runway Below Target",
        message: "Current runway is 14 months, below the 18-month safety threshold. Consider reviewing upcoming CAPEX.",
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        dismissed: false,
      },
      {
        id: "alert-2",
        type: "opportunity",
        severity: "info",
        title: "Enterprise Segment Growth",
        message: "Enterprise pipeline increased 45% this quarter. Consider accelerating sales hiring plan.",
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
        dismissed: false,
      },
      {
        id: "alert-3",
        type: "overspend",
        severity: "warning",
        title: "Marketing Budget Overspend",
        message: "Marketing department is 12% over quarterly budget. Review campaign performance for optimization.",
        timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
        dismissed: false,
      },
      {
        id: "alert-4",
        type: "insight",
        severity: "info",
        title: "High-Performing Product Identified",
        message: "API Access product showing 91 ROI score with 80% margin. Consider increased marketing investment.",
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        dismissed: false,
      },
    ];
  }

  private generateTimeSeriesData(months: number, baseValue: number, volatility: number): TimeSeriesPoint[] {
    const data: TimeSeriesPoint[] = [];
    const now = new Date();
    let value = baseValue;

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const change = (Math.random() - 0.4) * volatility;
      value = Math.max(baseValue * 0.7, Math.min(baseValue * 1.4, value + value * change));
      
      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        value: Math.round(value),
      });
    }

    return data;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const passwordHash = this.hashPassword(insertUser.password);
    const user: User & { passwordHash: string } = { ...insertUser, id, passwordHash };
    this.users.set(id, user);
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const users = Array.from(this.users.values());
    const user = users.find((u) => u.username === username);
    
    if (!user || !this.verifyPassword(password, user.passwordHash)) {
      return null;
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getGlobalROI(): Promise<GlobalROI> {
    return {
      overallScore: 74,
      dimensions: {
        financial: 72,
        operational: 78,
        market: 71,
        strategic: 75,
      },
      burnToReturnRatio: 1.85,
      cashRunway: 14,
      marginStrengthIndex: 68.5,
      trend: "up",
      trendPercent: 8.2,
    };
  }

  async getDepartments(): Promise<Department[]> {
    return this.departments;
  }

  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async getCampaigns(): Promise<Campaign[]> {
    return this.campaigns;
  }

  async getEmployees(): Promise<Employee[]> {
    return this.employees;
  }

  async getAssets(): Promise<Asset[]> {
    return this.assets;
  }

  async getFinancialMetrics(): Promise<FinancialMetrics> {
    return {
      revenue: 11500000,
      expenses: 7140000,
      cogs: 3450000,
      opex: 2890000,
      capex: 800000,
      netProfit: 4360000,
      grossMargin: 0.70,
      ebitda: 5200000,
      burnRate: 425000,
      cashRunway: 14,
      marginStrengthIndex: 68.5,
      taxRisk: 35,
    };
  }

  async getMarketData(): Promise<MarketData> {
    return {
      opportunityScore: 72,
      priceSensitivityIndex: 0.68,
      trendDirection: "bullish",
      competitorPricing: [
        { competitor: "CompetitorA", price: 899, change: 5 },
        { competitor: "CompetitorB", price: 749, change: -3 },
        { competitor: "CompetitorC", price: 1199, change: 0 },
        { competitor: "CompetitorD", price: 649, change: 8 },
      ],
      demandTrends: [
        { month: "Jan", demand: 245 },
        { month: "Feb", demand: 268 },
        { month: "Mar", demand: 312 },
        { month: "Apr", demand: 298 },
        { month: "May", demand: 345 },
        { month: "Jun", demand: 378 },
        { month: "Jul", demand: 356 },
        { month: "Aug", demand: 412 },
        { month: "Sep", demand: 445 },
        { month: "Oct", demand: 478 },
        { month: "Nov", demand: 512 },
        { month: "Dec", demand: 489 },
      ],
      seasonalPatterns: [
        { quarter: "Q1", performance: 82 },
        { quarter: "Q2", performance: 95 },
        { quarter: "Q3", performance: 88 },
        { quarter: "Q4", performance: 115 },
      ],
    };
  }

  async getOperationalMetrics(): Promise<OperationalMetrics> {
    return {
      productivityScore: 76,
      costToServe: 4850,
      deliverySlaHealth: 94.2,
      processEfficiency: 82.5,
      inventoryRotation: 8.4,
      supplyChainHealth: 88,
      bottlenecks: [
        { process: "Customer Onboarding", severity: "medium", impact: 12.5 },
        { process: "Invoice Processing", severity: "low", impact: 5.2 },
        { process: "Support Ticket Resolution", severity: "high", impact: 18.8 },
      ],
    };
  }

  async getCustomerIntelligence(): Promise<CustomerIntelligence> {
    return {
      cac: 485,
      ltv: 4200,
      ltvCacRatio: 8.66,
      retentionRate: 92.5,
      churnRate: 7.5,
      nps: 42,
      segments: [
        { name: "Enterprise", customers: 145, revenue: 4850000, profitability: 68 },
        { name: "Mid-Market", customers: 420, revenue: 2940000, profitability: 55 },
        { name: "SMB", customers: 1850, revenue: 2220000, profitability: 42 },
        { name: "Startup", customers: 2400, revenue: 1440000, profitability: 35 },
      ],
      channels: [
        { name: "Direct Sales", acquisitions: 180, cost: 162000, conversion: 28 },
        { name: "Inbound", acquisitions: 450, cost: 67500, conversion: 12 },
        { name: "Partner", acquisitions: 120, cost: 48000, conversion: 35 },
        { name: "Referral", acquisitions: 280, cost: 28000, conversion: 45 },
      ],
      churnSignals: [
        { signal: "Decreased Login Frequency", risk: "high", affectedCustomers: 85 },
        { signal: "Support Ticket Surge", risk: "medium", affectedCustomers: 42 },
        { signal: "Feature Underutilization", risk: "low", affectedCustomers: 120 },
      ],
    };
  }

  async getForecasts(): Promise<ForecastScenario[]> {
    return this.forecasts;
  }

  async getRecommendations(): Promise<Recommendation[]> {
    return this.recommendations;
  }

  async getAlerts(): Promise<Alert[]> {
    return this.alerts;
  }

  async getRevenueHistory(): Promise<TimeSeriesPoint[]> {
    return this.generateTimeSeriesData(12, 950000, 0.08);
  }

  async getROIHistory(): Promise<TimeSeriesPoint[]> {
    return this.generateTimeSeriesData(12, 70, 0.05);
  }

  async dismissAlert(id: string): Promise<void> {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      alert.dismissed = true;
    }
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    const [
      globalRoi,
      financialMetrics,
      marketData,
      operationalMetrics,
      customerIntelligence,
      alerts,
      recommendations,
      revenueHistory,
      roiHistory,
    ] = await Promise.all([
      this.getGlobalROI(),
      this.getFinancialMetrics(),
      this.getMarketData(),
      this.getOperationalMetrics(),
      this.getCustomerIntelligence(),
      this.getAlerts(),
      this.getRecommendations(),
      this.getRevenueHistory(),
      this.getROIHistory(),
    ]);

    return {
      globalRoi,
      financialMetrics,
      marketData,
      operationalMetrics,
      customerIntelligence,
      alerts,
      recommendations,
      revenueHistory,
      roiHistory,
    };
  }
}

export const storage = new MemStorage();
