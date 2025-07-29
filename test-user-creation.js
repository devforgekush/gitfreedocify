import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testUserCreation() {
  try {
    console.log('🧪 Testing user creation...')
    
    // Test email
    const testEmail = 'jain.toni.ravi@gmail.com'
    
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: testEmail }
    })
    
    if (user) {
      console.log('✅ User already exists:', user.id)
    } else {
      console.log('👤 Creating test user...')
      user = await prisma.user.create({
        data: {
          email: testEmail,
          name: 'GitHub User',
          image: null,
        },
      })
      console.log('✅ User created successfully:', user.id)
    }
    
    // Count total users
    const userCount = await prisma.user.count()
    console.log(`📊 Total users in database: ${userCount}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testUserCreation()
