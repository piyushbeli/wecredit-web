import MarkdownHtmlContent from '@/components/shared/MarkdownHtmlContent';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import PageHeader from '@/components/page/PageHeader';
import ChildPagesSection from './child-pages-section';
import { isChildPage } from './child-page-card';
import type { Page, Breadcrumb } from '@/types/strapi';
import { getBreadcrumbs } from '@/lib/api/pages';

/** Props for PageContent component */
interface PageContentProps {
  page: Page;
  breadcrumbs?: Breadcrumb[];
}

/**
 * Builds breadcrumbs from page's breadcrumbPath data
 */
function buildBreadcrumbsFromPath(page: Page): Breadcrumb[] | null {
  const pathItems = page.breadcrumbPath?.path || [];
  if (pathItems.length === 0) {
    return null;
  }
  const sortedPath = [...pathItems].sort((first, second) => first.order - second.order);
  const breadcrumbs = sortedPath.map((item) => ({
    title: item.label,
    path: item.url,
  }));
  const hasHome = breadcrumbs.some((breadcrumb) => breadcrumb.path === '/');
  if (!hasHome) {
    breadcrumbs.unshift({ title: 'Home', path: '/' });
  }
  const hasCurrentPage = breadcrumbs.some((breadcrumb) => breadcrumb.path === page.fullPath);
  if (!hasCurrentPage) {
    breadcrumbs.push({ title: page.title, path: page.fullPath });
  }
  return breadcrumbs;
}

/**
 * Renders main page content with breadcrumbs, header, content and children
 * Composes smaller, focused components for each section
 */
const PageContent = async ({ page, breadcrumbs: providedBreadcrumbs }: PageContentProps) => {
  const apiBreadcrumbs = buildBreadcrumbsFromPath(page);
  const breadcrumbs = providedBreadcrumbs ?? apiBreadcrumbs ?? await getBreadcrumbs(page);
  const childPages = page.children?.filter(isChildPage) || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <Breadcrumbs items={breadcrumbs} />
      <PageHeader page={page} />
      {page.content && (
        <MarkdownHtmlContent 
          content={page.content} 
          className="mb-8"
        />
      )}
      <ChildPagesSection title={page.title} pages={childPages} />
    </div>
  );
};

export default PageContent;
