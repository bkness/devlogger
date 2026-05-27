"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function register(email: string, name: string, password: string) {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const rawEmail = email;
    const normalizedEmail = rawEmail
        .toLowerCase()
        .trim();
    const normalizedName = name.trim();

    if (!normalizedEmail) {
        return { error: "Email is required" };
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
        return { error: "Invalid email format" };
    }

    if (!normalizedName) {
        return { error: "Name is required" };
    }

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters" };
    }

    try {
        const existing = await prisma.user.findFirst({

            where: { OR: [{ email: normalizedEmail }, { name: normalizedName }] },
        });

        if (existing) {
            return {
                error: existing.email === normalizedEmail
                    ? "Email already in use"
                    : "Username already taken",
            };
        }

        const passwordHash = await bcrypt.hash(password, 12);
        await prisma.user.create({ data: { email: normalizedEmail, name: normalizedName, passwordHash } });

        return { success: true };
    } catch (err) {
        console.error("Error during registration:", err);
        return { error: "An unexpected error occurred. Please try again." };
    }
}