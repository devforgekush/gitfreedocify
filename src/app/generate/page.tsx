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

      // Check if response is ok first
      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (jsonError) {
          // If JSON parsing fails, use response text
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        }
        
        throw new Error(errorMessage)
      }

      // Parse successful response
      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError)
        throw new Error('Server returned invalid response. Please try again.')
      }

      if (!data.readme) {
        throw new Error('No documentation content was generated. Please try again.')
      }

      setGeneratedContent(data.readme)
    } catch (error) {
      console.error('Generation error:', error)
      
      // Provide more specific error messages
      let errorMessage = 'An error occurred while generating documentation'
      
      if (error instanceof Error) {
        if (error.message.includes('rate limit')) {
          errorMessage = 'GitHub API rate limit exceeded. Please try again in a few minutes.'
        } else if (error.message.includes('Not Found') || error.message.includes('404')) {
          errorMessage = 'Repository not found. Please check the URL and ensure the repository is accessible.'
        } else if (error.message.includes('403')) {
          errorMessage = 'Access denied. Please ensure you have permission to access this repository.'
        } else if (error.message.includes('invalid response')) {
          errorMessage = 'Server returned an invalid response. Please try again.'
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
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

        {/* Enhanced Developer Profile Section */}
        <div className="mt-16 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 max-w-2xl mx-auto">
            <div className="text-center">
              {/* Profile Image */}
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
                  <span className="text-3xl">👨‍💻</span>
                </div>
              </div>

              {/* Main Text */}
              <h3 className="text-2xl font-bold mb-3">
                <span className="text-white">Developed with </span>
                <span className="text-red-400 text-3xl animate-pulse">❤️</span>
                <span className="text-white"> by</span>
              </h3>
              
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Kushagra Jain
                </span>
              </h2>

              {/* Description */}
              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg mx-auto">
                Passionate full-stack developer creating innovative solutions to make developers' lives easier. 
                Building the future of AI-powered development tools.
              </p>

              {/* Skills/Values */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                  <span className="text-xl">🚀</span>
                  <span className="text-white font-medium">Innovation</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                  <span className="text-xl">⭐</span>
                  <span className="text-white font-medium">Quality</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                  <span className="text-xl">🎯</span>
                  <span className="text-white font-medium">Excellence</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-4">
                <a
                  href="https://github.com/devforgekush"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-gray-800/80 hover:bg-gray-700/80 text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/kushagra-jain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-blue-600/80 hover:bg-blue-500/80 text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
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
