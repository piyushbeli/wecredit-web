/**
 * Why WeCredit section — 2x2 grid of solid blue benefit cards.
 */

import { JSX } from 'react';
import { WHY_WECREDIT_BENEFITS, type WhyWeCreditBenefit } from './constants';

interface BenefitCardProps {
  benefit: WhyWeCreditBenefit;
}

const BenefitCard = ({ benefit }: BenefitCardProps): JSX.Element => {
  const Icon = benefit.icon;

  return (
    <div className="bg-brand-light-to rounded-xl p-4 flex flex-col gap-2 min-h-[100px]">
      <Icon className="w-5 h-5 text-white shrink-0" aria-hidden />
      <p className="text-sm font-medium text-white">{benefit.title}</p>
      <p className="text-sm text-white/80 leading-4">{benefit.description}</p>
    </div>
  );
};

const WhyWeCreditSection = (): JSX.Element => {
  return (
    <section className="py-8 px-4 bg-brand-lightest">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">
          Why WeCredit?
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {WHY_WECREDIT_BENEFITS.map((benefit) => (
            <BenefitCard key={benefit.id} benefit={benefit} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyWeCreditSection;
