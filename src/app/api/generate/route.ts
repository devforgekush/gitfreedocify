import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GitHubAnalyzer } from '@/lib/ai-service'
import { prisma } from '@/lib/prisma'

interface User {
  id: string
  email: string | null
  name?: string | null
  image?: string | null
  emailVerified?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

interface SessionWithToken {
  user?: {
    email?: string | null
    name?: string | null
    image?: string | null
  }
  accessToken?: string
}

export async function POST(request: NextRequest) {
  try {
    console.log('Generate API called')
    const session = await getServerSession(authOptions) as SessionWithToken | null
    
    if (!session?.user?.email) {
      console.log('No session or email found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('User email:', session.user.email)

    // Check if database is available and find/create user
    let user: User | null = null
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        // Find or create the user in the database
        user = await prisma.user.findUnique({
          where: { email: session.user.email },
        })

        if (!user) {
          console.log('User not found in database, creating new user...')
          
          // Create the user if they don't exist
          user = await prisma.user.create({
            data: {
              email: session.user.email,
              name: session.user.name || 'GitHub User',
              image: session.user.image || null,
            },
          })
          
          console.log('New user created:', user?.id)
        } else {
          console.log('User found:', user.id)
        }
      } catch (dbError) {
        console.error('Database error:', dbError)
        console.warn('Continuing without database...')
        user = null
      }
    } else {
      console.log('Database not available, continuing in JWT-only mode')
    }

    const body = await request.json()
    const { githubUrl } = body

    console.log('GitHub URL:', githubUrl)

    if (!githubUrl) {
      return NextResponse.json(
        { error: 'GitHub URL is required' },
        { status: 400 }
      )
    }

    // Parse GitHub URL
    const urlMatch = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!urlMatch) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL format' },
        { status: 400 }
      )
    }

    const [, owner, repoName] = urlMatch
    console.log('Parsed repository:', owner, repoName)

    // Get GitHub access token - try database first, then JWT token
    let accessToken = session?.accessToken
    
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '' && user) {
      try {
        // Get GitHub access token from user's account
        const account = await prisma.account.findFirst({
          where: {
            userId: user.id,
            provider: 'github',
          },
        })

        if (account?.access_token) {
          accessToken = account.access_token
          console.log('✅ Using database access token')
        }
      } catch (dbError) {
        console.warn('Database error when fetching account, using JWT token:', dbError)
      }
    }

    if (!accessToken) {
      console.error('❌ No access token available in session or database')
      return NextResponse.json(
        { error: 'GitHub access token not found. Please sign out and sign in again.' },
        { status: 401 }
      )
    } else {
      console.log('✅ Access token found, proceeding with repository analysis')
    }

    // Verify user has access to the repository
    console.log('🔐 Checking repository access...')
    try {
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitFreeDocify'
        }
      })

      if (repoResponse.status === 404) {
        return NextResponse.json(
          { error: 'Repository not found or you do not have access to this repository.' },
          { status: 403 }
        )
      }

      if (repoResponse.status === 403) {
        return NextResponse.json(
          { error: 'You do not have permission to access this repository.' },
          { status: 403 }
        )
      }

      if (!repoResponse.ok) {
        console.error('GitHub API error:', repoResponse.status, repoResponse.statusText)
        return NextResponse.json(
          { error: 'Failed to verify repository access. Please try again.' },
          { status: 500 }
        )
      }

      const repoData = await repoResponse.json()
      
      // Additional check: verify user is owner, collaborator, or has push access
      const hasWriteAccess = repoData.permissions?.push || repoData.permissions?.admin || false
      const isOwner = repoData.owner?.login?.toLowerCase() === session.user?.email?.split('@')[0]?.toLowerCase()
      
      // For public repos, we also check if user is a collaborator
      if (!hasWriteAccess && !isOwner && repoData.private) {
        return NextResponse.json(
          { error: 'You can only generate documentation for repositories you own or have write access to.' },
          { status: 403 }
        )
      }

      console.log('✅ Repository access verified')
      console.log(`📋 Repository: ${repoData.full_name} (${repoData.private ? 'private' : 'public'})`)
      console.log(`👤 Owner: ${repoData.owner?.login}, Has write access: ${hasWriteAccess}`)
      
    } catch (accessError) {
      console.error('Error checking repository access:', accessError)
      return NextResponse.json(
        { error: 'Failed to verify repository access. Please try again.' },
        { status: 500 }
      )
    }

    // Analyze repository
    const analyzer = new GitHubAnalyzer(accessToken)
    const analysis = await analyzer.analyzeRepository(owner, repoName)

    // Generate documentation using the analyzer
    const readme = await analyzer.generateREADME(analysis)
    
    // Validate generated content
    if (!readme || typeof readme !== 'string' || readme.trim().length === 0) {
      throw new Error('AI failed to generate valid documentation content')
    }

    console.log('📝 Documentation generated successfully, length:', readme.length)

    // Save project to database (if available)
    let project = null
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '' && user) {
      try {
        project = await prisma.project.upsert({
          where: {
            userId_githubId: {
              userId: user.id,
              githubId: `${owner}/${repoName}`,
            },
          },
          update: {
            name: analysis.name,
            description: analysis.description,
            language: analysis.language,
            readmeContent: readme,
            updatedAt: new Date(),
          },
          create: {
            name: analysis.name,
            description: analysis.description,
            githubUrl,
            githubId: `${owner}/${repoName}`,
            language: analysis.language,
            readmeContent: readme,
            userId: user.id,
          },
        })
        console.log('💾 Project saved to database successfully')
      } catch (dbError) {
        console.warn('Failed to save project to database:', dbError)
        // Continue without saving to database
      }
    }

    // Ensure we return a valid JSON response
    const responseData = {
      readme: readme,
      project: project,
      analysis: {
        name: analysis.name,
        description: analysis.description,
        language: analysis.language,
        languages: analysis.languages,
        hasTests: analysis.hasTests,
        hasDocumentation: analysis.hasDocumentation,
      },
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error generating documentation:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
      if (error.message.includes('Not Found') || error.message.includes('404')) {
        return NextResponse.json(
          { error: 'Repository not found or not accessible. Make sure the repository is public and the URL is correct.' },
          { status: 404 }
        )
      }
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'AI generation timed out. Please try again with a smaller repository or try again later.' },
          { status: 408 }
        )
      }
      if (error.message.includes('AI failed')) {
        return NextResponse.json(
          { error: 'AI service failed to generate documentation. Please try again.' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate documentation. Please try again later.' },
      { status: 500 }
    )
  }
}
