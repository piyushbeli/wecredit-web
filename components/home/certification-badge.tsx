/**
 * Certification badge component
 * Displays a single certification logo with placeholder support
 */
import Image from 'next/image';
import { cn } from '@/lib/utils';

const CertificationBadge = ({
  src,
  alt,
  width = 180,
  height = 180,
  className,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}): React.ReactNode => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn('object-contain', className)}
        />
      </div>
    </div>
  );
};

export default CertificationBadge;
