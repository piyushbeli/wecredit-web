/**
 * Polling State for Offers Page
 */
export const PollingState = () => {
  return (
    <div className="px-4 py-12 text-center">
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-ping" />
        <div className="relative w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
          <span className="text-5xl animate-bounce">🔍</span>
        </div>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Searching for best offers
      </h2>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        We are checking with our lender partners to find the best loan offers for you. This may take a moment...
      </p>
      <div className="flex justify-center gap-1">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};
