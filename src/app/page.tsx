'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Page() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      console.log('GitFreeDocify: Main page loaded successfully')
      
      // Debug info
      if (typeof window !== 'undefined') {
        console.log('Window location:', window.location.href)
        console.log('User agent:', navigator.userAgent)
      }
      
      setIsLoaded(true)
    } catch (error) {
      console.error('Page load error:', error)
      setIsLoaded(true) // Still show the page even if there's an error
    }
  }, [])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <p className="text-gray-600">Loading GitFreeDocify...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-3xl transform rotate-12 shadow-2xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl transform -rotate-12 shadow-2xl"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl transform rotate-45 shadow-2xl"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl transform -rotate-6 shadow-2xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">GitFreeDocify</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/auth/signin"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
                AI-Powered
              </span>
              <br />
              <span className="text-gray-900 drop-shadow-lg">
                Documentation Generator
              </span>
            </h1>
            <div className="absolute inset-0 blur-3xl opacity-20">
              <div className="bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full w-96 h-96 mx-auto"></div>
            </div>
          </div>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Generate professional documentation for your GitHub repositories using AI. 
            Create comprehensive README files and project documentation in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link 
              href="/auth/signin"
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 inline-flex items-center justify-center"
            >
              <span className="mr-2">🚀</span>
              Get Started Free
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity -z-10"></div>
            </Link>
            <a 
              href="#features"
              className="group border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 inline-flex items-center justify-center"
            >
              <span className="mr-2">📖</span>
              Learn More
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-32">
          <h2 className="text-5xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-center text-gray-600 mb-20 text-lg">Everything you need to create amazing documentation</p>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="group bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 border border-white/50">
              <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-2xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">AI-Powered Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced AI analyzes your codebase structure, dependencies, and patterns to generate comprehensive documentation.
              </p>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 border border-white/50">
              <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate professional documentation in seconds, not hours. Save time and focus on coding.
              </p>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 border border-white/50">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-2xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Professional Output</h3>
              <p className="text-gray-600 leading-relaxed">
                Get beautifully formatted README files with installation guides, usage examples, and API documentation.
              </p>
            </div>
          </div>
        </div>


      </div>

      {/* Enhanced Footer with Developer Profile */}
      <footer className="relative z-10 bg-white/90 backdrop-blur-xl border-t border-gray-200 mt-20">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl border border-gray-200 shadow-2xl p-8">
            <div className="text-center">
              {/* Profile Image */}
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
                  <span className="text-3xl">👨‍💻</span>
                </div>
              </div>

              {/* Main Text */}
              <h3 className="text-2xl font-bold mb-3">
                <span className="text-gray-800">Developed with </span>
                <span className="text-red-500 text-3xl animate-pulse">❤️</span>
                <span className="text-gray-800"> by</span>
              </h3>
              
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Kushagra Jain
                </span>
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg mx-auto">
                Passionate full-stack developer creating innovative solutions to make developers&apos; lives easier. 
                Building the future of AI-powered development tools.
              </p>

              {/* Skills/Values */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-3 rounded-2xl border border-indigo-200">
                  <span className="text-xl">🚀</span>
                  <span className="font-semibold">Innovation</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-3 rounded-2xl border border-purple-200">
                  <span className="text-xl">⭐</span>
                  <span className="font-semibold">Quality</span>
                </div>
                <div className="flex items-center space-x-2 bg-pink-100 text-pink-700 px-4 py-3 rounded-2xl border border-pink-200">
                  <span className="text-xl">🎯</span>
                  <span className="font-semibold">Excellence</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center">
                <a
                  href="https://github.com/devforgekush"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
