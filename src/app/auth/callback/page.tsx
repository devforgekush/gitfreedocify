'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, AlertCircle, Github } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    const handleGitHubCallback = async () => {
      try {
        // Get the authorization code from URL params
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const error_description = searchParams.get('error_description')

        if (error) {
          setStatus('error')
          setMessage(`GitHub OAuth Error: ${error_description || error}`)
          return
        }

        if (!code) {
          setStatus('error')
          setMessage('No authorization code received from GitHub')
          return
        }

        setMessage('Exchanging authorization code for access token...')

        // Use our secure server endpoint to exchange the code
        const tokenResponse = await fetch('/api/auth/github/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        })

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json()
          throw new Error(errorData.error || `Token exchange failed: ${tokenResponse.statusText}`)
        }

        const { user, success } = await tokenResponse.json()

        if (!success || !user) {
          throw new Error('Invalid response from token exchange')
        }

        setUserInfo(user)
        setStatus('success')
        setMessage(`Welcome, ${user.name || user.login}!`)

        // Store user data in localStorage for demo purposes
        localStorage.setItem('github_user', JSON.stringify(user))

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push(`/dashboard?user=${user.login}&success=github_auth`)
        }, 2000)

      } catch (error) {
        console.error('GitHub OAuth error:', error)
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Authentication failed')
      }
    }

    // Only run if we have URL params indicating this is a GitHub callback
    if (searchParams.get('code') || searchParams.get('error')) {
      handleGitHubCallback()
    } else if (searchParams.get('source') === 'github') {
      // This came from our server redirect, get params from current URL
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('code') || urlParams.get('error')) {
        handleGitHubCallback()
      } else {
        setStatus('error')
        setMessage('No GitHub authorization parameters found')
      }
    } else {
      setStatus('error')
      setMessage('Invalid callback request')
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 text-center">
          <div className="mb-8">
            {status === 'loading' && (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            )}
            {status === 'success' && (
              <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            )}
            {status === 'error' && (
              <div className="h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold text-white mb-4">
            {status === 'loading' && 'Authenticating with GitHub...'}
            {status === 'success' && 'Authentication Successful!'}
            {status === 'error' && 'Authentication Failed'}
          </h1>

          <p className="text-gray-200 mb-6">{message}</p>

          {userInfo && (
            <div className="flex items-center justify-center space-x-3 mb-6 p-4 bg-white/5 rounded-xl">
              <img
                src={userInfo.avatar_url}
                alt={userInfo.name || userInfo.login}
                className="h-12 w-12 rounded-full border-2 border-white/30"
              />
              <div className="text-left">
                <p className="text-white font-semibold">{userInfo.name || userInfo.login}</p>
                <p className="text-gray-300 text-sm">{userInfo.email}</p>
              </div>
              <Github className="h-6 w-6 text-gray-400" />
            </div>
          )}

          {status === 'success' && (
            <p className="text-sm text-gray-300">
              Redirecting to dashboard...
            </p>
          )}

          {status === 'error' && (
            <button
              onClick={() => router.push('/auth/signin')}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 font-semibold"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
