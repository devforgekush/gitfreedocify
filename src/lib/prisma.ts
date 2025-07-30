import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Handle missing DATABASE_URL during build
let prismaClient: PrismaClient | null = null

try {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
    prismaClient = globalForPrisma.prisma ?? new PrismaClient()
  } else {
    console.warn('DATABASE_URL not found or empty. Prisma client will be disabled.')
    prismaClient = null
  }
} catch (error) {
  console.warn('Failed to initialize Prisma client:', error)
  prismaClient = null
}

// Create a safe prisma client that throws meaningful errors
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!prismaClient) {
      if (process.env.NODE_ENV === 'development') {
        throw new Error('Database connection not available. Please check your DATABASE_URL environment variable.')
      } else {
        // In production, return empty results for database operations
        console.warn('Database not available, returning empty result for:', String(prop))
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
