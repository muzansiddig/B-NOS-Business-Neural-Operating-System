import { Link, useLocation } from "wouter";
import {
  Brain,
  TrendingUp,
  Globe,
  Cog,
  Users,
  LineChart,
  Target,
  BarChart3,
  DollarSign,
  Activity,
  Layers,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    group: "Overview",
    items: [
      {
        title: "ROI Brain Core",
        url: "/",
        icon: Brain,
      },
    ],
  },
  {
    group: "Analysis",
    items: [
      {
        title: "Profit Pulse",
        url: "/profit-pulse",
        icon: DollarSign,
      },
      {
        title: "Market Scanner",
        url: "/market-scanner",
        icon: Globe,
      },
      {
        title: "Operations",
        url: "/operations",
        icon: Cog,
      },
      {
        title: "Customer Intel",
        url: "/customer-intelligence",
        icon: Users,
      },
    ],
  },
  {
    group: "Strategy",
    items: [
      {
        title: "Forecast",
        url: "/forecast",
        icon: LineChart,
      },
      {
        title: "Recommendations",
        url: "/recommendations",
        icon: Target,
      },
    ],
  },
  {
    group: "Breakdown",
    items: [
      {
        title: "Departments",
        url: "/departments",
        icon: Layers,
      },
      {
        title: "Products",
        url: "/products",
        icon: BarChart3,
      },
      {
        title: "Campaigns",
        url: "/campaigns",
        icon: Activity,
      },
    ],
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">B-NOS</span>
            <span className="text-xs text-muted-foreground">Neural Operating System</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        {navigationItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel className="px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="gap-3"
                      >
                        <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                          <item.icon className="h-4 w-4" />
                          <span className="text-sm">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="h-3 w-3" />
          <span>v1.0.0 | Real-time sync</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
