import { PrismaClient } from '@prisma/client'

// Test database connection
async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Test if tables exist (optional)
    const userCount = await prisma.user.count()
    console.log(`📊 Users in database: ${userCount}`)
    
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
