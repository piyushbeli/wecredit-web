import Link from 'next/link';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';

interface ProductCardProps {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  imagePath?: string;
}

const ProductCard = ({ label, href, icon: Icon, imagePath }: ProductCardProps): React.ReactNode => {
  return (
    <div
      className="h-full"
    >
      <Link
        href={href}
        className="wc-product-card flex flex-col items-center justify-center gap-3 p-4 h-full rounded-xl md:border md:border-gray-100 bg-white hover:border-gray-200 transition-colors"
      >
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-wc-blue-50 flex items-center justify-center"
        >
          {imagePath ? (
            <Image
              src={imagePath}
              alt={label}
              width={32}
              height={32}
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
            />
          ) : Icon ? (
            <Icon className="w-7 h-7 text-wc-blue-600" strokeWidth={2} />
          ) : null}
        </div>

        <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
          {label}
        </span>
      </Link>
    </div>
  );
};

export default ProductCard;
