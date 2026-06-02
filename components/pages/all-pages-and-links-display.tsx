import Link from 'next/link';
import Image from 'next/image';
import type { Page, Header, Footer, RelatedLinksWidget } from '@/types/strapi';
import { getStrapiMediaUrl } from '@/lib/api/cms-client';

/** Props for AllPagesAndLinksDisplay component */
interface AllPagesAndLinksDisplayProps {
  pages: Page[];
  header: Header;
  footer: Footer;
}

/**
 * Displays configured site routes and navigation links (marketing + blog sheet).
 */
const AllPagesAndLinksDisplay = ({ pages, header, footer }: AllPagesAndLinksDisplayProps) => {
  const totalPages = pages.length;
  const totalSidebarLinks = countTotalSidebarLinks(pages);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Complete Pages & Links Overview</h1>
        <p className="text-blue-100 text-lg">
          Showing all {totalPages} configured routes with their navigation links
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Pages" count={totalPages} color="blue" />
        <StatCard label="Header Links" count={header.navigation.length} color="green" />
        <StatCard label="Sidebar Links" count={totalSidebarLinks} color="purple" />
        <StatCard label="Footer Columns" count={footer.columns.length} color="orange" />
        <StatCard label="Social Links" count={footer.socialLinks?.length || 0} color="pink" />
      </div>

      {/* Header Navigation Links */}
      <NavigationSection
        title="Header Navigation Links"
        icon="🔵"
        color="blue"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {header.navigation.map((link) => (
            <LinkCard
              key={link.id}
              label={link.label}
              url={link.url}
              isExternal={link.openInNewTab}
              color="blue"
            />
          ))}
        </div>
        {header.ctaButton && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">CTA Button</h3>
            <LinkCard
              label={header.ctaButton.label}
              url={header.ctaButton.url}
              isExternal={false}
              color="blue"
              variant="cta"
            />
          </div>
        )}
      </NavigationSection>

      {/* All Pages */}
      <NavigationSection
        title={`All Pages (${totalPages} total)`}
        icon="📄"
        color="green"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <PageCard key={page.documentId} page={page} />
          ))}
        </div>
      </NavigationSection>

      {/* Pages with Sidebar Links */}
      {pages.filter(p => hasSidebarLinks(p)).length > 0 && (
        <NavigationSection
          title="Pages with Sidebar Links"
          icon="🟣"
          color="purple"
        >
          <div className="space-y-4">
            {pages
              .filter(p => hasSidebarLinks(p))
              .map((page) => (
                <PageSidebarLinksCard key={page.documentId} page={page} />
              ))}
          </div>
        </NavigationSection>
      )}

      {/* Pages with Children (Hierarchical Structure) */}
      {pages.filter(p => p.children && p.children.length > 0).length > 0 && (
        <NavigationSection
          title="Page Hierarchy (Parent-Child Relationships)"
          icon="🌳"
          color="indigo"
        >
          <div className="space-y-4">
            {pages
              .filter(p => p.children && p.children.length > 0)
              .map((page) => (
                <PageHierarchyCard key={page.documentId} page={page} />
              ))}
          </div>
        </NavigationSection>
      )}

      {/* Footer Navigation */}
      <NavigationSection
        title="Footer Navigation"
        icon="🟠"
        color="orange"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {footer.columns.map((column) => (
            <div key={column.id} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="font-bold text-gray-900 mb-3">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.id}>
                    <LinkCard
                      label={link.label}
                      url={link.url}
                      isExternal={link.isExternal}
                      color="orange"
                      compact
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </NavigationSection>

      {/* Social Links */}
      {footer.socialLinks && footer.socialLinks.length > 0 && (
        <NavigationSection
          title="Social Media Links"
          icon="🌸"
          color="pink"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {footer.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 bg-pink-50 hover:bg-pink-100 rounded-lg border border-pink-200 hover:border-pink-400 transition-all"
              >
                <span className="text-2xl">{getSocialIcon(link.platform)}</span>
                <span className="font-medium text-gray-900 capitalize text-sm">
                  {link.platform}
                </span>
              </a>
            ))}
          </div>
        </NavigationSection>
      )}

      {/* API Response Summary */}
      <NavigationSection
        title="API Data Summary"
        icon="📊"
        color="gray"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Pages API Data</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• <strong>Total Pages:</strong> {totalPages}</li>
              <li>• <strong>Pages with Children:</strong> {pages.filter(p => p.children && p.children.length > 0).length}</li>
              <li>• <strong>Pages with Sidebar:</strong> {pages.filter(p => hasSidebarLinks(p)).length}</li>
              <li>• <strong>Pages with Images:</strong> {pages.filter(p => p.featuredImage).length}</li>
            </ul>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Navigation API Data</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• <strong>Header Links:</strong> {header.navigation.length}</li>
              <li>• <strong>Has CTA Button:</strong> {header.ctaButton ? 'Yes' : 'No'}</li>
              <li>• <strong>Footer Columns:</strong> {footer.columns.length}</li>
              <li>• <strong>Total Footer Links:</strong> {footer.columns.reduce((sum, col) => sum + col.links.length, 0)}</li>
              <li>• <strong>Social Links:</strong> {footer.socialLinks?.length || 0}</li>
            </ul>
          </div>
        </div>
      </NavigationSection>
    </div>
  );
};

