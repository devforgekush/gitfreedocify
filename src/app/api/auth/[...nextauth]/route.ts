import NextAuth from "next-auth"
import { NextRequest } from "next/server"

// Ultra-simple NextAuth configuration to prevent crashes
const authOptions = {
  providers: [
    {
      id: "github",
      name: "GitHub",
      type: "oauth" as const,
      authorization: "https://github.com/login/oauth/authorize?scope=read:user+user:email",
      token: "https://github.com/login/oauth/access_token",
      userinfo: "https://api.github.com/user",
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      profile(profile: any) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    },
  ],
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret',
}

try {
  const handler = NextAuth(authOptions)
  export { handler as GET, handler as POST }
} catch (error) {
  console.error('NextAuth initialization error:', error)
  
  // Fallback handlers if NextAuth fails
  export async function GET(request: NextRequest) {
    return Response.json({
      error: 'Authentication service temporarily unavailable',
      details: 'NextAuth initialization failed'
    }, { status: 503 })
  }
  
  export async function POST(request: NextRequest) {
    return Response.json({
      error: 'Authentication service temporarily unavailable',
      details: 'NextAuth initialization failed'
    }, { status: 503 })
  }
}
