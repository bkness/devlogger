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
    if (!userId) return { error: "User not authenticated" };
    try {
        await prisma.log.create({ data: { title, content, userId } });
        updateTag(`logs-${userId}`);
    } catch (err) {
        console.error("Error creating log:", err);
        return { error: "An unexpected error occurred while creating the log. Please try again." };
    }
}

export async function updateLog(id: number, title: string, content: string) {
    const userId = await getUserId();
    if (!userId) return { error: "User not authenticated" };
    try {
        await prisma.log.updateMany({ where: { id, userId }, data: { title, content } });
        updateTag(`logs-${userId}`);
    } catch (err) {
        console.error("Error updating log:", err);
        return { error: "An unexpected error occurred while updating the log. Please try again." };
    }
}

export async function deleteLog(id: number) {
    const userId = await getUserId();
    if (!userId) return { error: "User not authenticated" };
    try {
        await prisma.log.deleteMany({ where: { id, userId } });
        updateTag(`logs-${userId}`);
    } catch (err) {
        console.error("Error deleting log:", err);
        return { error: "An unexpected error occurred while deleting the log. Please try again." };
    }
}

export async function saveSettings(settings: {
    appTheme: string;
    navTheme: string;
    toastTheme: string;
}) {
    const userId = await getUserId();
    if (!userId) return { error: "User not authenticated" };
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { settings },
        });
    } catch (err) {
        console.error("Error saving settings:", err);
        return { error: "An unexpected error occurred while saving settings. Please try again." };
    }
}
