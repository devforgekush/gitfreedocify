'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Github, ArrowLeft, Zap, FileText, Download } from 'lucide-react'
import Link from 'next/link'

function GeneratePageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [githubUrl, setGithubUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [error, setError] = useState('')

  // Auto-populate GitHub URL from search params (when coming from dashboard)
  useEffect(() => {
    const repoParam = searchParams.get('repo')
    if (repoParam) {
      setGithubUrl(decodeURIComponent(repoParam))
    }
  }, [searchParams])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const handleGenerate = async () => {
    if (!githubUrl.trim()) {
      setError('Please enter a GitHub repository URL')
      return
    }

    // Validate GitHub URL
    const githubRegex = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/
    if (!githubRegex.test(githubUrl)) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ githubUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate documentation')
      }

      const data = await response.json()
      setGeneratedContent(data.readme)
    } catch (error) {
      console.error('Generation error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while generating documentation')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'README.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Enhanced 3D Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-3xl transform rotate-12 shadow-2xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl transform -rotate-12 shadow-2xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full transform rotate-45 shadow-xl opacity-15"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl transform -rotate-45 shadow-xl opacity-20"></div>
        <div className="absolute top-1/4 right-20 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl transform rotate-12 shadow-lg opacity-15"></div>
      </div>

      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors transform hover:scale-110 duration-300">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                  Generate Documentation
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {!generatedContent ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform hover:rotate-12 transition-transform duration-300">
                <Github className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent drop-shadow-lg">
                  Generate Professional Documentation
                </span>
              </h1>
              <p className="text-gray-200 text-lg font-medium">
                Enter a GitHub repository URL to automatically generate comprehensive documentation
              </p>
              <div className="mt-6 p-6 bg-blue-500/20 border border-blue-400/30 rounded-2xl backdrop-blur-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-blue-200">
                      Repository Access Required
                    </h3>
                    <div className="mt-2 text-blue-100">
                      <p className="font-medium">You can only generate documentation for repositories you:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                        <li>Own or have admin access to</li>
                        <li>Have collaborator/write access to</li>
                        <li>Public repositories you can access</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-lg mx-auto">
              <label htmlFor="githubUrl" className="block text-lg font-semibold text-white mb-3">
                GitHub Repository URL
              </label>
              <input
                type="url"
                id="githubUrl"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/owner/repository"
                className="w-full px-6 py-4 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white/10 backdrop-blur-lg text-white placeholder-gray-300 font-medium text-lg shadow-lg"
                disabled={isGenerating}
              />
              
              {error && (
                <p className="mt-3 text-red-300 font-medium bg-red-500/20 p-3 rounded-lg border border-red-400/30">{error}</p>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !githubUrl.trim()}
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl transform hover:scale-105 font-semibold text-lg border border-white/20"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Analyzing repository...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-6 w-6" />
                    <span>Generate Documentation</span>
                  </>
                )}
              </button>

              <div className="mt-6 text-center">
                <p className="text-gray-300 font-medium">
                  This will analyze your repository structure, dependencies, and code to create professional documentation.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Generated Content Header */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                      Documentation Generated Successfully!
                    </span>
                  </h1>
                  <p className="text-gray-200 text-lg font-medium">
                    Your README.md has been generated. Review and download when ready.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setGeneratedContent('')
                      setGithubUrl('')
                      setError('')
                    }}
                    className="bg-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 font-semibold transform hover:scale-105 border border-white/30"
                  >
                    Generate Another
                  </button>
                  <button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 flex items-center space-x-2 font-semibold transform hover:scale-105 shadow-lg"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Content Preview */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
              <div className="border-b border-white/20 px-8 py-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">README.md Preview</h2>
              </div>
              <div className="p-8">
                <pre className="whitespace-pre-wrap text-sm text-gray-100 font-mono bg-black/30 p-6 rounded-2xl border border-white/10 overflow-auto max-h-96 backdrop-blur-lg">
                  {generatedContent}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Developer Credit */}
        <div className="mt-12 text-center">
          <p className="text-gray-400">
            Developed by{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-semibold">
              Kushagra Jain
            </span>
          </p>
        </div>
      </main>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
  )
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GeneratePageContent />
    </Suspense>
  )
}
