import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { UserProfileBadge } from "@/components/user-profile-badge";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import ProfitPulse from "@/pages/profit-pulse";
import MarketScannerPage from "@/pages/market-scanner";
import OperationsPage from "@/pages/operations";
import CustomerIntelligencePage from "@/pages/customer-intelligence";
import ForecastPage from "@/pages/forecast";
import RecommendationsPage from "@/pages/recommendations";
import DepartmentsPage from "@/pages/departments";
import ProductsPage from "@/pages/products";
import CampaignsPage from "@/pages/campaigns";

function ProtectedRouter() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/profit-pulse" component={ProfitPulse} />
      <Route path="/market-scanner" component={MarketScannerPage} />
      <Route path="/operations" component={OperationsPage} />
      <Route path="/customer-intelligence" component={CustomerIntelligencePage} />
      <Route path="/forecast" component={ForecastPage} />
      <Route path="/recommendations" component={RecommendationsPage} />
      <Route path="/departments" component={DepartmentsPage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/campaigns" component={CampaignsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route>
          {() => <LoginPage />}
        </Route>
      </Switch>
    );
  }

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserProfileBadge />
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-muted/30">
            <ProtectedRouter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="bnos-theme">
        <TooltipProvider>
          <AuthProvider>
            <AppContent />
            <Toaster />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
