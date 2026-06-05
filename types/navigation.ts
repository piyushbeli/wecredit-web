export interface NavigationLink {
  id: number;
  label: string;
  url: string;
  openInNewTab: boolean;
  children: NavigationLink[];
}
