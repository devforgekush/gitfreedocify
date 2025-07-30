import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      status: 'success',
      message: 'Auth endpoint working',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Auth endpoint failed'
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    return NextResponse.json({
      status: 'success',
      message: 'Auth POST working',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Auth POST failed'
    }, { status: 500 })
  }
}
