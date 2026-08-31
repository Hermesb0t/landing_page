import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import { Session } from "next-auth";

// Extend the Session type to include accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

const authHandler = NextAuth({
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          // business_management is what surfaces Pages owned by a Business Manager
          // (/me/businesses → owned_pages / client_pages) on top of /me/accounts.
          scope: "email,public_profile,business_management,pages_show_list,pages_read_engagement,pages_manage_metadata,pages_messaging",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});

// ✅ Explicitly export HTTP methods
export const GET = authHandler;
export const POST = authHandler;
