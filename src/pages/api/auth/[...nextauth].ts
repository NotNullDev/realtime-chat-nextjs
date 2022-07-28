import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "../../../server/prisma"
import {PrismaAdapter} from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === "development",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
  ],
  theme: {
    colorScheme: "auto",
  },
  callbacks: {
    async jwt({ token, isNewUser, user }) {

      if (isNewUser) {
        console.log("New user has been created:", user)
      }

      return token;
    },
    async session({ session, user }) {

      session = {
        ...session,
        user: {
          ...session.user,
          id: user.id
        }
      }

      return session;
    }
  },
}

export default NextAuth(authOptions)
