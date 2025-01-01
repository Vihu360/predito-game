// auth.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./lib/dbConnect";
import { credits, users } from "./lib/schema";
import { eq } from "drizzle-orm";

export const authOptions = {
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
  callbacks: {

    async signIn({ user, account, profile }: any) {
      return true; // Just allow the sign in
    },
  
    async session({ session, user }: any) {
      try {

        // Check if user already has credits
        const existingCredits = await db.select().from(credits).where(eq(credits.userId, user.id)).limit(1);
        const isAdmin = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

  
        if (existingCredits.length === 0) {
          await db.insert(credits).values({
            id: crypto.randomUUID(),
            userId: user.id,
            transactionId: "reward-credit-NA"
          });
        }

        console.log("user session",session.user)
  
        // Optionally add current credits to session
        const userCredits = existingCredits
        session.user.credits = userCredits[0].amount;
        session.user.isAdmin = isAdmin[0].isAdmin || false;
        session.user.id = user.id;
  
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },


    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

const auth = NextAuth(authOptions);
export default auth;