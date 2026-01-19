/**
 * Loading Skeleton for Offers Page
 */
export const OffersLoadingSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="h-6 bg-gray-200 rounded w-32" />
        </div>
      </div>
      {/* Hero skeleton */}
      <div className="bg-white px-4 py-6">
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-3" />
          <div className="h-5 bg-gray-200 rounded w-64 mx-auto" />
        </div>
      </div>
      {/* Offers skeleton */}
      <div className="px-4 py-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 rounded-2xl p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-32" />
                </div>
              </div>
              <div className="w-20 h-20 bg-gray-200 rounded-full" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-48 mb-4" />
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};