/** Navigation Section Wrapper */
interface NavigationSectionProps {
  title: string;
  icon: string;
  color: string;
  children: React.ReactNode;
}

const NavigationSection = ({ title, icon, color, children }: NavigationSectionProps) => {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    purple: 'border-purple-200 bg-purple-50',
    orange: 'border-orange-200 bg-orange-50',
    pink: 'border-pink-200 bg-pink-50',
    indigo: 'border-indigo-200 bg-indigo-50',
    gray: 'border-gray-200 bg-gray-50',
  };

  return (
    <div className={`rounded-lg shadow-md border ${colorClasses[color as keyof typeof colorClasses] || colorClasses.gray}`}>
      <div className="p-6 border-b border-gray-200 bg-white rounded-t-lg">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-3xl">{icon}</span>
          {title}
        </h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

/** Page Card Component */
interface PageCardProps {
  page: Page;
}

const PageCard = ({ page }: PageCardProps) => {
  return (
    <Link
      href={page.fullPath}
      className="block p-4 bg-white hover:bg-green-100 rounded-lg border border-green-300 hover:border-green-500 transition-all group"
    >
      {page.featuredImage && (
        <div className="relative w-full h-32 mb-3 rounded overflow-hidden">
          <Image
            src={getStrapiMediaUrl(page.featuredImage.url)}
            alt={page.featuredImage.alternativeText || page.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-bold text-gray-900 group-hover:text-green-700 flex-1">
          {page.title}
        </h4>
        <svg className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <p className="text-sm text-gray-600 mb-2 truncate">{page.fullPath}</p>
      <div className="flex flex-wrap gap-2">
        {page.children && page.children.length > 0 && (
          <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded">
            {page.children.length} children
          </span>
        )}
        {hasSidebarLinks(page) && (
          <span className="text-xs px-2 py-1 bg-purple-200 text-purple-800 rounded">
            Has links
          </span>
        )}
      </div>
    </Link>
  );
};

/** Page Sidebar Links Card */
interface PageSidebarLinksCardProps {
  page: Page;
}

const PageSidebarLinksCard = ({ page }: PageSidebarLinksCardProps) => {
  const sidebarLinks = extractSidebarLinks(page);

  return (
    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Link href={page.fullPath} className="font-bold text-gray-900 hover:text-purple-700">
            {page.title}
          </Link>
          <p className="text-sm text-gray-600">{page.fullPath}</p>
        </div>
      </div>
      <div className="space-y-3">
        {sidebarLinks.map((widget, index) => (
          <div key={`widget-${index}`} className="pl-4 border-l-2 border-purple-300">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">{widget.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {widget.links.map((link) => (
                <LinkCard
                  key={link.id}
                  label={link.label}
                  url={link.url}
                  isExternal={link.openInNewTab}
                  color="purple"
                  compact
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Page Hierarchy Card */
interface PageHierarchyCardProps {
  page: Page;
}

const PageHierarchyCard = ({ page }: PageHierarchyCardProps) => {
  return (
    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1">
          <Link href={page.fullPath} className="font-bold text-gray-900 hover:text-indigo-700 text-lg">
            {page.title}
          </Link>
          <p className="text-sm text-gray-600">{page.fullPath}</p>
          <span className="text-xs px-2 py-1 bg-indigo-200 text-indigo-800 rounded inline-block mt-1">
            {page.children?.length} child pages
          </span>
        </div>
      </div>
      <div className="pl-6 border-l-4 border-indigo-300 space-y-2">
        {page.children?.map((child) => (
          <div key={child.documentId} className="flex items-center gap-2 p-2 bg-white rounded border border-indigo-100">
            <svg className="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href={child.fullPath} className="text-sm text-gray-900 hover:text-indigo-700 flex-1">
              {child.title}
            </Link>
            <span className="text-xs text-gray-500">{child.slug}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Link Card Component */
interface LinkCardProps {
  label: string;
  url: string;
  isExternal: boolean;
  color: string;
  variant?: 'default' | 'cta';
  compact?: boolean;
}

const LinkCard = ({ label, url, isExternal, color, variant = 'default', compact = false }: LinkCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-400 text-blue-600',
    green: 'bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-400 text-green-600',
    purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200 hover:border-purple-400 text-purple-600',
    orange: 'bg-orange-50 hover:bg-orange-100 border-orange-200 hover:border-orange-400 text-orange-600',
    pink: 'bg-pink-50 hover:bg-pink-100 border-pink-200 hover:border-pink-400 text-pink-600',
  };

  const baseClasses = compact
    ? `hover:underline text-sm ${colorClasses[color as keyof typeof colorClasses]}`
    : `flex items-center justify-between gap-2 p-3 rounded-lg border transition-all ${
        variant === 'cta'
          ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700'
          : colorClasses[color as keyof typeof colorClasses] || colorClasses.blue
      }`;

  const content = (
    <>
      <span className={`font-medium ${compact ? '' : variant === 'cta' ? 'text-white' : 'text-gray-900'}`}>
        {label}
      </span>
      {!compact && (
        <span className={`text-xs ${variant === 'cta' ? 'text-blue-100' : 'text-gray-500'} truncate max-w-[150px]`}>
          {url}
        </span>
      )}
    </>
  );

  if (isExternal) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <Link href={url} className={baseClasses}>
      {content}
    </Link>
  );
};

/** Stat Card Component */
interface StatCardProps {
  label: string;
  count: number;
  color: string;
}

const StatCard = ({ label, count, color }: StatCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800',
    pink: 'bg-pink-100 text-pink-800',
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow">
      <div className={`text-3xl font-bold mb-1 ${colorClasses[color as keyof typeof colorClasses]?.split(' ')[1]}`}>
        {count}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

/** Helper Functions */

function hasSidebarLinks(page: Page): boolean {
  if (!page.sidebar || page.sidebar.length === 0) return false;
  return page.sidebar.some(
    widget => widget.__component === 'widgets.related-links' && widget.links?.length > 0
  );
}

function extractSidebarLinks(page: Page): Array<{ title: string; links: Array<{ id: number; label: string; url: string; openInNewTab: boolean }> }> {
  if (!page.sidebar || page.sidebar.length === 0) return [];
  
  return page.sidebar
    .filter((widget): widget is RelatedLinksWidget => 
      widget.__component === 'widgets.related-links' && widget.links.length > 0
    )
    .map(widget => ({
      title: widget.title,
      links: widget.links,
    }));
}

function countTotalSidebarLinks(pages: Page[]): number {
  return pages.reduce((total, page) => {
    if (!page.sidebar) return total;
    const relatedLinksWidgets = page.sidebar.filter(
      (widget): widget is RelatedLinksWidget => widget.__component === 'widgets.related-links'
    );
    return total + relatedLinksWidgets.reduce((sum, widget) => sum + widget.links?.length || 0, 0);
  }, 0);
}

function getSocialIcon(platform: string): string {
  const icons: Record<string, string> = {
    twitter: '𝕏',
    facebook: '👤',
    linkedin: '💼',
    instagram: '📷',
    youtube: '▶️',
    github: '💻',
  };
  return icons[platform.toLowerCase()] || '🔗';
}

export default AllPagesAndLinksDisplay;



