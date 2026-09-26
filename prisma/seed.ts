import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
import { replaceLogs } from "./seed-data";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "devbrandon@icloud.com" },
    update: {},
    create: { name: "Brandon", email: "devbrandon@icloud.com", settings: {} },
  });

  const count = await replaceLogs(prisma, user.id);
  console.log(`Seeded ${count} logs across 6 weeks.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
