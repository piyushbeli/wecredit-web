import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ComingSoonCardProps = {
  /** Main heading inside the card (default: "Coming Soon") */
  title?: string;
  /** Optional supporting copy below the title */
  description?: string;
  /** Extra classes on the outer flex wrapper (layout, margins) */
  className?: string;
  /** Extra classes on the bordered Card shell */
  cardClassName?: string;
};

/**
 * Standard centered placeholder card for features or listings that are not live yet.
 * Reuse anywhere you need a consistent “Coming Soon” treatment.
 */
export const ComingSoonCard = ({
  title = 'Coming Soon',
  description,
  className,
  cardClassName,
}: ComingSoonCardProps) => (
  <div className={cn('flex w-full justify-center', className)}>
    <Card className={cn('w-full max-w-md text-center shadow-sm', cardClassName)}>
      <CardHeader className="items-center space-y-2">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription className="text-center">{description}</CardDescription> : null}
      </CardHeader>
    </Card>
  </div>
);
