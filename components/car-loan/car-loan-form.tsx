'use client';

import Image from 'next/image';
import { ArrowLeft, CalendarDays, Coins, Zap } from 'lucide-react';
import { ActionButton } from '@/components/shared';
import CarLoanFields from './car-loan-fields';
import { useCarLoanForm } from './use-car-loan-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import CarLoanMobileFeatureCarousel from './car-loan-mobile-feature-carousel';

interface CarLoanFormProps {
  onClose?: () => void;
  /** When true, form is embedded in modal; root uses flex-1 min-h-0 and back calls onClose */
  isModal?: boolean;
  /** Called when the API submit succeeds so the parent can show success state. */
  onSuccess?: () => void;
}

const CarLoanForm = ({
  onClose,
  isModal = false,
  onSuccess,
}: CarLoanFormProps): React.ReactNode => {
  const {
    formValues,
    formErrors,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    getValidatedPayload,
    isSubmitting,
    canSubmit,
  } = useCarLoanForm({ onSuccess });
  const router = useRouter();
  const { isAuthenticated, openAuthModalWithPhoneAndAction } = useAuth();

  const handleHeaderBackClick = (): void => {
    if (onClose) {
      onClose();
    } else {
      router.push('/');
    }
  };

  const onFormSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!isAuthenticated) {
      const payload = getValidatedPayload();
      // Validation errors are already surfaced by the hook; avoid opening OTP if invalid.
      if (!payload) return;
      // User has already entered phone in the form; use it for OTP and skip
      // the login bottom sheet (phone input screen). Payload is stored for post-login submit.
      void openAuthModalWithPhoneAndAction(payload.mobile, {
        type: 'submit_car_loan',
        carLoanPayload: payload,
      });
      return;
    }
    handleSubmit();
  };

  const rootClassName = isModal
    ? 'flex flex-col flex-1 min-h-0 bg-white'
    : 'bg-white h-screen flex flex-col';

  return (
    <div className={rootClassName}>
      <div className="hidden h-14 shrink-0 items-center bg-white px-8 md:flex">
        <div className="text-xl font-semibold tracking-tight text-gray-800">
          <span className="bg-blue-600 px-0.5 text-white">We</span>Credit
        </div>
      </div>

      <form onSubmit={onFormSubmit} className="flex w-full flex-1 min-h-0 flex-col overflow-x-hidden overflow-y-auto md:grid md:grid-cols-[43%_57%] md:gap-0 md:overflow-y-hidden">
        <section className="relative box-border flex w-full max-w-full min-w-0 flex-none flex-col items-stretch justify-start overflow-hidden bg-gradient-to-b from-blue-600 via-blue-400 to-blue-50 px-3 pb-0 pt-3 text-white sm:px-5 md:px-10 md:pb-10 md:pt-8 lg:px-16">
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden text-white/25 [mask-image:linear-gradient(to_bottom,black_0%,black_56%,transparent_88%)]"
            aria-hidden="true"
          >
            <div className="absolute -inset-x-[20%] -top-[8%] h-[72%] origin-top -skew-y-6 [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:38px_38px] sm:[background-size:52px_52px] md:[background-size:64px_64px]" />
          </div>

          <div className="relative z-10 flex w-full min-w-0 items-center justify-center md:justify-start md:gap-3">
            <button
              type="button"
              onClick={handleHeaderBackClick}
              className="absolute left-0 shrink-0 rounded-full p-1 text-white transition-colors hover:bg-white/10 md:static md:-ml-1"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="min-w-0 text-lg font-semibold md:text-xl">Car Loan</h1>
          </div>

          <div className="relative z-10 mt-5 flex w-full max-w-full justify-center overflow-hidden md:mt-24">
            <Image
              src="/assets/images/car-loan-hero.svg"
              alt="White sedan car"
              width={681}
              height={224}
              priority
              className="mx-auto h-auto w-full max-w-full object-contain drop-shadow-xl"
            />
          </div>

          <div className="relative z-10 mt-10 hidden w-full max-w-full text-gray-950 md:block">
            <h2 className="w-full max-w-md text-xl font-semibold leading-snug md:text-2xl md:leading-tight">
              Drive home your dream car this month
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-gray-700 md:mt-2">
              Rates from 8.75% p.a., tenures up to 7 years, and approval in minutes — all online.
            </p>
          </div>

          <div className="relative z-10 mt-1 w-full max-w-full min-w-0 space-y-3 text-gray-950 md:mt-5 md:space-y-3">
            <CarLoanMobileFeatureCarousel />
            <div className="hidden w-full max-w-full min-w-0 items-center gap-4 rounded-md border border-white bg-white/30 px-5 py-4 shadow-sm backdrop-blur-sm md:flex">
              <Zap className="h-6 w-6 shrink-0 fill-blue-700 text-blue-700 sm:h-7 sm:w-7" />
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="text-sm font-medium">Fast Approval</p>
                <p className="text-xs text-gray-700">Get your loan approved in minutes</p>
              </div>
            </div>
            <div className="hidden items-center gap-4 rounded-md border border-white bg-white/30 px-5 py-4 shadow-sm backdrop-blur-sm md:flex">
              <Coins className="h-7 w-7 shrink-0 text-blue-700" />
              <div>
                <p className="text-sm font-medium">High Loan Amount</p>
                <p className="text-xs text-gray-700">Up to ₹50 Lakhs based on eligibility</p>
              </div>
            </div>
            <div className="hidden items-center gap-4 rounded-md border border-white bg-white/30 px-5 py-4 shadow-sm backdrop-blur-sm md:flex">
              <CalendarDays className="h-7 w-7 shrink-0 text-blue-700" />
              <div>
                <p className="text-sm font-medium">Easy EMIs</p>
                <p className="text-xs text-gray-700">Flexible repayment options</p>
              </div>
            </div>
          </div>

        </section>

        <section className="flex min-h-0 min-w-0 w-full flex-none flex-col bg-white md:w-auto md:flex-1">
          <div className="flex-1 overflow-visible px-4 pb-6 pt-4 sm:px-5 sm:pt-5 md:overflow-y-auto md:px-8 md:py-5 lg:px-12">
            <div className="mx-auto w-full max-w-3xl">
              <h2 className="mb-4 text-base font-medium text-gray-900 md:mb-5">Start Your financial journey</h2>
              <div className="space-y-4 md:space-y-5">
                <CarLoanFields
                  formValues={formValues}
                  formErrors={formErrors}
                  handleFieldChange={handleFieldChange}
                  handleFieldBlur={handleFieldBlur}
                />
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 shrink-0 border-t bg-white p-4 md:static md:px-8 lg:px-12">
            <div className="mx-auto w-full max-w-3xl">
              <ActionButton
                type="submit"
                disabled={!canSubmit}
                isLoading={isSubmitting}
                fullWidth
                className="h-12 rounded-lg text-base"
              >
                Submit
              </ActionButton>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
};

export default CarLoanForm;
