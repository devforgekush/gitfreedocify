import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHubProvider from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"

// Ensure environment variables are available
const githubClientId = process.env.GITHUB_CLIENT_ID
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET
const nextAuthSecret = process.env.NEXTAUTH_SECRET
const nextAuthUrl = process.env.NEXTAUTH_URL || (
  process.env.NODE_ENV === 'production' 
    ? 'https://gitfreedocify.netlify.app' 
    : 'http://localhost:3000'
)
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

console.log('NextAuth URL:', nextAuthUrl)

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
    redirect: ({ url, baseUrl }) => {
      // Handle redirect after authentication
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
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
  debug: process.env.NODE_ENV === 'development',
}
