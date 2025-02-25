/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "./lib/encrypt";
import type { NextAuthConfig } from "next-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // const user = await prisma.user.findFirst({
        //   where: {
        //     email: credentials.email as string,
        //   },
        // });
        const user = await fetch(`/api/user`, {
          body: JSON.stringify({ email: credentials.email }),
          method: "POST",
        }).then((res) => res.json());

        if (user && user?.password) {
          const isMatch = await compare(
            credentials.password as string,
            user?.password
          );

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
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

      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;

        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];
        }

        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get("sessionCartId")?.value;

          if (sessionCartId) {
            // const sessionCart = await prisma.cart.findFirst({
            //   where: { sessionCartId },
            // });
            const sessionCart = await fetch(`/api/cart/${sessionCartId}`).then(
              (res) => res.json()
            );

            if (sessionCart) {
              // await prisma.cart.deleteMany({
              //   where: { userId: user.id },
              // });
              await fetch(`/api/cart/${user.id}`, {
                method: "DELETE",
              });
              await fetch(`/api/cart/${sessionCart.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                  userId: user.id,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              });

              // await prisma.cart.update({
              //   where: { id: sessionCart.id },
              //   data: { userId: user.id },
              // });
            }
          }
        }
      }

      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }

      return token;
    },
    authorized({ request, auth }: any) {
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

        const newRequestHeaders = new Headers(request.headers);

        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
