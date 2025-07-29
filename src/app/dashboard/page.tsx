'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Github, FileText, Plus, Search, LogOut, Star, GitFork, ExternalLink, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Repository {
  id: string
  name: string
  description?: string
  githubUrl: string
  githubId: string
  language?: string
  updated_at?: string
  isPublic?: boolean
  stargazers_count?: number
  forks_count?: number
  hasDocumentation?: boolean
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchRepositories = useCallback(async () => {
    try {
      console.log('🔄 Fetching GitHub repositories...')
      setLoading(true)
      
      // Fetch GitHub repositories
      const response = await fetch('/api/github/repositories', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/signin')
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('📊 GitHub repositories loaded:', data)

      if (data.repositories) {
        // Fetch existing projects to mark which have documentation
        const projectsResponse = await fetch('/api/projects', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })

        let existingProjects = []
        if (projectsResponse.ok) {
          existingProjects = await projectsResponse.json()
        }

        // Mark repositories with documentation status
        const reposWithDocStatus = data.repositories.map((repo: Repository) => ({
          ...repo,
          hasDocumentation: existingProjects.some((p: { githubId: string }) => p.githubId === repo.githubId)
        }))

        setRepositories(reposWithDocStatus)
        console.log('✅ Repositories with doc status:', reposWithDocStatus.length)
      }
    } catch (error) {
      console.error('❌ Error fetching repositories:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchRepositories()
    }
  }, [status, fetchRepositories])

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your repositories...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to view your dashboard.</p>
          <Link href="/auth/signin" className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg shadow-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">GitFreeDocify</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                    {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">
                  {session.user?.name}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Your GitHub Repositories</h1>
            <p className="text-gray-600 mt-2 text-lg">
              All your GitHub repositories ({repositories.length} total)
            </p>
          </div>
          <Link
            href="/generate"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            <span>Generate Documentation</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Repositories Grid */}
        {filteredRepos.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRepos.map((repo) => (
              <div key={repo.id} className="group bg-white/80 backdrop-blur-lg rounded-2xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Github className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{repo.name}</h3>
                  </div>
                  <Link
                    href={repo.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-indigo-600 transition-colors transform hover:scale-110"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Link>
                </div>

                <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {repo.description || 'No description available'}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>{repo.stargazers_count || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="h-3 w-3" />
                      <span>{repo.forks_count || 0}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    repo.isPublic ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {repo.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {repo.language && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {repo.language}
                      </span>
                    )}
                    {repo.hasDocumentation && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        ✓ Documented
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/generate?repo=${encodeURIComponent(repo.githubUrl)}`}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      repo.hasDocumentation
                        ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {repo.hasDocumentation ? 'Update Docs' : 'Generate Docs'}
                  </Link>
                </div>

                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Updated {new Date(repo.updated_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Github className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No repositories found' : 'No repositories available'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? `No repositories match "${searchQuery}"`
                : 'Make sure you have access to GitHub repositories and try refreshing.'
              }
            </p>
            <Link
              href="/generate"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              <span>Generate Documentation</span>
            </Link>
          </div>
        )}
      </main>

      {/* Footer with Developer Credit */}
      <footer className="bg-white/90 backdrop-blur-lg border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Developed with ❤️ by{' '}
              <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Kushagra Jain
              </span>
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <span>🚀</span>
                <span>Innovation</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>⭐</span>
                <span>Quality</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>🎯</span>
                <span>Excellence</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
