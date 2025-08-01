'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, User, Settings, LogOut, GitBranch, CheckCircle, Github } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [authSuccess, setAuthSuccess] = useState(false)

  useEffect(() => {
    // Check if user came from GitHub OAuth
    const githubUser = searchParams.get('user')
    const success = searchParams.get('success')
    
    if (githubUser && success === 'github_auth') {
      setAuthSuccess(true)
      setUser({
        name: githubUser,
        email: `${githubUser}@github.com`,
        avatar: `https://github.com/${githubUser}.png`,
        provider: 'github'
      })
      
      // Simulate some projects for the authenticated user
      setProjects([
        {
          id: 1,
          name: `${githubUser}/awesome-project`,
          description: 'A sample repository for testing documentation generation',
          language: 'TypeScript',
          stars: 42,
          lastGenerated: new Date().toISOString().split('T')[0],
          status: 'completed'
        }
      ])
      setLoading(false)
    } else {
      // For testing - simulate a logged-in user
      setTimeout(() => {
        setUser({
          name: 'Test User',
          email: 'test@example.com',
          avatar: '/default-avatar.png'
        })
        setProjects([
          {
            id: 1,
            name: 'my-awesome-repo',
            description: 'A sample repository for testing',
            language: 'TypeScript',
            stars: 42,
            lastGenerated: '2024-01-15',
            status: 'completed'
          },
          {
            id: 2,
            name: 'another-project',
            description: 'Another test project',
            language: 'Python',
            stars: 18,
            lastGenerated: '2024-01-10',
            status: 'in-progress'
          }
        ])
        setLoading(false)
      }, 1000)
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Success Banner */}
      {authSuccess && (
        <div className="bg-green-500/20 border-b border-green-500/30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center space-x-2 text-green-300">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Successfully signed in with GitHub!</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors inline-flex items-center font-medium"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to home
              </Link>
              <div className="h-6 w-px bg-gray-500"></div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={user?.avatar || '/default-avatar.png'}
                    alt={user?.name || 'User'}
                    className="h-10 w-10 rounded-full border-2 border-white/30"
                  />
                  {user?.provider === 'github' && (
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-gray-800 rounded-full flex items-center justify-center border border-white/30">
                      <Github className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-white">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-gray-300">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
                <Link
                  href="/auth/signin"
                  className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message for GitHub Users */}
        {user?.provider === 'github' && (
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 mb-8 border border-blue-500/30">
            <div className="flex items-center space-x-3 mb-3">
              <Github className="h-8 w-8 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Welcome, {user.name}!</h2>
            </div>
            <p className="text-gray-200 mb-4">
              Your GitHub account is now connected. You can generate professional documentation for any of your repositories.
            </p>
            <Link
              href="/generate"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold inline-block"
            >
              Generate Documentation
            </Link>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Total Projects</p>
                <p className="text-3xl font-bold text-white">{projects.length}</p>
              </div>
              <div className="p-3 bg-indigo-500/20 rounded-xl">
                <GitBranch className="h-8 w-8 text-indigo-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-white">
                  {projects.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-white">
                  {projects.filter(p => p.status === 'in-progress').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Settings className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Your Projects</h2>
              <Link
                href="/generate"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 font-semibold"
              >
                Generate New
              </Link>
            </div>
          </div>
          
          {projects.length > 0 ? (
            <div className="divide-y divide-white/10">
              {projects.map((project) => (
                <div key={project.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{project.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{project.language}</span>
                        <span>⭐ {project.stars}</span>
                        <span>Last generated: {project.lastGenerated}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                        View
                      </button>
                      <button className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors">
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="h-24 w-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto">
                  <GitBranch className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
              <p className="text-gray-300 mb-6">Start by generating documentation for your first repository</p>
              <Link
                href="/generate"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 font-semibold inline-block"
              >
                Generate Your First Project
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
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
  }, [router])

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 pb-safe">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg shadow-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link href="/" className="flex items-center space-x-1 sm:space-x-2 group">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">GitFreeDocify</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={28}
                    height={28}
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                  />
                ) : (
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs sm:text-sm font-medium">
                    {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:block">
                  {session.user?.name}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors p-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Your GitHub Repositories</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-lg">
              All your GitHub repositories ({repositories.length} total)
            </p>
          </div>
          <Link
            href="/generate"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            <Plus className="h-4 w-4" />
            <span>Generate Documentation</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4 sm:mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        {/* Repositories Grid */}
        {filteredRepos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredRepos.map((repo) => (
              <div key={repo.id} className="group bg-white/80 backdrop-blur-lg rounded-lg sm:rounded-2xl border border-white/50 p-4 sm:p-6 lg:p-8 hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 sm:transform sm:hover:scale-105 sm:hover:-translate-y-2 shadow-md sm:shadow-lg">
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Github className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{repo.name}</h3>
                  </div>
                  <Link
                    href={repo.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-indigo-600 transition-colors transform hover:scale-110 flex-shrink-0 ml-2"
                  >
                    <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </div>

                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2 leading-relaxed">
                  {repo.description || 'No description available'}
                </p>

                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-500">
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

                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-2 flex-wrap gap-1">
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
                    className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ${
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

      {/* Enhanced Footer with Developer Profile */}
      <footer className="bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-xl border-t border-white/10 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
            <div className="text-center">
              {/* Profile Image */}
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
                  <span className="text-2xl">👨‍💻</span>
                </div>
              </div>

              {/* Main Text */}
              <h3 className="text-xl font-bold mb-2">
                <span className="text-gray-700">Developed with </span>
                <span className="text-red-500 text-2xl animate-pulse">❤️</span>
                <span className="text-gray-700"> by</span>
              </h3>
              
              <h2 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Kushagra Jain
                </span>
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-base leading-relaxed mb-6 max-w-md mx-auto">
                Passionate full-stack developer creating innovative solutions to make developers&apos; lives easier. 
                Building the future of AI-powered development tools.
              </p>

              {/* Skills/Values */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <div className="flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-full border border-indigo-200">
                  <span className="text-lg">🚀</span>
                  <span className="font-medium text-sm">Innovation</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-50 text-purple-700 px-3 py-2 rounded-full border border-purple-200">
                  <span className="text-lg">⭐</span>
                  <span className="font-medium text-sm">Quality</span>
                </div>
                <div className="flex items-center space-x-2 bg-pink-50 text-pink-700 px-3 py-2 rounded-full border border-pink-200">
                  <span className="text-lg">🎯</span>
                  <span className="font-medium text-sm">Excellence</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center">
                <a
                  href="https://github.com/devforgekush"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
