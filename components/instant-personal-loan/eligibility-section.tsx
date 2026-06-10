/**
 * Eligibility Criteria section for the Instant Personal Loan page.
 * Card layout with per-item icons — aligned to Figma PL landing design.
 */

import { JSX } from 'react';
import Image from 'next/image';
import { BarChart3, Briefcase } from 'lucide-react';
import { IMAGES } from '@/lib/constants/images';
import {
  ELIGIBILITY_CRITERIA,
  ELIGIBILITY_SECTION_DESCRIPTION,
  ELIGIBILITY_SECTION_TITLE,
  type EligibilityIconKey,
  type EligibilityItem,
} from './constants';

/** Renders the criterion-specific icon inside the light-blue square */
const EligibilityIcon = ({ iconKey }: { iconKey: EligibilityIconKey }): JSX.Element => {
  const iconClassName = 'w-5 h-5 text-blue-primary';

  if (iconKey === 'age') {
    return (
      <Image
        src={IMAGES.ICONS.HOURGLASS}
        alt=""
        width={20}
        height={20}
        className="w-5 h-5 object-contain"
        aria-hidden
      />
    );
  }

  if (iconKey === 'employment') {
    return <Briefcase className={iconClassName} aria-hidden />;
  }

  if (iconKey === 'credit-score') {
    return (
      <Image
        src={IMAGES.ICONS.CREDIT_CARD}
        alt=""
        width={20}
        height={20}
        className="w-5 h-5 object-contain"
        aria-hidden
      />
    );
  }

  if (iconKey === 'salary') {
    return (
      <Image
        src={IMAGES.ICONS.WALLET}
        alt=""
        width={20}
        height={20}
        className="w-5 h-5 object-contain"
        aria-hidden
      />
    );
  }

  return <BarChart3 className={iconClassName} aria-hidden />;
};

interface EligibilityCardProps {
  item: EligibilityItem;
}

const EligibilityCard = ({ item }: EligibilityCardProps): JSX.Element => {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl ipl-card-shadow">
      <div className="w-10 h-10 bg-wc-blue-50 rounded-lg flex items-center justify-center shrink-0">
        <EligibilityIcon iconKey={item.icon} />
      </div>

      <p className="flex-1 min-w-0 text-sm leading-5">
        <span className="font-semibold text-gray-800">{item.title} </span>
        <span className="font-normal text-gray-500">{item.requirement}</span>
      </p>
    </div>
  );
};

const EligibilitySection = (): JSX.Element => {
  return (
    <section className="pt-8 pb-8 px-4 bg-white">
      <div className="max-w-xl mx-auto">
        <h2 className="ipl-heading">{ELIGIBILITY_SECTION_TITLE}</h2>
        <p className="text-sm text-gray-500 mb-6 leading-5">
          {ELIGIBILITY_SECTION_DESCRIPTION}
        </p>

        <div className="space-y-3 pb-1">
          {ELIGIBILITY_CRITERIA.map((item) => (
            <EligibilityCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EligibilitySection;
