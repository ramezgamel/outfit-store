/* eslint-disable @typescript-eslint/no-explicit-any */
import CredentialsProvider from "next-auth/providers/credentials";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { prisma } from "./db/prisma";
import { cookies } from "next/headers";
import { compare } from "./lib/encrypt";

export const nextConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;
        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });
        if (user && user.password) {
          const isMatch = await compare(
            credentials.password as string,
            user.password
          );
          if (isMatch)
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      if (trigger == "update") {
        session.user.name = user.name;
      }
      return session;
    },
    async jwt({ token, user, trigger }: any) {
      if (user) {
        token.role = user.role;
        if (user.name === "NO_NAME") {
          token.name = user.email.split("@")[0];
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: { name: token.name },
          });
        }
      }
      if (trigger === "signIn" || trigger === "signUp") {
        const sessionCartId = (await cookies()).get("sessionCartId")?.value;
        if (sessionCartId) {
          const sessionCart = await prisma.cart.findFirst({
            where: { sessionCartId },
          });

          if (sessionCart) {
            await prisma.cart.deleteMany({ where: { userId: user.id } });

            await prisma.cart.update({
              where: { id: sessionCart.id },
              data: { userId: user.id },
            });
          }
        }
      }
      return token;
    },
    authorized({ request }: { request: NextRequest; auth: any }) {
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];
      const { pathname } = request.nextUrl;
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;
      if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID();
        const newRequestHeaders = request.headers;
        const res = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
        res.cookies.set("sessionCartId", sessionCartId);
        return res;
      } else {
        return true;
      }
    },
  },
};
