/**
 * Certification badge component
 * Displays a single certification logo with placeholder support
 */
import Image from 'next/image';

const CertificationBadge = ({
    src,
    alt,
    width = 180,
    height = 180,
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }): React.ReactNode => {
    return (
      <div className="flex items-center justify-center">
        <div className="relative">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="object-contain"
            priority={false}
          />
        </div>
      </div>
    );
  };

export default CertificationBadge;