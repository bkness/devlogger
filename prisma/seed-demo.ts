import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { replaceLogs } from "./seed-data";
import { DEMO_EMAIL, DEMO_NAME, DEMO_PASSWORD } from "../lib/demo";

// Creates (or resets) the public demo account: known password, fresh copy of
// the journal. Safe to re-run whenever visitors have made a mess of it.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { passwordHash, settings: {} },
    create: { name: DEMO_NAME, email: DEMO_EMAIL, passwordHash, settings: {} },
  });

  const count = await replaceLogs(prisma, user.id);
  console.log(`Demo account ready: ${DEMO_EMAIL} with ${count} logs.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
