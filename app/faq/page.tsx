import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import FaqWrapper from '@/components/shared/faq-wrapper';

export const metadata: Metadata = buildPageMetadata('/faq/');

const FaqPage = (): React.ReactNode => {
  return (
    <div className="max-w-7xl mx-auto">
      <FaqWrapper />
    </div>
  );
};

export default FaqPage;
