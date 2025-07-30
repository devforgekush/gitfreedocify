import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? 'Set' : 'Missing',
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ? 'Set' : 'Missing', 
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Default',
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Missing',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Set' : 'Missing',
      MISTRAL_API_KEY: process.env.MISTRAL_API_KEY ? 'Set' : 'Missing',
      timestamp: new Date().toISOString(),
      platform: process.platform,
      nodeVersion: process.version
    }

    return NextResponse.json(envCheck)
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({ error: 'Debug check failed' }, { status: 500 })
  }
}
