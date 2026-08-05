import { cn } from '@/lib/utils';
import type { PageHeadingProps } from './page-heading.types';

const PageHeading = ({ children, className }: PageHeadingProps): React.ReactNode => {
  return <h1 className={cn(className)}>{children}</h1>;
};

export default PageHeading;
