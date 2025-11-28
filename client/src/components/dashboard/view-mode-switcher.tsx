import { cn } from "@/lib/utils";
import { Gauge, Layers, Zap } from "lucide-react";
import type { ViewMode } from "@shared/schema";

interface ViewModeSwitcherProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}

const viewModes = [
  {
    value: "pilot" as ViewMode,
    label: "Pilot View",
    icon: Gauge,
    description: "High-level strategic health",
  },
  {
    value: "deep-dive" as ViewMode,
    label: "Deep-Dive",
    icon: Layers,
    description: "Component-level breakdown",
  },
  {
    value: "action" as ViewMode,
    label: "Action Mode",
    icon: Zap,
    description: "Recommended next moves",
  },
];

export function ViewModeSwitcher({ value, onChange, className }: ViewModeSwitcherProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border bg-muted/50 p-1",
        className
      )}
      role="tablist"
      data-testid="view-mode-switcher"
    >
      {viewModes.map((mode) => {
        const Icon = mode.icon;
        const isActive = value === mode.value;
        return (
          <button
            key={mode.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(mode.value)}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            data-testid={`button-view-${mode.value}`}
          >
            <Icon className="h-4 w-4" />
            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
