/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db/prisma";
// import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { compare } from "./lib/encrypt";
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
  adapter: PrismaAdapter(prisma),
  // providers: [
  //   CredentialsProvider({
  //     credentials: {
  //       email: { type: "email" },
  //       password: { type: "password" },
  //     },
  //     async authorize(credentials) {
  //       if (credentials == null) return null;
  //       const user = await prisma.user.findFirst({
  //         where: { email: credentials.email as string },
  //       });
  //       if (user && user.password) {
  //         const isMatch = await compare(
  //           credentials.password as string,
  //           user.password
  //         );
  //         if (isMatch)
  //           return {
  //             id: user.id,
  //             email: user.email,
  //             name: user.name,
  //             role: user.role,
  //           };
  //       }
  //       return null;
  //     },
  //   }),
  // ],
  // callbacks: {
  //   async session({ session, user, trigger, token }: any) {
  //     session.user.id = token.sub;
  //     session.user.role = token.role;
  //     session.user.name = token.name;

  //     if (trigger == "update") {
  //       session.user.name = user.name;
  //     }
  //     return session;
  //   },
  //   async jwt({ token, user, trigger }: any) {
  //     if (user) {
  //       token.role = user.role;
  //       if (user.name === "NO_NAME") {
  //         token.name = user.email.split("@")[0];
  //         await prisma.user.update({
  //           where: {
  //             id: user.id,
  //           },
  //           data: { name: token.name },
  //         });
  //       }
  //     }
  //     if (trigger === "signIn" || trigger === "signUp") {
  //       const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  //       if (sessionCartId) {
  //         const sessionCart = await prisma.cart.findFirst({
  //           where: { sessionCartId },
  //         });

  //         if (sessionCart) {
  //           await prisma.cart.deleteMany({ where: { userId: user.id } });

  //           await prisma.cart.update({
  //             where: { id: sessionCart.id },
  //             data: { userId: user.id },
  //           });
  //         }
  //       }
  //     }
  //     return token;
  //   },
  //   authorized({ request, auth: any }) {
  //     const protectedPaths = [
  //       /\/shipping-address/,
  //       /\/payment-method/,
  //       /\/place-order/,
  //       /\/profile/,
  //       /\/user\/(.*)/,
  //       /\/order\/(.*)/,
  //       /\/admin/,
  //     ];
  //     const { pathname } = request.nextUrl;
  //     if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;
  //     if (!request.cookies.get("sessionCartId")) {
  //       const sessionCartId = crypto.randomUUID();
  //       const newRequestHeaders = request.headers;
  //       const res = NextResponse.next({
  //         request: {
  //           headers: newRequestHeaders,
  //         },
  //       });
  //       res.cookies.set("sessionCartId", sessionCartId);
  //       return res;
  //     } else {
  //       return true;
  //     }
  //   },
  // },
  ...nextConfig,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
