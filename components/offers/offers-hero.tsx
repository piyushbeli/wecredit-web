/**
 * OffersHero Component
 * 
 * Hero section for the offers page displaying eligibility message
 * Shows congratulations and maximum loan amount user is eligible for
 */

interface OffersHeroProps {
  /** Maximum eligible loan amount (formatted string) */
  eligibleAmount: string;
  /** Optional count of available offers */
  offerCount?: number;
}

/**
 * Hero section with eligibility message
 */
export const OffersHero = ({ eligibleAmount, offerCount }: OffersHeroProps) => {
  return (
    <div className="bg-white px-4 pt-6 pb-2">
      <div className="">
        {/* <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Offers for you
        </h2> */}
        <p className="text-base text-brand-primary font-medium">
          Congratulations! You are eligible for a loan of upto {eligibleAmount}
        </p>
      </div>
    </div>
  );
};
