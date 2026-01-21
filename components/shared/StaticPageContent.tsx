import type { StaticPage } from '@/lib/strapi/types';
import MarkdownHtmlContent from '@/components/shared/MarkdownHtmlContent';
import PageBanner from '@/components/shared/page-banner';

/** Props for StaticPageContent component */
interface StaticPageContentProps {
  page: StaticPage;
  /** Whether to show the PageBanner component (default: false) */
  showBanner?: boolean;
}

/**
 * Renders static page content from Strapi
 * Optionally displays a PageBanner at the top for pages like Privacy Policy, Terms of Service
 */
const StaticPageContent = ({ page, showBanner = false }: StaticPageContentProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-8 md:pt-28 md:pb-12">
      {/* Page Banner - shown for specific pages like Privacy Policy */}
      {showBanner && (
        <div className="mb-8 flex justify-center">
          <PageBanner title={page.title.toUpperCase()} />
        </div>
      )}

      {/* Standard header - shown when banner is not displayed */}
      {!showBanner && (
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {page.title}
          </h1>
        </header>
      )}

      {/* Page content */}
      <MarkdownHtmlContent content={page.content} />
    </div>
  );
};

export default StaticPageContent;
