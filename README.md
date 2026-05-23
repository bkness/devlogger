![Devlogger Banner](/public/images/devlogger-banner.png)

# Dev Logger

A full-stack developer logging app for capturing notes, progress, and breakthroughs as you build. Full authentication, per-user log management, and a theme system with **27 unique visual combinations** — all backed by PostgreSQL and built issue by issue as a learning project.

---

## Features

- **Authentication** — register/login with hashed credentials (NextAuth.js v5 + bcrypt)
- **Full CRUD** — create, edit, and delete dev logs with inline confirmation guards
- **Per-user isolation** — every log is scoped to the authenticated user (IDOR-safe)
- **27 theme combinations** — 3 app themes × 3 nav styles × 3 toast styles, persisted to your profile
- **Smart caching** — Next.js 16 `"use cache"` + tag-based invalidation, scoped per user
- **Responsive grid** — 1 → 5 columns depending on viewport
- **Context-aware toasts** — different messages for create / update / delete / cancel / validation

---

## Screenshots

| Cyber | Terminal | Military |
|---|---|---|
| ![cyber theme](/public/images/screenshots/cyber.png) | ![terminal theme](/public/images/screenshots/terminal.png) | ![military theme](/public/images/screenshots/military.png) |

---

## Theme System

Three independent layers combine for **27 unique looks**:

| Layer | Options |
|---|---|
| **App theme** | `cyber` (dark teal) · `terminal` (dark amber/gold) · `military` (white/forest green) |
| **Nav style** | `A` Command Bar · `B` Slim Signal · `C` Terminal Path |
| **Toast style** | `A` Signal bar · `B` HUD dot · `C` Minimal + ESC dismiss |

Settings are persisted to a `settings` JSON column on your user record — your choice survives sign-out.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Auth | NextAuth.js v5 (beta) — credentials + JWT |
| Database | PostgreSQL (Docker) |
| ORM | Prisma 7 (driver adapter, custom output path) |
| Runtime | React 19 / Server Actions |

---

## Getting Started

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

## Project Structure

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
│   ├── DashboardShell.tsx      # Theme state, settings persistence, idle watermark
│   ├── LogDashboard.tsx        # Grid layout + empty state
│   ├── LogCard.tsx             # Individual card — edit/delete with confirmation guard
│   ├── LogForm.tsx             # New log form
│   ├── Navbar.tsx              # Renders nav theme A / B / C
│   ├── SettingsPanel.tsx       # Theme picker (app + nav + toast)
│   └── Toast.tsx               # Renders toast theme A / B / C
├── lib/
│   ├── auth-actions.ts         # register() server action (bcrypt hash)
│   ├── db.ts                   # Prisma 7 singleton (globalThis + PrismaPg adapter)
│   ├── logs.ts                 # getLogs() — cached per userId with cacheTag
│   └── types.ts                # Shared TypeScript types
├── prisma/
│   ├── schema.prisma           # User + Log models
│   └── migrations/             # Migration history
├── auth.config.ts              # Edge-safe NextAuth config (no Prisma imports)
├── auth.ts                     # Full NextAuth config (Node.js, Prisma, bcrypt)
├── prisma.config.ts            # Prisma 7 DB URL config (replaces datasource url)
├── proxy.ts                    # Next.js 16 middleware (auth route protection)
└── docker-compose.yml          # Postgres + pgAdmin stack
```

---

## Database Schema

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
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
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
```

---

Built by [bkness](https://github.com/bkness) · devforge ecosystem
