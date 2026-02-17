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
<header className="bg-white sticky top-0 z-10 shadow-[2px_2px_4px_0px_#0000001A]">
      <div className="px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="p-0 bg-transparent border-none cursor-pointer"
            aria-label="Go back"
          >
<ArrowLeft className="w-6 h-6" strokeWidth={1.5}/>
          </button>
<h1 className="font-['Poppins'] font-normal text-sm leading-7 tracking-normal text-gray-900">
  {title}
</h1>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
