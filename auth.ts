import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { checkRateLimit } from "./lib/rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    secret: process.env.AUTH_SECRET,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) return null;

                const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
                const limit = checkRateLimit(`signin:${ip}`, 10, 60_000);
                if (!limit.ok) return null;

                const normalizedEmail = (credentials.email as string).toLowerCase().trim();

                const user = await prisma.user.findUnique({
                    where: { email: normalizedEmail },
                });

                if (!user?.passwordHash) return null;

                const valid = await bcrypt.compare(
                    credentials.password as string,
                    user.passwordHash,
                );

                if (!valid) return null;

                return { id: user.id, email: user.email, name: user.name };
            },
        }),
    ],
});
