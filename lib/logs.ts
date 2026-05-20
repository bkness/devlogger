import { cacheTag } from "next/cache";
import { prisma } from "@/lib/db";

export async function getLogs() {
  "use cache";
  cacheTag("logs");
  return prisma.log.findMany({ orderBy: { createdAt: "desc" } });
}
