![Devlogger Banner](/public/images/devlogger-banner.png)

# Dev Logger

A full-stack developer logging app for capturing notes, progress, and breakthroughs as you build. Authenticated per-user logs, a tag system, weekly stats, and a layered theme engine — built issue-by-issue as a learning project.

---

## At a glance

| Cyber | Terminal | Military |
|---|---|---|
| ![cyber theme](/public/images/screenshots/cyber.png) | ![terminal theme](/public/images/screenshots/terminal.png) | ![military theme](/public/images/screenshots/military.png) |

| Stats view | Tags view |
|---|---|
| ![stats view](/public/images/screenshots/stats.png) | ![tags view](/public/images/screenshots/tags.png) |

---

## Features

### Logs
- **Full CRUD** with inline confirm-discard and confirm-delete guards
- **Tag chips** — type + Enter / comma to add, max 5 per log, normalized to `[a-z0-9-]+`
- **Search + sort** — client-side filter by title/content, sort by newest/oldest/A–Z, both compose with the active tag filter
- **Live character counters** — title (50) and content (800) turn red over budget
- **Loading states** — Add / Save / Delete show pending state via `try/finally` guards
- **Responsive grid** — 1 → 5 columns based on viewport

### Stats
- 5 stat cards — total, this week, this month, day streak, most active weekday
- 14-day activity chart scaled to the peak day
- Top tags with proportional usage bars
- Early-return empty state when no logs exist

### Tags
- Tag cloud with count badges, click-to-filter
- Filtered log list — only matching logs render while a tag is active
- Composes with search so you can narrow by tag + keyword simultaneously

### Authentication
- NextAuth.js v5 credentials provider with bcrypt hashing
- Stateless JWT sessions, edge-safe
- Rate limiting — 5 register / 10 signin per minute per IP, in-memory defense-in-depth
- Per-user isolation — every log query and mutation is `userId`-scoped (IDOR-safe)

### Theme system
- **27 unique combinations** — 3 app themes × 3 nav layouts × 3 toast layouts
- Persisted to your profile via a `settings` JSON column — survives sign-out
- One-click "Reset to defaults" in the settings panel
- Mobile-responsive nav — unified hamburger menu replaces all 3 nav variants at ≤768px

---

## Theme system

Three independent layers combine for 27 looks:

| Layer | Options |
|---|---|
| **App theme** | `cyber` (dark teal) · `terminal` (dark amber/gold) · `military` (white/forest green) |
| **Nav style** | `A` Command Bar · `B` Slim Signal · `C` Terminal Path |
| **Toast style** | `A` Signal bar · `B` HUD dot · `C` Minimal + ESC dismiss |

Theme tokens are CSS variables (`--primary`, `--surface`, `--btn-bg`, etc.). The component layer is theme-agnostic — adding a fourth app theme is one variable block, not a refactor.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router, Turbopack, Cache Components) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Auth | NextAuth.js v5 (beta) — credentials + JWT |
| Database | PostgreSQL (Docker locally) |
| ORM | Prisma 7 (driver adapter pattern, custom output path) |
| Runtime | React 19 / Server Actions |

---

## Architecture highlights

- **Prisma 7 driver adapter** — uses `PrismaPg` from `@prisma/adapter-pg` instead of the legacy datasource URL, with the generated client output redirected under `app/generated/prisma` for cleaner imports.
- **Cache Components + tag invalidation** — `getLogs(userId)` is wrapped with `"use cache"` and a per-user `cacheTag`, so mutations revalidate only the affected user's slice.
- **Lifted shared state** — `query`, `sortBy`, and `activeTag` all live in `DashboardShell`, with a single `useMemo` filter that composes search + tag filter + sort. Views receive the filtered list as a prop.
- **Button variant system** — `.btn` / `.btn--primary` / `.btn--danger` / `.btn--ghost` consolidates the action-row buttons across all 3 themes via CSS variable theming.
- **In-memory rate limiter** — module-scoped `Map` per process with rolling-window buckets. Defense-in-depth on a learning project; the swap path to Upstash/Redis is documented inline.
- **Type-safe constants** — limits (`TITLE_MAX`, `CONTENT_MAX`, `TAG_MAX_COUNT`, `TAG_MAX_LENGTH`) live in `lib/constants.ts` so validation messages, counters, and server-action checks all read from one source.

