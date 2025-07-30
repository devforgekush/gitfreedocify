'use client'

import Link from 'next/link'

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
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
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
            GitFreeDocify
          </h1>
          <p className="text-2xl text-gray-600 mb-4 font-light">
            AI-Powered Documentation Generator
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Generate professional documentation for your GitHub repositories using AI. 
            Create comprehensive README files and project documentation in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/generate"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Generate Documentation
            </Link>
            <Link
              href="/dashboard"
              className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-indigo-200 hover:border-indigo-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View Dashboard
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">AI-Powered</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced AI analyzes your code structure and generates comprehensive documentation automatically.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate professional README files and documentation in seconds, not hours.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <span className="text-white text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">
                Your code stays secure. We only analyze repository structure, not your source code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
