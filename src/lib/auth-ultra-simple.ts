// Ultra-simple auth configuration for Netlify
import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, account, user }) => {
      if (account && user) {
        token.accessToken = account.access_token
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token) {
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key',
}
