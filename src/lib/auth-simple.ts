// Simplified auth configuration for Netlify deployment
import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"

// Simple auth configuration without complex database adapter
export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo public_repo",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: ({ token, account, user }) => {
      if (account && user) {
        token.accessToken = account.access_token
        token.id = user.id
      }
      return token
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.sub!
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
  debug: process.env.NODE_ENV === 'development',
}
