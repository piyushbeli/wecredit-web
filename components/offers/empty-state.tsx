/**
 * Empty State for Offers Page
 */
export const EmptyState = ({ title, description }: { title?: string; description?: string }) => {
  const defaultTitle = 'No Offers Available';
  const defaultDescription = "We couldn't find any loan offers at the moment.";
  return (
    <div className="w-full px-4 pt-12 text-center h-full flex flex-col items-center justify-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
        <span className="text-5xl">📋</span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {title || defaultTitle || ''}
      </h2>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        {description || defaultDescription || ''}
      </p>
    </div>
  );
};
