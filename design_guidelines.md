# B-NOS Design Guidelines

## Design Approach
**Reference-Based**: Drawing from modern analytical platforms - Linear (clean productivity aesthetics), Stripe Dashboard (data clarity), Vercel Analytics (visual hierarchy), and Tableau (data visualization excellence). This creates a sophisticated decision intelligence interface prioritizing data comprehension and actionable insights.

## Typography System

**Font Stack**: Inter (primary), JetBrains Mono (data/numbers)
- Headers: 32px (Page), 24px (Module), 18px (Section), 14px (Card)
- Body: 14px (default), 12px (metadata/labels)
- Data Display: 20px (primary metrics), 16px (secondary), 12px (supporting)
- Weights: 600 (headers), 500 (emphasis), 400 (body), 300 (de-emphasized)
- Monospace for all numerical values, currencies, percentages for alignment

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Component padding: p-6 (cards), p-8 (modules)
- Section spacing: space-y-8 (within modules), space-y-12 (between modules)
- Grid gaps: gap-6 (standard), gap-4 (dense data)

**Dashboard Structure**:
- Fixed sidebar navigation (w-64, left-aligned)
- Top bar: h-16 with breadcrumbs, view switcher, global filters
- Main content area: max-w-screen-2xl with px-8 py-6
- Three-column grid system: grid-cols-12 for flexible layouts

## Component Library

### Navigation Architecture
**Sidebar Navigation**:
- Grouped modules with collapsible sections
- Active state: full-width accent indicator (w-1 left border)
- Icon + label pairs (24px icons, 14px labels)
- Module sections: ROI Brain, Profit Pulse, Market Scanner, Operations, Customer Intelligence, Forecast, Strategy

**View Switcher (Top Bar)**:
- Segmented control: Pilot View | Deep-Dive | Action Mode
- 44px height, rounded-lg, subtle transitions

### Data Visualization Components

**Metric Cards**:
- min-h-32 with p-6
- Structure: Label (12px, uppercase), Value (24px bold), Change Indicator (12px with trend arrow), Sparkline (h-12)
- Grid layouts: grid-cols-4 for primary metrics, grid-cols-3 for detailed views

**ROI Score Display**:
- Circular progress indicator: 120px diameter
- Center: Score (32px bold) with /100 (14px light)
- Ring thickness: 8px
- Surrounding context: 4 quadrant labels for ROI dimensions

**Chart Containers**:
- min-h-96 for primary charts, min-h-64 for supporting
- Header: Title (18px) + time range selector + export button
- Chart area: p-6 with responsive aspect ratios
- Legend: horizontal below chart, 12px with color indicators

### Data Tables
- Sticky header: h-12 with 12px uppercase labels
- Row height: 48px minimum with py-3
- Striped rows for improved scannability
- Right-aligned numerical columns
- Action column: w-24 fixed right
- Sorting indicators on all headers
- Pagination: bottom-aligned, 44px height

### Strategy Output Cards
- Prominent layout: p-8 with border-l-4 accent
- Structure:
  - Action badge (Scale/Optimize/Monitor/Test/Stop): px-3 py-1, rounded-full, 12px uppercase
  - Expected ROI: 32px bold with trend visualization
  - Reasoning: 14px, max 3 lines
  - Time estimate: 12px with clock icon
  - CTA button: full-width at bottom

### Alert System
- Fixed top-right positioning: top-20 right-8
- Stacked alerts with space-y-4
- Alert card: min-w-96, max-w-md, p-4
- Icon (20px) + message (14px) + dismiss button
- Types: Tax Risk (critical), Cash Warning (warning), Insight (info)

### Forecast Simulator
- Modal overlay: max-w-4xl centered
- Input section: grid-cols-2 gap-6 for parameter inputs
- Real-time preview: right panel showing projected metrics
- Scenario comparison table: side-by-side columns
- Action bar: bottom-fixed with Cancel + Run Simulation buttons

## View-Specific Layouts

**Pilot View**: 
- Hero metrics: grid-cols-4 of large ROI cards
- Department performance: grid-cols-3 with mini charts
- Alert ticker: horizontal scrolling critical updates
- Global trends: full-width area chart (h-96)

**Deep-Dive View**:
- Left: Module selector (w-80, sticky)
- Right: Detailed breakdowns with tabs for sub-categories
- Data density: grid-cols-6 for granular metrics
- Comparison tables with sortable columns

**Action Mode**:
- Ranked list of recommendations (single column)
- Each recommendation: full-width card with detailed breakdown
- Priority indicators: 1-5 ranking badges
- Implementation timeline: horizontal progress bars

## Interaction Patterns
- Hover states: subtle elevation (shadow-md)
- Loading states: skeleton screens matching component structure
- Empty states: centered icon (48px) + message + CTA
- Filters: slide-over panel (w-96) from right
- Tooltips: 12px, max-w-xs on metric hover for definitions
- Drill-down: click metric → modal with detailed breakdown

## Responsive Behavior
- Desktop (1440px+): Full 12-column grid
- Laptop (1024px): Collapsible sidebar, grid-cols-8
- Tablet (768px): Hidden sidebar with hamburger, grid-cols-4
- Mobile: Not primary target, basic metric views only

**Critical**: Prioritize data density and decision clarity over decorative elements. Every pixel serves the purpose of faster, better business decisions.