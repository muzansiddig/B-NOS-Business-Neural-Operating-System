import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerAIRoutes } from "./routes-ai";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register AI routes
  await registerAIRoutes(app);
  // Authentication endpoints
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const user = await storage.authenticateUser(email, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const nameFromEmail = user.username.split("@")[0].charAt(0).toUpperCase() + user.username.split("@")[0].slice(1);
      res.json({
        id: user.id,
        email: user.username,
        name: nameFromEmail,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: "Email, password, and name required" });
      }

      const existingUser = await storage.getUserByUsername(email);
      if (existingUser) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const newUser = await storage.createUser({
        username: email,
        password: password,
      });

      res.json({
        id: newUser.id,
        email: newUser.username,
        name: name,
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Signup failed" });
    }
  });

  app.patch("/api/auth/profile", async (req, res) => {
    try {
      const { name, location } = req.body;
      res.json({
        success: true,
        name,
        location,
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: "Profile update failed" });
    }
  });

  // Dashboard summary endpoint
  app.get("/api/dashboard", async (req, res) => {
    try {
      const summary = await storage.getDashboardSummary();
      res.json(summary);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  // Global ROI endpoint
  app.get("/api/global-roi", async (req, res) => {
    try {
      const roi = await storage.getGlobalROI();
      res.json(roi);
    } catch (error) {
      console.error("Error fetching global ROI:", error);
      res.status(500).json({ error: "Failed to fetch global ROI" });
    }
  });

  // Departments endpoint
  app.get("/api/departments", async (req, res) => {
    try {
      const departments = await storage.getDepartments();
      res.json(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ error: "Failed to fetch departments" });
    }
  });

  // Products endpoint
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Campaigns endpoint
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  });

  // Employees endpoint
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  // Assets endpoint
  app.get("/api/assets", async (req, res) => {
    try {
      const assets = await storage.getAssets();
      res.json(assets);
    } catch (error) {
      console.error("Error fetching assets:", error);
      res.status(500).json({ error: "Failed to fetch assets" });
    }
  });

  // Financial metrics endpoint
  app.get("/api/financial-metrics", async (req, res) => {
    try {
      const metrics = await storage.getFinancialMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching financial metrics:", error);
      res.status(500).json({ error: "Failed to fetch financial metrics" });
    }
  });

  // Market data endpoint
  app.get("/api/market-data", async (req, res) => {
    try {
      const data = await storage.getMarketData();
      res.json(data);
    } catch (error) {
      console.error("Error fetching market data:", error);
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  // Operational metrics endpoint
  app.get("/api/operational-metrics", async (req, res) => {
    try {
      const metrics = await storage.getOperationalMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching operational metrics:", error);
      res.status(500).json({ error: "Failed to fetch operational metrics" });
    }
  });

  // Customer intelligence endpoint
  app.get("/api/customer-intelligence", async (req, res) => {
    try {
      const data = await storage.getCustomerIntelligence();
      res.json(data);
    } catch (error) {
      console.error("Error fetching customer intelligence:", error);
      res.status(500).json({ error: "Failed to fetch customer intelligence" });
    }
  });

  // Forecasts endpoint
  app.get("/api/forecasts", async (req, res) => {
    try {
      const forecasts = await storage.getForecasts();
      res.json(forecasts);
    } catch (error) {
      console.error("Error fetching forecasts:", error);
      res.status(500).json({ error: "Failed to fetch forecasts" });
    }
  });

  // Recommendations endpoint
  app.get("/api/recommendations", async (req, res) => {
    try {
      const recommendations = await storage.getRecommendations();
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  // Alerts endpoint
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  // Dismiss alert endpoint
  app.post("/api/alerts/:id/dismiss", async (req, res) => {
    try {
      await storage.dismissAlert(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error dismissing alert:", error);
      res.status(500).json({ error: "Failed to dismiss alert" });
    }
  });

  // Revenue history endpoint
  app.get("/api/revenue-history", async (req, res) => {
    try {
      const history = await storage.getRevenueHistory();
      res.json(history);
    } catch (error) {
      console.error("Error fetching revenue history:", error);
      res.status(500).json({ error: "Failed to fetch revenue history" });
    }
  });

  // ROI history endpoint
  app.get("/api/roi-history", async (req, res) => {
    try {
      const history = await storage.getROIHistory();
      res.json(history);
    } catch (error) {
      console.error("Error fetching ROI history:", error);
      res.status(500).json({ error: "Failed to fetch ROI history" });
    }
  });

  return httpServer;
}
