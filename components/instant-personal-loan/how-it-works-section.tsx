/**
 * How It Works section with a numbered vertical stepper.
 */

import { JSX } from 'react';
import { HOW_IT_WORKS_STEPS, type HowItWorksStep } from './constants';

interface StepRowProps {
  step: HowItWorksStep;
  isLast: boolean;
}

const StepRow = ({ step, isLast }: StepRowProps): JSX.Element => {
  return (
    <div className="flex items-stretch gap-4">
      <div className="flex flex-col items-center shrink-0 w-7">
        <div className="w-7 h-10 rounded-lg border-2 border-brand-primary text-brand-primary flex items-center justify-center text-sm font-semibold shrink-0">
          {step.number}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-brand-primary/30 mt-1" />}
      </div>

      <div className="flex-1 pb-6 pt-1">
        <p className="text-sm font-medium text-brand-primary">{step.title}</p>
        <p className="text-sm text-gray-500 leading-5 mt-0.5">{step.description}</p>
      </div>
    </div>
  );
};

const HowItWorksSection = (): JSX.Element => {
  const lastStepIndex = HOW_IT_WORKS_STEPS.length - 1;

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-xl mx-auto">
        <h2 className="text-base font-semibold text-center text-gray-900 mb-6">
          How It Works
        </h2>

        <div>
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <StepRow
              key={step.id}
              step={step}
              isLast={index === lastStepIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
