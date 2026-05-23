"use server";

import { updateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

async function getUserId() {
    const session = await auth();
    return session?.user?.id ?? null;
}

export async function createLog(title: string, content: string) {
    const userId = await getUserId();
    if (!userId) return;
    await prisma.log.create({ data: { title, content, userId } });
    updateTag(`logs-${userId}`);
}

export async function updateLog(id: number, title: string, content: string) {
    const userId = await getUserId();
    if (!userId) return;
    await prisma.log.updateMany({ where: { id, userId }, data: { title, content } });
    updateTag(`logs-${userId}`);
}

export async function deleteLog(id: number) {
    const userId = await getUserId();
    if (!userId) return;
    await prisma.log.deleteMany({ where: { id, userId } });
    updateTag(`logs-${userId}`);
}

export async function saveSettings(settings: {
    appTheme: string;
    navTheme: string;
    toastTheme: string;
}) {
    const userId = await getUserId();
    if (!userId) return;
    await prisma.user.update({
        where: { id: userId },
        data: { settings },
    });
}
