import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(9 + (n % 9), (n * 7) % 60, 0, 0);
  return d;
}

type SeedLog = { title: string; content: string; tags: string[]; daysAgo: number };

const realLogs: SeedLog[] = [
  {
    title: "Wired DOOM into the portfolio",
    content: `Got js-dos v8 running inside the portfolio site as a hidden easter egg. Spent way too long debugging the canvas input — turns out js-dos needs the bundle and emulators loaded locally, CDN wasn't cutting it. Mobile D-pad controls were the last piece, had to use onTouchStart/onTouchEnd instead of onTouchMove since it's unreliable over the canvas. The \`doom\` command in the terminal hero now boots the game. Feels unreal.`,
    tags: ["portfolio", "doom", "js-dos"],
    daysAgo: 5,
  },
  {
    title: "Built the Apple Music ZLE widget",
    content: `Ctrl+] now opens a music picker in the shell. Hooks into the Apple Music API catalog search, lets you search songs, queue them, and control playback — all without leaving the terminal. Also wired a now-playing module into Starship's right prompt so the current track shows while you work. Took a while to figure out the AppleScript bridge for playback commands but got there. PR #139 shipped.`,
    tags: ["zsh", "starship", "apple-music"],
    daysAgo: 12,
  },
  {
    title: "Govee HUD — DevCard overhaul",
    content: `Completely rebuilt the Govee light control panel. Added tabs, color swatches, vibe presets, and scene support. The big gotcha was scene commands — originally used Promise.all across all 9 devices and got a 429 storm instantly. Rewrote everything as sequential for...of loops. Also fixed the powerState desync bug where the UI showed lights as on after they'd been turned off. Optimistic rollback handles the failure case now.`,
    tags: ["govee", "hud", "bug-fix"],
    daysAgo: 15,
  },
  {
    title: "ZSH backlog — full overhaul session",
    content: `Knocked out the entire ZSH improvement backlog in one session. Migrated aliases to zsh-abbr, replaced the custom Ctrl+R history widget with Atuin (sqlite-backed, way faster), hooked in direnv for per-project .envrc auto-loading, added a Ctrl+J zoxide jump widget with eza preview, wired a transient prompt via zle-line-finish, built a Starship workmode module that reads ~/.cache/forged/workmode-state, and shipped a Ctrl+S snippet expander with 5 starter templates. Also swapped zsh-syntax-highlighting for fast-syntax-highlighting — drop-in replacement, noticeably snappier.`,
    tags: ["zsh", "refactor", "atuin"],
    daysAgo: 20,
  },
  {
    title: "Night Owlz — React Native MVP shipped",
    content: `Finished the Night Owlz MVP (renamed from BarFly). Core flow works: browse bars, save favorites to My Bars, view details. Server running on Render. Fixed a protobufjs security vulnerability — pinned 7.5.8 as a direct root dep to get Dependabot off our back. Still have drag-to-reorder My Bars and a login screen fade-in on the pending list but the app is usable end to end.`,
    tags: ["nightowlz", "react-native", "security"],
    daysAgo: 25,
  },
  {
    title: "Devlogger rebuild — Prisma 7 + Next.js 16",
    content: `Started rebuilding devlogger from scratch as a proper learning project. Hit a few Prisma 7 surprises — the new prisma.config.ts pattern means no url field in schema.prisma, and new PrismaClient() with no args is gone, you have to wire up a driver adapter (PrismaPg). cacheTag and updateTag are stable exports now, no unstable_ prefix. The "use cache" directive needs cacheComponents: true in next.config.ts. Got full CRUD working with cache invalidation — create, update, delete all bust the logs cache tag correctly.`,
    tags: ["devlogger", "prisma", "nextjs"],
    daysAgo: 32,
  },
  {
    title: "forged scanner — trusted publisher system",
    content: `Shipped the trusted publisher allowlist for the forged CLI scanner. Locks in 20 verified publishers so common packages (react, next, prisma, tailwind, etc.) don't trip the scanner on every project. Pattern is publisher slug → verify against npm registry metadata. Took some tuning to get the heuristic right without too many false positives. v0.3.6 out.`,
    tags: ["forged", "npm", "security"],
    daysAgo: 36,
  },
  {
    title: ".github repo — sync-repos workflow",
    content: `Set up a centralized .github repo to manage settings across all projects. sync-repos.yml runs on workflow_dispatch and syncs labels + repo settings to all repos in one shot. Had to use a PAT with administration:write scope — default GITHUB_TOKEN doesn't have it. Also sets delete_branch_on_merge: true on every repo so branch cleanup is automatic after merges. All 9 repos syncing clean now.`,
    tags: ["github", "ci-cd", "workflow"],
    daysAgo: 40,
  },
];

