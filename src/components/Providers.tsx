'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  try {
    return (
      <SessionProvider>
        {children}
      </SessionProvider>
    )
  } catch (error) {
    console.error('SessionProvider error:', error)
    // Fallback without SessionProvider if it fails
    return <>{children}</>
  }
}
