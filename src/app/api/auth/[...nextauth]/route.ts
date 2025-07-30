import { NextResponse } from 'next/server'

// Temporary simple auth endpoint to debug the crash issue
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const pathname = url.pathname
    
    // Log for debugging
    console.log('Auth request:', pathname)
    
    return NextResponse.json({
      status: 'working',
      message: 'NextAuth endpoint is functional',
      path: pathname,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Auth GET error:', error)
    return NextResponse.json({
      error: 'Auth GET failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const pathname = url.pathname
    
    console.log('Auth POST request:', pathname)
    
    return NextResponse.json({
      status: 'working',
      message: 'NextAuth POST is functional',
      path: pathname,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Auth POST error:', error)
    return NextResponse.json({
      error: 'Auth POST failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
