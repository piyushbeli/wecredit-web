import type { StaticPage } from '@/lib/strapi/types';
import MarkdownHtmlContent from '@/components/shared/MarkdownHtmlContent';

/** Props for StaticPageContent component */
interface StaticPageContentProps {
  page: StaticPage;
}

/**
 * Renders static page content from Strapi
 */
const StaticPageContent = ({ page }: StaticPageContentProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-8 md:pt-28 md:pb-12">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {page.title}
        </h1>
      </header>
      <MarkdownHtmlContent content={page.content} />
    </div>
  );
};

export default StaticPageContent;
