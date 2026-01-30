// components/shared/page-loader.tsx
import { Loader2 } from 'lucide-react';

export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
    </div>
  );
};