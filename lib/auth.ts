import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        // Fetch role from database
        let dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: { role: true, email: true },
        });

        // Auto-promote admin email to ADMIN role if not already
        const adminEmail = process.env.ADMIN_EMAIL;
        if (dbUser && dbUser.email === adminEmail && dbUser.role !== "ADMIN") {
          await db.user.update({
            where: { id: user.id },
            data: { role: "ADMIN" },
          });
          dbUser.role = "ADMIN";
        }

        (session.user as any).role = dbUser?.role || "USER";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});