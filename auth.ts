import NextAuth from "next-auth";
import { db } from "./db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";

const GITHUB_CLIENT = process.env.GITHUB_CLIENT_ID;
const GITHUB_SECRET = process.env.GITHUB_CLIENT_SECRET;

if (!GITHUB_CLIENT || !GITHUB_SECRET) {
  throw new Error("Missing github auth cretentiasl");
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GithubProvider({
      clientId: GITHUB_CLIENT,
      clientSecret: GITHUB_SECRET,
    }),
  ],
});
