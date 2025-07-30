import { NextRequest, NextResponse } from 'next/server'

// Simple diagnostic endpoint to check auth configuration
export async function GET(request: NextRequest) {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      nextauth_url: process.env.NEXTAUTH_URL,
      github_client_id: process.env.GITHUB_CLIENT_ID ? 'Present' : 'Missing',
      github_client_secret: process.env.GITHUB_CLIENT_SECRET ? 'Present' : 'Missing',
      nextauth_secret: process.env.NEXTAUTH_SECRET ? 'Present' : 'Missing',
      host: request.headers.get('host'),
      url: request.url,
    }
    
    return NextResponse.json(diagnostics)
  } catch (error) {
    return NextResponse.json(
      { error: 'Diagnostic check failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
