import type { NavigationLink } from '@/types/navigation';

export const SITE_NAME = 'WeCredit';

export const HEADER_LINKS: NavigationLink[] = [
  { id: 1, label: 'Home', url: '/', openInNewTab: false, children: [] },
  { id: 2, label: 'Blogs', url: '/blogs', openInNewTab: false, children: [] },
  { id: 3, label: 'About Us', url: '/about-us/', openInNewTab: false, children: [] },
];
