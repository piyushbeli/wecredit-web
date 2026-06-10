/**
 * Stats wrapper for the Instant Personal Loan page.
 * Reuses the home page stats component for consistent metrics display.
 */

import { JSX } from 'react';
import StatsSection from '@/components/home/stats-section';

const InstantLoanStatsSection = (): JSX.Element => {
  return (
    <section className="py-4 bg-white">
      <div className="max-w-xl mx-auto">
        <StatsSection />
      </div>
    </section>
  );
};

export default InstantLoanStatsSection;
