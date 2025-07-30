'use client'

import { signIn, getSession } from 'next-auth/react'
import { Github, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession()
        if (session) {
          router.push('/dashboard')
        }
      } catch (err) {
        console.error('Session check error:', err)
      }
    }
    checkSession()
  }, [router])

  const handleGitHubSignIn = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const result = await signIn('github', { 
        callbackUrl: '/dashboard',
        redirect: false 
      })
      
      if (result?.error) {
        setError('Failed to sign in. Please try again.')
        console.error('Sign in error:', result.error)
      } else if (result?.url) {
        window.location.href = result.url
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Enhanced 3D Background Elements */}
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

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            onClick={handleGitHubSignIn}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-6 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transform hover:scale-105 hover:shadow-2xl border border-white/10"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <>
                <Github className="h-6 w-6" />
                <span className="font-semibold text-lg">Continue with GitHub</span>
              </>
            )}
          </button>

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

        {/* Developer Credit */}
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
