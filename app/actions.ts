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
    await prisma.log.create({ data: { title, content, userId } });
    if (userId) updateTag(`logs-${userId}`);
}

export async function updateLog(id: number, title: string, content: string) {
    const userId = await getUserId();
    await prisma.log.update({ where: { id }, data: { title, content } });
    if (userId) updateTag(`logs-${userId}`);
}

export async function deleteLog(id: number) {
    const userId = await getUserId();
    await prisma.log.delete({ where: { id } });
    if (userId) updateTag(`logs-${userId}`);
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
