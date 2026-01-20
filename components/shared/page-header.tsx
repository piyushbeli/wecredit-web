'use client';

import { JSX } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  /** Title displayed in the header */
  title: string;
  /** Custom back action - defaults to router.back() if not provided */
  onBack?: () => void;
}

/**
 * Reusable sticky page header with back navigation.
 * Used for internal pages that need a simple back + title header.
 */
const PageHeader = ({ title, onBack }: PageHeaderProps): JSX.Element => {
  const router = useRouter();

  const handleBack = (): void => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="p-0 bg-transparent border-none cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-7 h-7 pr-2" />
          </button>
          <h1 className="text-sm font-medium text-gray-900">{title}</h1>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
