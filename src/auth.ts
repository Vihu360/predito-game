// auth.ts
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./lib/dbConnect";
import { credits, users } from "./lib/schema";
import { eq } from "drizzle-orm";


// Extend the built-in session types
interface ExtendedSession extends Session {
  user: {
    id: string;
    credits: number;
    isAdmin: boolean;
    role?: string;
  } & Session["user"];
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = "games";
      }
      return token;
    },

    async session({ session, token }): Promise<ExtendedSession> {
      try {
        if (!token?.id) return session as ExtendedSession;

        // Explicitly type the userId for the query
        const userId: string = token.id.toString();

        const existingCredits = await db
          .select()
          .from(credits)
          .where(eq(credits.userId, userId))
          .limit(1);
        
        const userRecord = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (existingCredits.length === 0) {
          await db.insert(credits).values({
            id: crypto.randomUUID(),
            userId: userId,
            transactionId: "reward-credit-NA"
          });
        }

        return {
          ...session,
          user: {
            ...session.user,
            credits: existingCredits[0]?.amount ?? 0,
            isAdmin: userRecord[0]?.isAdmin ?? false,
            id: userId,
            role: token.role as string,
          }
        };
      } catch (error) {
        console.error("Error in session callback:", error);
        return session as ExtendedSession;
      }
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };