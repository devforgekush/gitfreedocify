export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          GitFreeDocify Test
        </h1>
        <p className="text-gray-600">
          If you can see this, the function is working correctly.
        </p>
        <div className="mt-8">
          <a 
            href="/api/debug" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Test API
          </a>
        </div>
      </div>
    </div>
  )
}
