import NextAuth, {NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {prisma} from "../../../server/prisma";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {NextApiRequest, NextApiResponse} from "next";
import {getToken} from "next-auth/jwt";

const secret = process.env.NEXAUTH_SECRET;

const nextAuthApiRoute = async (req: NextApiRequest, res: NextApiResponse) => {

  const body = await req.body;

  console.log("Auth endpoint hit!", body);

  if (!secret) {
    console.error("Please create a secret in your .env.local file! Check readme for more info.");
  } else {
    const token = await getToken({req, secret});
    console.log("Token: ", token);
  }

  return await NextAuth(req, res, authOptions);
}

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

  },
  callbacks: {
    async redirect(ctx) {
      return ctx.url;
    },
    async jwt({ token, isNewUser, user }) {
      console.log("JWT:", token);
      if (isNewUser) {
        console.log("New user has been created:", user);
      }
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

      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
  },
};

export default nextAuthApiRoute;
