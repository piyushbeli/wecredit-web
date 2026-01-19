interface ErrorStateProps {
  readonly error: string;
  readonly onRetry: () => void;
}

/**
 * Error State for Offers Page
 */
export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className="px-4 py-12 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
        <span className="text-4xl">⚠️</span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Unable to Load Offers
      </h2>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};