const fillerLogs: SeedLog[] = [
  { title: "Restructured the README for recruiters", content: "Rebuilt the project README around the new Stats / Tags screens and added an architecture-highlights section. Showcase row of screenshots up top, features grouped by area underneath.", tags: ["docs", "portfolio"], daysAgo: 0 },
  { title: "Squashed a hydration warning in MobileNav", content: "Useffect was reading window.innerWidth on first render — moved to a CSS-only @media breakpoint so the menu doesn't flash on hydration.", tags: ["bug-fix", "nextjs", "react"], daysAgo: 0 },
  { title: "Refactored button classes into a .btn variant system", content: "Consolidated update-btn / delete-btn / cancel-btn into .btn + .btn--primary / .btn--danger / .btn--ghost. One source of truth for theming across all three app themes.", tags: ["css", "refactor", "ui"], daysAgo: 1 },
  { title: "Added pending state to async buttons", content: "Add / Save / Delete now flip a local isPending boolean inside try/finally so the button disables during the server action and re-enables even on error.", tags: ["react", "ui"], daysAgo: 2 },
  { title: "Extracted week boundary helpers to lib/stats", content: "Both Navbar and StatsView were computing startOfWeek inline. Pulled into a shared getStartOfWeek + countThisWeek helper.", tags: ["refactor", "typescript"], daysAgo: 4 },
  { title: "Tag normalization — lowercase + hyphenate", content: "handleTagKeyDown now collapses whitespace to hyphens and rejects anything outside [a-z0-9-]+. 'react native' becomes 'react-native' instead of staying with the space.", tags: ["bug-fix", "ui"], daysAgo: 6 },
  { title: "Search input above the log grid", content: "Client-side filter by title or content. State lives in DashboardShell so it composes with the active tag filter.", tags: ["ui", "react", "feature"], daysAgo: 8 },
  { title: "Sort options — newest, oldest, A–Z", content: "Sort applied inside the existing useMemo after the search filter. Copied the matched array before .sort() to avoid mutating the logs prop.", tags: ["feature", "react"], daysAgo: 9 },
  { title: "Live char counters on title and content", content: "Counters render under each input and turn red the instant the value exceeds TITLE_MAX or CONTENT_MAX.", tags: ["ui", "react"], daysAgo: 11 },
  { title: "Unsaved-changes guard on edit cancel", content: "Compares editTitle / editContent / editTags to detailLog. If dirty, shows an inline '// discard changes?' confirm row mirroring the delete-confirm pattern.", tags: ["ui", "react"], daysAgo: 13 },
  { title: "Dedupe detailContent id, animate slide-in", content: "View and edit blocks both had id='detailContent'. Converted to a .detail-content class. Bonus: added a staggered fade-up on the action buttons.", tags: ["bug-fix", "css"], daysAgo: 14 },
  { title: "Settings panel — reset to defaults button", content: "One-click snap to cyber / nav A / toast A. Disabled when already at defaults so it doesn't dangle.", tags: ["feature", "ui"], daysAgo: 17 },
  { title: "In-memory rate limiter on auth endpoints", content: "5 register / 10 signin per minute per IP. Module-scoped Map per process — defense-in-depth, swap path to Upstash documented inline.", tags: ["security", "auth"], daysAgo: 18 },
  { title: "Mobile responsive nav at 768px", content: "Unified MobileNav component takes over from all 3 desktop nav variants via CSS @media query. Slide-in panel with USER / VIEWS / ACTIONS sections.", tags: ["css", "ui", "responsive"], daysAgo: 19 },
  { title: "Stats view — 14-day activity chart", content: "Bars scale to the peak day. Empty state short-circuits before the date math runs.", tags: ["feature", "react"], daysAgo: 21 },
  { title: "Tags view with click-to-filter", content: "Tag cloud with count badges. Clicking a tag jumps to the tags view with the filter already applied.", tags: ["feature", "react"], daysAgo: 23 },
  { title: "LogCard keyboard accessibility", content: "Converted tag chips from span to button so they're focusable and activate on Enter / Space.", tags: ["accessibility", "react"], daysAgo: 26 },
  { title: "Empty states across LogDashboard and Stats", content: "LogDashboard branches between 'no logs yet' and 'no logs match <query>'. StatsView early-returns with a friendly empty card.", tags: ["ui", "react"], daysAgo: 28 },
  { title: "Prisma cacheTag invalidation per user", content: "getLogs wraps 'use cache' with a userId-scoped cacheTag. Mutations updateTag only the affected user's slice instead of busting the whole logs cache.", tags: ["prisma", "performance"], daysAgo: 29 },
  { title: "Wired SessionProvider into root layout", content: "Layout pulls the server session and passes it into a SessionProvider client wrapper so the Navbar can read the user without an extra round trip.", tags: ["auth", "react"], daysAgo: 33 },
  { title: "Driver adapter migration to PrismaPg", content: "Switched off the deprecated datasource url pattern. PrismaClient now takes a PrismaPg adapter, connection string lives in prisma.config.ts.", tags: ["prisma", "postgres", "refactor"], daysAgo: 34 },
  { title: "Docker compose for local Postgres + pgAdmin", content: "Two-service stack with named volumes so the DB survives container restarts. pgAdmin available at :8080 with a pre-loaded server definition.", tags: ["docker", "postgres"], daysAgo: 37 },
  { title: "Login page styling — terminal aesthetic", content: "Matched the form to the rest of the app theme tokens. Same panel-header pattern, same field styling, error toast on bad credentials.", tags: ["css", "ui"], daysAgo: 38 },
  { title: "JWT session strategy with NextAuth v5", content: "Stateless sessions so the auth check stays edge-safe. authConfig lives in a separate file with no Prisma imports for the middleware to consume cleanly.", tags: ["auth", "security"], daysAgo: 39 },
  { title: "Initial Prisma schema for User + Log", content: "User has email + name unique, settings as a JSON column for theme prefs. Log is autoincrement id with a relation back to user. Bcrypt-hashed passwordHash on user.", tags: ["prisma", "postgres"], daysAgo: 41 },
  { title: "Bootstrapped Next.js 16 App Router project", content: "Turbopack on by default, cacheComponents enabled in next.config.ts. App Router structure with a (auth) and (dashboard) route group split.", tags: ["nextjs", "typescript"], daysAgo: 42 },
];

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "devbrandon@icloud.com" },
    update: {},
    create: { name: "Brandon", email: "devbrandon@icloud.com", settings: {} },
  });

  await prisma.log.deleteMany({ where: { userId: user.id } });

  const all = [...realLogs, ...fillerLogs].map(l => ({
    title: l.title,
    content: l.content,
    tags: l.tags,
    userId: user.id,
    createdAt: daysAgo(l.daysAgo),
    updatedAt: daysAgo(l.daysAgo),
  }));

  await prisma.log.createMany({ data: all });
  console.log(`Seeded ${all.length} logs across 6 weeks.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