---

## Getting started

### Prerequisites

- Node.js 18+
- Docker + Docker Compose
- [direnv](https://direnv.net/) (recommended)

### 1. Clone and install

```bash
git clone https://github.com/bkness/devlogger.git
cd devlogger
npm install
```

### 2. Set up environment

```bash
cp .envrc.example .envrc
direnv allow
```

Required variables:

```bash
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
DATABASE_URL=postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB
AUTH_SECRET=          # generate with: openssl rand -base64 32
```

> **Note:** `AUTH_SECRET` must live in `.env` (not only `.envrc`) — direnv does not reach the Next.js process.

### 3. Start the database

```bash
docker compose up -d
```

### 4. Run migrations

```bash
npx prisma migrate deploy
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), register an account, and start logging.

---

## Project structure

```
devlogger/
├── app/
│   ├── actions.ts              # Server Actions (create, update, delete) — userId-scoped
│   ├── api/auth/[...nextauth]/ # NextAuth.js route handler
│   ├── login/page.tsx          # Login / register page
│   ├── page.tsx                # Dashboard (auth-gated)
│   ├── layout.tsx              # Root layout + SessionProvider
│   └── generated/prisma/       # Prisma 7 client output
├── components/
│   ├── DashboardShell.tsx      # Theme + filter state, lifted query/sort/activeTag
│   ├── LogDashboard.tsx        # Grid + search bar + sort dropdown + empty states
│   ├── LogCard.tsx             # Card with tag chips, keyboard-accessible
│   ├── LogForm.tsx             # Create form + edit panel (confirm-discard, confirm-delete)
│   ├── Navbar.tsx              # Renders nav theme A / B / C
│   ├── MobileNav.tsx           # Unified hamburger menu for ≤768px
│   ├── SettingsPanel.tsx       # Theme picker + reset-to-defaults
│   ├── StatsView.tsx           # 5 cards + 14-day chart + top tags
│   ├── TagsView.tsx            # Tag cloud + filtered log list
│   └── Toast.tsx               # Renders toast theme A / B / C
├── lib/
│   ├── auth-actions.ts         # register() server action (bcrypt, rate-limited)
│   ├── constants.ts            # TITLE_MAX, CONTENT_MAX, TAG_MAX_COUNT, TAG_MAX_LENGTH
│   ├── db.ts                   # Prisma 7 singleton (globalThis + PrismaPg adapter)
│   ├── logs.ts                 # getLogs() — cached per userId with cacheTag
│   ├── rate-limit.ts           # In-memory IP-keyed rolling-window limiter
│   ├── stats.ts                # Shared week/month boundary helpers
│   └── types.ts                # Shared TypeScript types
├── prisma/
│   ├── schema.prisma           # User + Log models
│   └── migrations/             # Migration history
├── auth.config.ts              # Edge-safe NextAuth config (no Prisma imports)
├── auth.ts                     # Full NextAuth config (Node.js, Prisma, bcrypt, rate-limited)
├── prisma.config.ts            # Prisma 7 DB URL config (replaces datasource url)
├── proxy.ts                    # Next.js 16 middleware (auth route protection)
└── docker-compose.yml          # Postgres + pgAdmin stack
```

---

## Database schema

```prisma
model User {
  id           String   @id @default(uuid())
  name         String   @unique
  email        String   @unique
  passwordHash String?
  settings     Json     @default("{}")   // theme preferences
  logs         Log[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Log {
  id        Int       @id @default(autoincrement())
  title     String
  content   String
  tags      String[]  @default([])
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

pgAdmin is available at [http://localhost:8080](http://localhost:8080) when the Docker stack is running.

---

## Scripts

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm run seed     # Seed sample logs (tsx + .env)
```

---

Built by [bkness](https://github.com/bkness) · devforge ecosystem
