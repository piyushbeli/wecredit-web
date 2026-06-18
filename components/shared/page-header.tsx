'use client';

import { JSX } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useInfoSearchParams } from '@/hooks/use-info-search-params';
import { useIsMobilePlatform } from '@/hooks/use-is-mobile-platform';

interface PageHeaderProps {
  /** Title displayed in the header */
  title: string;
  /** Custom back action - defaults to router.back() if not provided */
  onBack?: () => void;
  isOfferStatus?: boolean;
}

/**
 * Reusable sticky page header with back navigation.
 * Used for internal pages that need a simple back + title header.
 */
const PageHeader = ({ title, onBack, isOfferStatus = false }: PageHeaderProps): JSX.Element | null => {
  const router = useRouter();
  const { isAffiliate } = useInfoSearchParams();
  const isMobilePlatform = useIsMobilePlatform();

  // App webview provides its own navigation chrome
  if (isMobilePlatform) {
    return null;
  }

  const handleBack = (): void => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  const renderBackButton = () => {

    if (isAffiliate && !isOfferStatus) return;
    return (
      <button
        type="button"
        onClick={handleBack}
        className="p-0 bg-transparent border-none cursor-pointer"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
      </button>
    )
  }

  return (
    <header className="bg-white sticky top-0 z-10 shadow-[2px_2px_4px_0px_#0000001A]">
      <div className="px-4 py-4">
        <div className="flex items-center gap-4">
          {renderBackButton()}
          <h1 className=" font-normal text-sm leading-7 tracking-normal text-gray-900">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
