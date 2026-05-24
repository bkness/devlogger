import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
    trustHost: true,          // ← THIS LINE
    secret: process.env.AUTH_SECRET,
    session: { strategy: "jwt" },
    pages:   { signIn: "/login" },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn  = !!auth?.user;
            const isLoginPage = nextUrl.pathname.startsWith("/login");

            if (isLoggedIn && isLoginPage)
                return Response.redirect(new URL("/", nextUrl));
            if (!isLoggedIn && !isLoginPage)
                return false; // redirects to signIn page

            return true;
        },
        jwt({ token, user }) {
            if (user) token.id = user.id;
            return token;
        },
        session({ session, token }) {
            if (token.id) session.user.id = token.id;
            return session;
        },
    },
    providers: [], // filled in by auth.ts
};
