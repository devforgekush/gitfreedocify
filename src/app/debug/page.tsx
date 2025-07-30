'use client'

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [envInfo, setEnvInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkEnvironment = async () => {
      try {
        const response = await fetch('/api/debug')
        if (response.ok) {
          const data = await response.json()
          setEnvInfo(data)
        } else {
          setError('Failed to fetch environment info')
        }
      } catch (err) {
        setError(`Error: ${err}`)
      }
    }

    checkEnvironment()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Information</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {envInfo && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Environment Status</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(envInfo, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Client-Side Check</h2>
          <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}</p>
          <p><strong>Window Location:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
          <p><strong>Current Time:</strong> {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  )
}
