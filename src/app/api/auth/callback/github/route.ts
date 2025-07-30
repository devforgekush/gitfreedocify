import { NextRequest } from 'next/server'

// Ultra-simple callback - just redirect with params
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  
  // Get all params and pass them to the client-side callback
  const params = new URLSearchParams()
  searchParams.forEach((value, key) => {
    params.append(key, value)
  })
  
  // Redirect to client-side callback page with all params
  const callbackUrl = new URL('/auth/callback', url.origin)
  callbackUrl.search = params.toString()
  
  return Response.redirect(callbackUrl.toString(), 302)
}
