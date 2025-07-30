'use client'

import Link from 'next/link'
import { Github, ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleDemoAuth = () => {
    setIsLoading(true)
    setMessage('Setting up demo user...')
    
    const mockUser = {
      login: 'demo-user',
      name: 'Demo User',
      email: 'demo@example.com',
      avatar_url: 'https://github.com/github.png',
      provider: 'github'
    }
    
    localStorage.setItem('github_user', JSON.stringify(mockUser))
    
    setTimeout(() => {
      window.location.href = `/dashboard?user=${mockUser.login}&success=github_auth`
    }, 1000)
  }

  const handleRealAuth = () => {
    setIsLoading(true)
    setMessage('Redirecting to GitHub...')
    
    try {
      const clientId = 'Ov23lic3yzTiKmTqGpQp'
      const redirectUri = encodeURIComponent('https://gitfreedocify.netlify.app/auth/callback')
      const scope = encodeURIComponent('read:user user:email public_repo')
      const state = Math.random().toString(36).substring(2, 15)
      
      sessionStorage.setItem('oauth_state', state)
      
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`
      
      window.location.href = githubAuthUrl
    } catch (error) {
      console.error('Auth error:', error)
      setMessage('❌ Authentication failed')
      setIsLoading(false)
    }
  }

  const handleTestAPI = async () => {
    setIsLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/test')
      if (response.ok) {
        const text = await response.text()
        setMessage(`✅ API working: ${text}`)
      } else {
        setMessage(`❌ API failed: ${response.status}`)
      }
    } catch (error) {
      setMessage(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-3xl transform rotate-12 shadow-2xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl transform -rotate-12 shadow-2xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full transform rotate-45 shadow-xl opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl transform -rotate-45 shadow-xl opacity-25"></div>
        <div className="absolute top-1/4 right-20 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl transform rotate-12 shadow-lg opacity-20"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 transform hover:scale-105 transition-all duration-300">
          <div className="text-center mb-10">
            <div className="mb-6">
              <div className="h-20 w-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform hover:rotate-12 transition-transform duration-300">
                <span className="text-white font-bold text-3xl drop-shadow-lg">G</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent drop-shadow-lg">
                Welcome to GitFreeDocify
              </span>
            </h1>
            <p className="text-gray-200 text-lg font-medium">Sign in to start generating professional documentation</p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-gray-500/10 border border-gray-500/20 rounded-xl">
              <p className="text-gray-200 text-sm text-center">{message}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleDemoAuth}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-800 to-green-900 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transform hover:scale-105 hover:shadow-2xl border border-white/10"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <Github className="h-6 w-6" />
                  <span className="font-semibold text-lg">Demo Authentication</span>
                </>
              )}
            </button>

            <button
              onClick={handleRealAuth}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-6 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transform hover:scale-105 hover:shadow-2xl border border-white/10"
            >
              <Github className="h-6 w-6" />
              <span className="font-semibold text-lg">Real GitHub OAuth</span>
            </button>

            <button
              onClick={handleTestAPI}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transform hover:scale-105 hover:shadow-2xl border border-white/10"
            >
              <span className="font-semibold">Test API</span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-300">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-indigo-300 hover:text-indigo-200 transition-colors font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-indigo-300 hover:text-indigo-200 transition-colors font-medium">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition-colors inline-flex items-center font-medium transform hover:scale-105 duration-300"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to home
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Developed by{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-semibold">
              Kushagra Jain
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
