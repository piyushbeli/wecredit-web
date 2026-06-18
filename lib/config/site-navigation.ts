import type { NavigationLink } from '@/types/navigation';

export const SITE_NAME = 'WeCredit';

export const LOAN_STATUS_LINK: NavigationLink = {
  id: 2,
  label: 'Loan Status',
  url: '/offers',
  openInNewTab: false,
  children: [],
};

export const HEADER_LINKS: NavigationLink[] = [
  { id: 1, label: 'Home', url: '/', openInNewTab: false, children: [] },
  { id: 3, label: 'Blogs', url: '/blog', openInNewTab: false, children: [] },
  { id: 4, label: 'About Us', url: '/about-us/', openInNewTab: false, children: [] },
];

export function getVisibleHeaderLinks(isAuthenticated: boolean): NavigationLink[] {
  if (!isAuthenticated) return HEADER_LINKS;

  const [home, ...rest] = HEADER_LINKS;
  return [home, LOAN_STATUS_LINK, ...rest];
}
