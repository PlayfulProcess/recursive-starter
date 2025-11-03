export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Failed
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn't verify your login link. This could happen if:
          </p>
          <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
            <li>• The link has expired (links are valid for 1 hour)</li>
            <li>• The link was already used</li>
            <li>• The link was copied incorrectly</li>
          </ul>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </a>
        </div>
      </div>
    </div>
  );
}
