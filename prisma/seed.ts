import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.log.createMany({
    data: [
      {
        title: "Wired DOOM into the portfolio",
        content: `Got js-dos v8 running inside the portfolio site as a hidden easter egg. Spent way too long debugging the canvas input — turns out js-dos needs the bundle and emulators loaded locally, CDN wasn't cutting it. Mobile D-pad controls were the last piece, had to use onTouchStart/onTouchEnd instead of onTouchMove since it's unreliable over the canvas. The \`doom\` command in the terminal hero now boots the game. Feels unreal.`,
      },
      {
        title: "Built the Apple Music ZLE widget",
        content: `Ctrl+] now opens a music picker in the shell. Hooks into the Apple Music API catalog search, lets you search songs, queue them, and control playback — all without leaving the terminal. Also wired a now-playing module into Starship's right prompt so the current track shows while you work. Took a while to figure out the AppleScript bridge for playback commands but got there. PR #139 shipped.`,
      },
      {
        title: "Govee HUD — DevCard overhaul",
        content: `Completely rebuilt the Govee light control panel. Added tabs, color swatches, vibe presets, and scene support. The big gotcha was scene commands — originally used Promise.all across all 9 devices and got a 429 storm instantly. Rewrote everything as sequential for...of loops. Also fixed the powerState desync bug where the UI showed lights as on after they'd been turned off. Optimistic rollback handles the failure case now. All shipped 2026-05-16.`,
      },
      {
        title: "ZSH backlog — full overhaul session",
        content: `Knocked out the entire ZSH improvement backlog in one session. Migrated aliases to zsh-abbr, replaced the custom Ctrl+R history widget with Atuin (sqlite-backed, way faster), hooked in direnv for per-project .envrc auto-loading, added a Ctrl+J zoxide jump widget with eza preview, wired a transient prompt via zle-line-finish, built a Starship workmode module that reads ~/.cache/forged/workmode-state, and shipped a Ctrl+S snippet expander with 5 starter templates. Also swapped zsh-syntax-highlighting for fast-syntax-highlighting — drop-in replacement, noticeably snappier.`,
      },
      {
        title: "Night Owlz — React Native MVP shipped",
        content: `Finished the Night Owlz MVP (renamed from BarFly). Core flow works: browse bars, save favorites to My Bars, view details. Server running on Render. Fixed a protobufjs security vulnerability — pinned 7.5.8 as a direct root dep to get Dependabot off our back. Still have drag-to-reorder My Bars and a login screen fade-in on the pending list but the app is usable end to end.`,
      },
      {
        title: "Devlogger rebuild — Prisma 7 + Next.js 16",
        content: `Started rebuilding devlogger from scratch as a proper learning project. Hit a few Prisma 7 surprises — the new prisma.config.ts pattern means no url field in schema.prisma, and new PrismaClient() with no args is gone, you have to wire up a driver adapter (PrismaPg). cacheTag and updateTag are stable exports now, no unstable_ prefix. The "use cache" directive needs cacheComponents: true in next.config.ts. Got full CRUD working with cache invalidation — create, update, delete all bust the logs cache tag correctly.`,
      },
      {
        title: "forged scanner — trusted publisher system",
        content: `Shipped the trusted publisher allowlist for the forged CLI scanner. Locks in 20 verified publishers so common packages (react, next, prisma, tailwind, etc.) don't trip the scanner on every project. Pattern is publisher slug → verify against npm registry metadata. Took some tuning to get the heuristic right without too many false positives. v0.3.6 out.`,
      },
      {
        title: ".github repo — sync-repos workflow",
        content: `Set up a centralized .github repo to manage settings across all projects. sync-repos.yml runs on workflow_dispatch and syncs labels + repo settings to all repos in one shot. Had to use a PAT with administration:write scope — default GITHUB_TOKEN doesn't have it. Also sets delete_branch_on_merge: true on every repo so branch cleanup is automatic after merges. All 9 repos syncing clean now.`,
      },
    ],
  });

  console.log("Seeded 8 logs.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
