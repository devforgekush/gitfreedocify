// Safe Prisma configuration for Netlify deployment
let prismaClient: any = null

// Mock Prisma client for environments where database is not needed
const mockPrismaClient = {
  user: {
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve(null),
    count: () => Promise.resolve(0),
    findMany: () => Promise.resolve([]),
  },
  project: {
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve(null),
    findMany: () => Promise.resolve([]),
    delete: () => Promise.resolve(null),
  },
  $connect: () => Promise.resolve(),
  $disconnect: () => Promise.resolve(),
}

// Only initialize Prisma if it's available and needed
try {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '' && !process.env.SKIP_PRISMA_GENERATE) {
    const { PrismaClient } = require('@prisma/client')
    prismaClient = new PrismaClient()
  } else {
    console.log('Using mock Prisma client (database not required)')
    prismaClient = mockPrismaClient
  }
} catch (error) {
  console.log('Prisma not available, using mock client:', error.message)
  prismaClient = mockPrismaClient
}

export const prisma = prismaClient
        if (prop === 'user') {
          return {
            findUnique: () => Promise.resolve(null),
            create: () => Promise.resolve({ id: 'temp-user', email: 'temp@example.com' }),
            findMany: () => Promise.resolve([]),
          }
        }
        if (prop === 'account') {
          return {
            findFirst: () => Promise.resolve(null),
            findMany: () => Promise.resolve([]),
          }
        }
        if (prop === 'project') {
          return {
            findMany: () => Promise.resolve([]),
            findUnique: () => Promise.resolve(null),
            create: () => Promise.resolve({ id: 'temp-project' }),
            update: () => Promise.resolve({ id: 'temp-project' }),
            upsert: () => Promise.resolve({ id: 'temp-project' }),
          }
        }
        return () => Promise.resolve(null)
      }
    }
    return (prismaClient as PrismaClient)[prop as keyof PrismaClient]
  }
})

if (process.env.NODE_ENV !== 'production' && prismaClient) {
  globalForPrisma.prisma = prismaClient
}
