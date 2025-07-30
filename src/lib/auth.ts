import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHubProvider from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"

// Ensure environment variables are available
const githubClientId = process.env.GITHUB_CLIENT_ID
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET
const nextAuthSecret = process.env.NEXTAUTH_SECRET
const hasDatabaseUrl = process.env.DATABASE_URL && process.env.DATABASE_URL !== ''

if (!githubClientId || !githubClientSecret) {
  console.warn('GitHub OAuth credentials not found. Authentication will be disabled.')
}

if (!nextAuthSecret) {
  console.warn('NEXTAUTH_SECRET not found. Please set this environment variable.')
}

if (!hasDatabaseUrl) {
  console.warn('DATABASE_URL not found. Using JWT strategy without database adapter.')
}

export const authOptions: NextAuthOptions = {
  adapter: githubClientId && githubClientSecret && hasDatabaseUrl ? PrismaAdapter(prisma) as NextAuthOptions['adapter'] : undefined,
  providers: githubClientId && githubClientSecret ? [
    GitHubProvider({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
      authorization: {
        params: {
          scope: "read:user user:email repo public_repo",
        },
      },
    }),
  ] : [],
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub!,
      },
    }),
    jwt: ({ token, user, account }) => {
      if (user) {
        token.sub = user.id
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: nextAuthSecret,
}
