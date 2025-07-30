import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Octokit } from '@octokit/rest'

interface SessionWithToken {
  user?: {
    email?: string | null
    name?: string | null
    image?: string | null
  }
  accessToken?: string
}

export async function GET() {
  try {
    console.log('🔍 GitHub repositories API called')
    const session = await getServerSession(authOptions) as SessionWithToken | null
    
    if (!session?.user?.email) {
      console.log('❌ No session or email found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ Session found, fetching repositories for:', session.user.email)

    // For JWT-only mode (when database is not available), use token for GitHub access
    let accessToken = session?.accessToken

    // If we have database available, try to get token from there
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        // Find the user and their GitHub account
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          include: {
            accounts: {
              where: { provider: 'github' }
            }
          }
        })

        if (user?.accounts[0]?.access_token) {
          accessToken = user.accounts[0].access_token
          console.log('✅ Using database access token')
        }
      } catch (dbError) {
        console.warn('❌ Database error, falling back to JWT token:', dbError)
      }
    }

    if (!accessToken) {
      console.log('❌ No GitHub access token found')
      return NextResponse.json({ error: 'No GitHub access token found. Please sign out and sign in again.' }, { status: 401 })
    } else {
      console.log('✅ Access token found, fetching repositories')
    }

    // Initialize Octokit with the user's GitHub token
    const octokit = new Octokit({
      auth: accessToken,
    })

    try {
      // Fetch user's repositories (both owned and collaborated)
      const { data: repos } = await octokit.repos.listForAuthenticatedUser({
        sort: 'updated',
        direction: 'desc',
        per_page: 100, // Fetch up to 100 repositories
        affiliation: 'owner,collaborator', // Include owned and collaborated repos
      })

      console.log(`📊 Found ${repos.length} repositories`)

      // Transform the data to match our frontend expectations
      const repositories = repos.map(repo => ({
        id: repo.id.toString(),
        name: repo.name,
        description: repo.description,
        githubUrl: repo.html_url,
        githubId: repo.full_name, // e.g., "username/repo-name"
        language: repo.language || 'Unknown',
        isPublic: !repo.private,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        updated_at: repo.updated_at,
        created_at: repo.created_at,
        default_branch: repo.default_branch,
        owner: {
          login: repo.owner.login,
          avatar_url: repo.owner.avatar_url,
          type: repo.owner.type,
        },
        permissions: {
          admin: repo.permissions?.admin || false,
          maintain: repo.permissions?.maintain || false,
          push: repo.permissions?.push || false,
          triage: repo.permissions?.triage || false,
          pull: repo.permissions?.pull || false,
        }
      }))

      console.log('✅ Successfully transformed repository data')
      return NextResponse.json({ repositories })

    } catch (githubError: unknown) {
      console.error('❌ GitHub API error:', githubError)
      
      const error = githubError as { status?: number; message?: string }
      
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'GitHub token expired or invalid. Please sign in again.' },
          { status: 401 }
        )
      }
      
      if (error.status === 403) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }

      throw githubError
    }

  } catch (error) {
    console.error('❌ Error fetching GitHub repositories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    )
  }
}
