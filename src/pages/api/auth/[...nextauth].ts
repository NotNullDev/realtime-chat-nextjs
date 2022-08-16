import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../server/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // debug: process.env.NODE_ENV === "development",
  debug: false,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
        }
      }
    }),
  ],
  theme: {
    colorScheme: "auto",
  },
  pages: {
    // signIn: "/hello",
    // error: "/error",
    // signOut: "/signOut",
    // newUser: "/newUser",
    // verifyRequest: "/verifyRequest",
  },
  callbacks: {
    async redirect(ctx) {

      console.log("redirect", ctx);

      return ctx.url;
    },
    async jwt({ token, isNewUser, user }) {
      if (isNewUser) {
        console.log("New user has been created:", user);
      }

      // console.log("User has been signed in:", user);

      return token;
    },
    async session({ session, user }) {
      session = {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };

      // console.log("Session:", session);

      return session;
    },
  },
};

export default NextAuth(authOptions);
