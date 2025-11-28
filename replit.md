# B-NOS (Business Neural Operating System)

## Overview

B-NOS is a comprehensive analytical decision system designed to evaluate every aspect of a business through the lens of ROI across four key dimensions: Financial, Operational, Market, and Strategic. Unlike traditional dashboards, B-NOS operates as a "business decision brain" that collects data, analyzes it, forecasts scenarios, and generates actionable recommendations.

The system provides real-time insights across six core modules: Global ROI Brain, Profit Pulse Engine, Market Reality Scanner, Operational Efficiency Engine, Customer Lifetime Intelligence Hub, and Forecast & Scenario Simulator. Each module measures, scores, and ranks insights based on multi-dimensional ROI analysis to drive data-informed business decisions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing (SPA architecture)
- TanStack Query (React Query) for server state management with automatic caching and refetching

**UI Component System**
- shadcn/ui component library (Radix UI primitives) for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for variant-based component styling
- Design system follows guidelines from `design_guidelines.md` inspired by Linear, Stripe Dashboard, and Vercel Analytics

**Component Organization**
- Modular dashboard components in `client/src/components/dashboard/`
- Reusable UI primitives in `client/src/components/ui/`
- Page-level components in `client/src/pages/`
- Custom hooks in `client/src/hooks/`

**Theming & Styling**
- Light/dark theme support via ThemeProvider context
- CSS custom properties for dynamic theming
- Inter font for general UI, JetBrains Mono for numerical data display
- Responsive design with mobile-first approach

### Backend Architecture

**Server Framework**
- Express.js HTTP server with TypeScript
- RESTful API design pattern for data endpoints
- In-memory storage implementation (MemStorage class) for demo/development
- Session-based architecture prepared (though not fully implemented in current state)

**API Structure**
- `/api/dashboard` - Global dashboard summary with ROI metrics
- `/api/global-roi` - Overall ROI score and dimensions
- `/api/departments` - Department-level performance data
- `/api/products` - Product-level ROI and metrics
- `/api/campaigns` - Marketing campaign analytics
- `/api/financial-metrics` - Profit pulse financial data
- `/api/market-data` - Market scanner insights
- `/api/operational-metrics` - Operational efficiency data
- `/api/customer-intelligence` - Customer lifetime value analytics
- `/api/forecasts` - Scenario simulation results
- `/api/recommendations` - AI-driven action recommendations
- `/api/alerts` - System-generated alerts and warnings

**Data Layer Pattern**
- Storage interface (IStorage) defines contract for data operations
- Current implementation uses in-memory storage with mock data
- Schema definitions in `shared/schema.ts` using Zod for validation
- Prepared for database integration via Drizzle ORM

**Development Server**
- Vite middleware integration for HMR during development
- Static file serving for production builds
- Request logging with timing metrics
- Error handling middleware

### Data Storage Design

**Prepared Database Stack**
- Drizzle ORM configured for PostgreSQL via `@neondatabase/serverless`
- Schema migrations directory structure in place
- Database connection via environment variable `DATABASE_URL`
- Type-safe queries using drizzle-zod integration

**Current State**
- Application uses in-memory storage (not yet connected to PostgreSQL)
- Schema types defined but database tables not implemented
- Migration configuration ready in `drizzle.config.ts`

**Data Models**
- User authentication schema (prepared)
- Business entities: Departments, Products, Campaigns, Employees, Assets
- Financial metrics: Revenue, expenses, COGS, OPEX, CAPEX, margins
- Market data: Competitor pricing, demand trends, market opportunities
- Operational metrics: Productivity, efficiency, bottlenecks
- Customer intelligence: CAC, LTV, retention, churn analysis
- Forecasts and recommendations with ROI projections

### Authentication & Authorization

**Prepared But Not Active**
- Session management configuration with `express-session` and `connect-pg-simple`
- User schema defined in shared types
- Storage interface includes user lookup methods
- Passport.js dependencies present but not integrated

**Current State**
- No active authentication flow
- No protected routes
- Ready for implementation when needed

### Build & Deployment

**Production Build Process**
- Client: Vite builds React app to `dist/public`
- Server: esbuild bundles TypeScript server to `dist/index.cjs`
- Selective bundling of dependencies (allowlist approach) to reduce cold start times
- Build script in `script/build.ts` coordinates both builds

**Development Workflow**
- `npm run dev` - Starts Express server with Vite middleware for HMR
- `npm run build` - Production build of both client and server
- `npm start` - Runs production build
- `npm run db:push` - Pushes Drizzle schema to database (when configured)

## External Dependencies

### UI & Visualization
- **Recharts** - Chart rendering for financial trends, ROI visualizations, market data
- **Radix UI Primitives** - Accessible component foundations (dialogs, dropdowns, popovers, etc.)
- **Lucide React** - Icon library for consistent iconography
- **date-fns** - Date formatting and manipulation

### Data & Forms
- **React Hook Form** - Form state management
- **Zod** - Runtime type validation and schema definitions
- **@hookform/resolvers** - Zod integration with React Hook Form

### Backend Services
- **@neondatabase/serverless** - Serverless PostgreSQL driver (configured but not actively used)
- **Drizzle ORM** - Type-safe database ORM (configured for future use)
- **Express.js** - HTTP server framework
- **CORS** - Cross-origin resource sharing middleware

### State Management
- **TanStack Query** - Server state management, caching, and synchronization
- **Wouter** - Lightweight routing library

### Development Tools
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety across stack
- **ESBuild** - Fast JavaScript bundler for server build
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing with Autoprefixer

### Prepared Integrations (Not Yet Active)
- Authentication: Passport.js, bcrypt, jsonwebtoken
- Email: Nodemailer (dependency present)
- File uploads: Multer (dependency present)
- Payments: Stripe SDK (dependency present)
- AI: OpenAI SDK, Google Generative AI (dependencies present)
- WebSockets: ws (dependency present)
- Data export: xlsx (dependency present)