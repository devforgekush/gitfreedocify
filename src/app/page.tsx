import Link from 'next/link'

export default function Page() {
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

        {/* Developer Credit Section */}
        <div className="mt-32 text-center">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-12 shadow-2xl border border-white/50 backdrop-blur-lg">
            <div className="mb-6">
              <span className="text-6xl">👨‍💻</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Developed with ❤️ by</h3>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Kushagra Jain
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Passionate full-stack developer creating innovative solutions to make developers&apos; lives easier. 
              Building the future of AI-powered development tools.
            </p>
            <div className="mt-8 flex justify-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-500">
                <span className="text-2xl">🚀</span>
                <span className="font-semibold">Innovation</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <span className="text-2xl">⭐</span>
                <span className="font-semibold">Quality</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <span className="text-2xl">🎯</span>
                <span className="font-semibold">Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
