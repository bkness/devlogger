"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function register(email: string, name: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail) {
        return { error: "Email is required" };
    }

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters" };
    }
    
    const existing = await prisma.user.findFirst({
        
        where: { OR: [{ email: normalizedEmail }, { name }] },
    });

    if (existing) {
        return {
            error: existing.email === normalizedEmail
                ? "Email already in use"
                : "Username already taken",
        };
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({ data: { email: normalizedEmail, name, passwordHash } });

    return { success: true };
}
