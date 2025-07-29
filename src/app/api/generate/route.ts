import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GitHubAnalyzer } from '@/lib/ai-service'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('Generate API called')
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      console.log('No session or email found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('User email:', session.user.email)

    // Find or create the user in the database
    let user = await prisma.user.findUnique({
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
      
      console.log('New user created:', user.id)
    } else {
      console.log('User found:', user.id)
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

    // Get GitHub access token from user's account
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        provider: 'github',
      },
    })

    if (!account?.access_token) {
      return NextResponse.json(
        { error: 'GitHub access token not found. Please reconnect your GitHub account.' },
        { status: 400 }
      )
    }

    // Verify user has access to the repository
    console.log('🔐 Checking repository access...')
    try {
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
        headers: {
          'Authorization': `Bearer ${account.access_token}`,
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
    const analyzer = new GitHubAnalyzer(account.access_token)
    const analysis = await analyzer.analyzeRepository(owner, repoName)

    // Generate documentation using the analyzer
    const readme = await analyzer.generateREADME(analysis)

    // Save project to database
    const project = await prisma.project.upsert({
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

    return NextResponse.json({
      readme,
      project,
      analysis: {
        name: analysis.name,
        description: analysis.description,
        language: analysis.language,
        languages: analysis.languages,
        hasTests: analysis.hasTests,
        hasDocumentation: analysis.hasDocumentation,
      },
    })
  } catch (error) {
    console.error('Error generating documentation:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
      if (error.message.includes('Not Found')) {
        return NextResponse.json(
          { error: 'Repository not found or not accessible. Make sure the repository is public.' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate documentation. Please try again.' },
      { status: 500 }
    )
  }
}
