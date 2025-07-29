import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Handle missing DATABASE_URL during build
let prismaClient: PrismaClient | null = null

try {
  if (process.env.DATABASE_URL) {
    prismaClient = globalForPrisma.prisma ?? new PrismaClient()
  } else {
    console.warn('DATABASE_URL not found. Prisma client will be disabled.')
    prismaClient = null
  }
} catch (error) {
  console.warn('Failed to initialize Prisma client:', error)
  prismaClient = null
}

export const prisma = prismaClient as PrismaClient

if (process.env.NODE_ENV !== 'production' && prismaClient) {
  globalForPrisma.prisma = prismaClient
}
