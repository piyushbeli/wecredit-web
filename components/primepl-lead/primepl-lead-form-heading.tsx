'use client';

import { useId } from 'react';
import { FileText, ShieldCheck, TrendingDown, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** One pill in the 2×2 feature grid (icon + uppercase label). */
export interface PrimeplLeadFormHeadingFeature {
  icon: LucideIcon;
  label: string;
}

export interface PrimeplLeadFormHeadingProps {
  className?: string;
  title?: string;
  subtitle?: string;
  /** Defaults to the four Primepl promo badges; pass a custom list to reuse this block elsewhere. */
  features?: PrimeplLeadFormHeadingFeature[];
}

const DEFAULT_TITLE = 'Quick & Easy Personal Loan Application Upto 70 Lacs';

const DEFAULT_SUBTITLE = 'Interest rate starting from 9.9%.';

const DEFAULT_FEATURES: PrimeplLeadFormHeadingFeature[] = [
  { icon: Zap, label: 'INSTANT APPROVAL' },
  { icon: FileText, label: 'MINIMAL DOCS' },
  { icon: ShieldCheck, label: 'SECURE PROCESS' },
  { icon: TrendingDown, label: 'LOW INTEREST' },
];

export const PrimeplLeadFormHeading = ({
  className = '',
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  features = DEFAULT_FEATURES,
}: PrimeplLeadFormHeadingProps): React.ReactNode => {
  const headingId = useId();

  return (
    <section className={className} aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="text-3xl font-semibold tracking-tight leading-tight text-wc-blue-heading sm:text-xl"
      >
        {title}
      </h2>
      <p className="mt-2 text-sm text-gray-500 brand-primary">{subtitle}</p>

      <ul className="mt-4 grid list-none grid-cols-2 gap-2 p-0 sm:gap-3">
        {features.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex min-h-11 items-center gap-2 rounded-full bg-gray-50 px-3 py-2 text-xs uppercase tracking-wide text-blue-primary sm:text-xs"
          >
            <Icon className="h-4 w-4 shrink-0 text-brand-primary" aria-hidden />
            <span className="leading-tight">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
