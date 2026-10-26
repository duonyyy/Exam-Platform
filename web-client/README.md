# 💻 ThiSmart — Web Client (Next.js 15+ App Router)

> Modern Frontend Web Client for the **ThiSmart** (*Thi thông minh. Đánh giá chính xác.*) enterprise examination platform, engineered with **Next.js 15+ (App Router)**, **React 19**, **TypeScript Strict Mode**, **Tailwind CSS**, and **TanStack Query v5**.

Detailed frontend specifications, brand identity, and screen catalogs:
- [Frontend Architecture & UX Design (docs/05-frontend/17-FRONTEND_DESIGN.md)](../docs/05-frontend/17-FRONTEND_DESIGN.md)
- [Brand Identity & Creative Assets (docs/05-frontend/THISMART_BRAND_GUIDELINES.md)](../docs/05-frontend/THISMART_BRAND_GUIDELINES.md)
- [17 Screen Specifications & Wireframes (docs/05-frontend/SCREEN_SPECIFICATIONS.md)](../docs/05-frontend/SCREEN_SPECIFICATIONS.md)

---

## 🏗️ 1. System Requirements & Prerequisites

- **Node.js**: `>= 20.x` (Active LTS recommended)
- **Package Manager**: `pnpm >= 9.x` (or `npm >= 10.x`)
- **Backend Core API**: Running at `http://localhost:8000/api/v1` (via Docker Compose)

---

## 🚀 2. Installation & Environment Configuration

### 2.1. Install Dependencies
```bash
cd web-client
pnpm install
```

### 2.2. Environment Variables Setup
Create `.env.local` from `.env.example`:
```bash
cp .env.example .env.local
```

File content `.env.local`:
```env
# Base URL for Laravel REST API
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Environment mode
NEXT_PUBLIC_APP_ENV=development
```

---

## 🛠️ 3. Development & Quality Assurance Commands

| Command | Technical Purpose |
| :--- | :--- |
| `pnpm dev` | Start development server (Port `3000`) with Fast Refresh & Turbopack |
| `pnpm build` | Production bundle compilation (Type checking & Static Generation) |
| `pnpm start` | Run compiled production build |
| `pnpm lint` | Static code analysis via ESLint |
| `pnpm typecheck` | Type safety verification via TypeScript (`tsc --noEmit`) |
| `pnpm test` | Automated Component & Unit test suite |

---

## 📂 4. Feature-Driven Monorepo Directory Layout

```text
web-client/
├── public/
│   └── brand/                               # Official Brand Assets (ThiSmart Concept 03: logos, favicons)
├── src/
│   ├── app/                                 # Next.js 15+ App Router (Routing, Layouts & Page Composition)
│   │   ├── (auth)/                          # Public Auth Route Group (login, register, forgot-password)
│   │   ├── (workspace)/                     # Authenticated Workspace Layout (Sidebar, Topbar)
│   │   │   ├── admin/                       # Admin Portal (User Management, Audit Logs, Settings)
│   │   │   ├── teacher/                     # Teacher Portal (Subjects, Question Bank, Exams, Sessions, Monitoring)
│   │   │   └── student/                     # Student Portal (Dashboard, Assigned Sessions, Results)
│   │   ├── (focus)/                         # Focus Exam Room (Distraction-Free Layout, Timer, Autosave)
│   │   │   └── exam/[attemptId]/
│   │   ├── forbidden/page.tsx               # 403 Forbidden Error Boundary
│   │   ├── not-found.tsx                    # 404 Not Found Error Boundary
│   │   └── layout.tsx                       # Root Layout (QueryClientProvider, Inter Font, Toaster)
│   │
│   ├── features/                            # Self-contained Business Feature Modules
│   │   ├── auth/                            # Authentication, User Profile, Session Guards
│   │   ├── users/                           # User Management & RBAC Administration
│   │   ├── subjects/                        # Academic Taxonomy (Subjects & Topics)
│   │   ├── questions/                       # Question Bank (4 Canonical Types, JSON Options, Bulk Excel Import)
│   │   ├── exams/                           # Exam Templates & Question Pivot Composition
│   │   ├── exam-sessions/                   # Session Scheduling, Proctoring, Candidate Assignment
│   │   ├── exam-taking/                     # Focus Mode Taking (Debounced Autosave 500ms, Server Clock, Proctoring)
│   │   ├── examops/                         # AI Copilot Integration (Blueprint Matrix, Human Review Gate)
│   │   └── results/                         # Gradebook, Official Reports Export (PDF/Excel)
│   │
│   ├── components/                          # Shared UI Component Library
│   │   ├── ui/                              # Atomic Primitives (Button, Input, Select, Dialog, Card, Badge, Skeleton)
│   │   ├── layout/                          # AppSidebar, AppHeader, PageContainer
│   │   └── feedback/                        # EmptyState, ErrorState, LoadingState
│   │
│   ├── lib/                                 # Infrastructure & Technical Configurations
│   │   ├── api/                             # Typed HTTP Client & Error Normalization
│   │   ├── query/                           # TanStack Query Client & Query Keys Factory
│   │   └── utils/                           # Tailwind clsx/tailwind-merge helper, Date formatters
│   │
│   ├── types/                               # Canonical DTOs, API Envelopes, Pagination Metadata
│   └── middleware.ts                        # Edge Middleware for Route Guarding
├── .env.example
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔌 5. Data Fetching & Server State Management Pattern

Strict prohibition of ad-hoc `fetch()` calls inside UI components:

```text
[UI Component]
      │
      ▼ (invoke feature hook)
[features/{domain}/hooks/useX.ts]
      │
      ▼ (manage cache, optimistic updates & invalidation)
[TanStack Query: useQuery / useMutation]
      │
      ▼ (typed API fetcher function)
[features/{domain}/api/x.ts]
      │
      ▼ (inject Bearer Token & handle 401/403/422 envelopes)
[lib/api/client.ts]
      │
      ▼ HTTP Request
[Laravel Backend REST API: http://localhost:8000/api/v1]
```

---

## 🔒 6. Frontend Security & Defense-in-Depth

1. **Zero-Leakage Policy**: Strictly no `correct_answer`, `explanation`, or scoring weights stored in client bundles or LocalStorage.
2. **XSS Mitigation**: Sensitive auth tokens are never stored in plain `localStorage`. Secure communication uses **HttpOnly, Secure Cookies** with SameSite policy.
3. **Dual-Layer Validation**:
   - Layer 1 (Client-side): Zod Schema Validation for instant, interactive user feedback.
   - Layer 2 (Server-side): Laravel Form Request serves as the authoritative boundary; `422 Unprocessable Content` errors are mapped back to form fields.
4. **Edge Route Protection**: `src/middleware.ts` intercepts unauthorized role navigation at the edge (e.g. Student attempting `/admin/*`), backed by authoritative Laravel Policies on every API endpoint.

---

## 🚀 7. Production Deployment (Vercel Ready)

- **Monorepo Configuration**: Fully integrated [`vercel.json`](./vercel.json) specifying build commands, pnpm cache, and HTTP Security Headers.
- **First-Party Cookie Reverse Proxy**: [`next.config.ts`](./next.config.ts) proxies `/api/backend/*` to Laravel Core API (`INTERNAL_BACKEND_URL`), ensuring First-Party HttpOnly Cookies work across domains without third-party cookie restrictions.
- **Automated CI/CD**: Preview Deployments for Pull Requests and Production Deployments via GitHub Actions (`.github/workflows/deploy-frontend-vercel.yml`).
