// Simplified auth configuration for Netlify deployment
import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"

if (!process.env.GITHUB_CLIENT_ID) {
  throw new Error('Missing GITHUB_CLIENT_ID')
}
if (!process.env.GITHUB_CLIENT_SECRET) {
  throw new Error('Missing GITHUB_CLIENT_SECRET')
}
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Missing NEXTAUTH_SECRET')
}

// Simple auth configuration without database adapter (JWT only)
export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email public_repo",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: async ({ token, account, user }) => {
      if (account && user) {
        token.accessToken = account.access_token
        token.id = user.id
        token.login = (user as any).login || user.email?.split('@')[0]
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.sub!
        session.accessToken = token.accessToken as string
        session.user.login = token.login as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false, // Disable debug in production
}
