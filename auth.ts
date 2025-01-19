import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { nextConfig } from "./auth.config";
export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  ...nextConfig,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
