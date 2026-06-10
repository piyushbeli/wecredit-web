/**
 * Loan Repayment Terms section with static informational content.
 */

import { JSX } from 'react';
import { REPAYMENT_TERMS } from './constants';

const RepaymentTermsSection = (): JSX.Element => {
  const { title, repaymentPeriod, interestRates, representativeExample } = REPAYMENT_TERMS;

  return (
    <section className="px-4 pb-6 bg-white">
      <div className="max-w-xl mx-auto">
        <h2 className="ipl-heading">
          {title}
        </h2>

        <div className="space-y-5">
          <div>
            <p className="text-sm mb-1">
            <span className="text-gray-800 font-medium">{repaymentPeriod.label}: </span>
            <span className="text-gray-500">{repaymentPeriod.value}</span>
            </p>
          </div>

          <div>
            <p className="text-sm mb-1">
            <span className="text-gray-800 font-medium">{interestRates.label}: </span>
            <span className="text-gray-500">{interestRates.value}</span>
            </p>
          </div>

          <div>
            <p className="text-sm mb-1">
            <span className="text-gray-800 font-medium">{representativeExample.label}: </span>
            <span className="text-gray-500">{representativeExample.value}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RepaymentTermsSection;
