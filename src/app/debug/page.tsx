'use client'

import { useSession } from 'next-auth/react'

export default function SessionDebugPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Session Debug</h1>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          <p><strong>Status:</strong> {status}</p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Data</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tests</h2>
          <div className="space-y-2">
            <p><strong>Has Session:</strong> {session ? 'Yes' : 'No'}</p>
            <p><strong>Has User:</strong> {session?.user ? 'Yes' : 'No'}</p>
            <p><strong>Has Email:</strong> {session?.user?.email ? 'Yes' : 'No'}</p>
            <p><strong>Email:</strong> {session?.user?.email || 'Not available'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
