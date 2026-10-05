import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import { GRAPH_VERSION } from "@/lib/facebook";

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
        url: `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth`,
        params: {
          // Business Login configurations select permissions/assets in Meta.
          ...(process.env.FACEBOOK_LOGIN_CONFIG_ID
            ? { config_id: process.env.FACEBOOK_LOGIN_CONFIG_ID }
            : {
                scope: "email,public_profile,business_management,pages_show_list,pages_read_engagement,pages_manage_metadata,pages_messaging",
              }),
          auth_type: "rerequest",
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
