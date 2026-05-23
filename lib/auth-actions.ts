"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function register(email: string, name: string, password: string) {
    const existing = await prisma.user.findFirst({
        where: { OR: [{ email }, { name }] },
    });

    if (existing) {
        return {
            error: existing.email === email
                ? "Email already in use"
                : "Username already taken",
        };
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({ data: { email, name, passwordHash } });

    return { success: true };
}
