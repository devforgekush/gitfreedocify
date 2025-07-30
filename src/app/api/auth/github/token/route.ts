import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    
    if (!code) {
      return Response.json({ error: 'Authorization code required' }, { status: 400 })
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
      return Response.json({ error: 'Failed to exchange code for token' }, { status: 500 })
    }

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      return Response.json({ error: 'No access token received' }, { status: 500 })
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    if (!userResponse.ok) {
      return Response.json({ error: 'Failed to get user info' }, { status: 500 })
    }

    const userData = await userResponse.json()

    // Return user data (but not the access token for security)
    return Response.json({
      user: {
        id: userData.id,
        login: userData.login,
        name: userData.name,
        email: userData.email,
        avatar_url: userData.avatar_url,
      },
      success: true
    })

  } catch (error) {
    console.error('Token exchange error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
