import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if database is available and find/create user
    let user: any
    try {
      // Find or create the user in the database
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
      })

      if (!user) {
        // Create the user if they don't exist
        user = await prisma.user.create({
          data: {
            email: session.user.email,
            name: session.user.name || 'GitHub User',
            image: session.user.image || null,
          },
        })
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      )
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if database is available and find/create user
    let user: any
    try {
      // Find or create the user in the database
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
      })

      if (!user) {
        // Create the user if they don't exist
        user = await prisma.user.create({
          data: {
            email: session.user.email,
            name: session.user.name || 'GitHub User',
            image: session.user.image || null,
          },
        })
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { githubUrl, name, description, language, githubId, readmeContent } = body

    // Validate required fields
    if (!githubUrl || !name || !githubId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if project already exists
    const existingProject = await prisma.project.findUnique({
      where: {
        userId_githubId: {
          userId: user.id,
          githubId,
        },
      },
    })

    if (existingProject) {
      // Update existing project
      const updatedProject = await prisma.project.update({
        where: {
          id: existingProject.id,
        },
        data: {
          name,
          description,
          language,
          readmeContent,
          updatedAt: new Date(),
        },
      })

      return NextResponse.json(updatedProject)
    } else {
      // Create new project
      const project = await prisma.project.create({
        data: {
          name,
          description,
          githubUrl,
          githubId,
          language,
          readmeContent,
          userId: user.id,
        },
      })

      return NextResponse.json(project, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating/updating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
