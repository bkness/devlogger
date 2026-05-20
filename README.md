# Dev Logger

A full-stack developer logging tool for capturing notes, progress, and breakthroughs as you build. Create, update, and delete logs with a clean grid UI backed by a persistent Postgres database.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Styling | Tailwind CSS 4 |
| Runtime | React 19 / Server Actions |

## Features

- Create dev logs with a title and content
- Update existing logs inline
- Delete logs
- Persistent storage via PostgreSQL
- Server Actions for mutations with automatic cache revalidation
- Responsive grid layout (1 → 5 columns)

## Prerequisites

- Node.js 18+
- Docker + Docker Compose
- [direnv](https://direnv.net/) (recommended)

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/bkness/devlogger.git
cd devlogger
npm install
```

### 2. Set up environment

Copy the example env file and fill in your values:

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
```

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

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
devlogger/
├── app/
│   ├── actions.ts        # Server Actions (create, update, delete)
│   ├── api/logs/         # REST API routes
│   ├── page.tsx          # Home page
│   └── generated/prisma/ # Prisma client output
├── components/
│   ├── LogCard.tsx       # Individual log card
│   └── LogForm.tsx       # New log form
├── lib/
│   ├── logs.ts           # Data fetching
│   ├── prisma.ts         # Prisma client singleton
│   └── types.ts          # Shared types
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Migration history
└── docker-compose.yml    # Postgres + pgAdmin stack
```

## Database

Schema is a single `Log` model:

```prisma
model Log {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  createdAt DateTime @default(now())
}
```

pgAdmin is available at [http://localhost:8080](http://localhost:8080) when the Docker stack is running.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

Built by [bkness](https://github.com/bkness) · devforge ecosystem
