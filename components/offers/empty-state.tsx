/**
 * Empty State for Offers Page
 */
export const EmptyState = () => {
  return (
    <div className="px-4 py-12 text-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
        <span className="text-5xl">📋</span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        No Offers Available
      </h2>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        We couldn't find any loan offers at the moment. Please check back later or complete your profile.
      </p>
    </div>
  );
};
