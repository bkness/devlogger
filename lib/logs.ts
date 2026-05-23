import { cacheTag } from "next/cache";
import { prisma } from "@/lib/db";

export async function getLogs(userId: string) {
    "use cache";
    cacheTag(`logs-${userId}`);
    return prisma.log.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}
