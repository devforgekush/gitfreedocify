import { NextRequest, NextResponse } from 'next/server'

// Direct GitHub OAuth callback handler
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const error_description = searchParams.get('error_description')

    console.log('GitHub OAuth callback received:', { code: !!code, error, error_description })

    if (error) {
      console.error('GitHub OAuth error:', error, error_description)
      return NextResponse.redirect(new URL('/auth/error?error=' + encodeURIComponent(error), request.url))
    }

    if (!code) {
      console.error('No authorization code received')
      return NextResponse.redirect(new URL('/auth/error?error=no_code', request.url))
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID || 'Ov23lic3yzTiKmTqGpQp',
        client_secret: process.env.GITHUB_CLIENT_SECRET || '',
        code,
      }).toString(),
    })

    if (!tokenResponse.ok) {
      console.error('Failed to get access token:', tokenResponse.statusText)
      return NextResponse.redirect(new URL('/auth/error?error=token_exchange_failed', request.url))
    }

    const tokenData = await tokenResponse.json()
    console.log('Token exchange successful:', { access_token: !!tokenData.access_token })

    if (!tokenData.access_token) {
      console.error('No access token in response:', tokenData)
      return NextResponse.redirect(new URL('/auth/error?error=no_access_token', request.url))
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    if (!userResponse.ok) {
      console.error('Failed to get user info:', userResponse.statusText)
      return NextResponse.redirect(new URL('/auth/error?error=user_info_failed', request.url))
    }

    const userData = await userResponse.json()
    console.log('User data received:', { login: userData.login, id: userData.id })

    // For now, just redirect to dashboard with success
    // In a real app, you'd create a session or JWT here
    const dashboardUrl = new URL('/dashboard', request.url)
    dashboardUrl.searchParams.set('user', userData.login)
    dashboardUrl.searchParams.set('success', 'github_auth')
    
    return NextResponse.redirect(dashboardUrl)

  } catch (error) {
    console.error('GitHub OAuth callback error:', error)
    return NextResponse.redirect(new URL('/auth/error?error=callback_error', request.url))
  }
}
