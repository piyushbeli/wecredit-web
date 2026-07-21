'use client';

import Image from 'next/image';
import { ArrowLeft, Check, LockKeyhole } from 'lucide-react';
import { ActionButton } from '@/components/shared';
import { IMAGES } from '@/lib/constants/images';
import EligibilityCheckFields from './eligibility-check-fields';
import { useEligibilityCheckForm } from './use-eligibility-check-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import type { EligibilityCheckFormValues } from './eligibility-check-form.config';

const CREDIT_SCORE_BENEFITS = [
  '100% Free, always',
  "Won't affect your score",
  'Instant, secure results',
] as const;

interface EligibilityCheckFormProps {
  onClose?: () => void;
  /** When true, form is embedded in modal; root uses flex-1 min-h-0 and back calls onClose */
  isModal?: boolean;
  /** Called after validation to open the bureau processing screen. */
  onProcessing?: () => void;
  initialValues?: EligibilityCheckFormValues | null;
}

const EligibilityCheckForm = ({
  onClose,
  isModal = false,
  initialValues,
  onProcessing,
}: EligibilityCheckFormProps): React.ReactNode => {
  const {
    formValues,
    formErrors,
    handleFieldChange,
    handleSubmit,
    isSubmitting,
    canSubmit,
  } = useEligibilityCheckForm({ initialValues, onProcessing });
  const router = useRouter();
  const { isAuthenticated, openAuthModalWithPhone } = useAuth();

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
      // Use the eligibility form's phone number for OTP and skip the
      // separate login phone bottom sheet.
      void openAuthModalWithPhone(formValues.phoneNumber);
      return;
    }
    handleSubmit();
  };

  const rootClassName = isModal
    ? 'min-h-0 flex-1 overflow-y-auto bg-white lg:bg-[#F4F7FB]'
    : 'min-h-screen overflow-y-auto bg-white lg:bg-[#F4F7FB]';

  return (
    <div className={rootClassName}>
      <header className="bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <Image
            src={IMAGES.LOGOS.TRANSPARENT}
            alt="WeCredit"
            width={130}
            height={30}
            className="hidden h-7 w-auto object-contain sm:block"
            priority
          />
          <button
            type="button"
            onClick={handleHeaderBackClick}
            className="inline-flex cursor-pointer items-center gap-3 rounded-lg py-2 text-base font-medium text-gray-700 transition-colors hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary sm:px-3 sm:text-sm sm:text-gray-600 sm:hover:bg-gray-100"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="sm:hidden">Credit Score</span>
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>
      </header>

      <main className="px-5 py-6 sm:px-8 sm:py-8 lg:px-8 lg:py-10">
        <form
          onSubmit={onFormSubmit}
          className="mx-auto grid w-full max-w-5xl bg-transparent lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.45fr)] lg:overflow-hidden lg:rounded-3xl lg:bg-white lg:shadow-[0_18px_55px_rgba(15,23,42,0.12)]"
        >
          <aside className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1670E7] to-[#0757C9] px-6 py-7 text-white lg:rounded-none lg:px-12 lg:py-14">
            <div
              className="pointer-events-none absolute -right-16 -top-14 hidden h-44 w-44 rounded-full bg-white/10 lg:block"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-16 hidden h-52 w-52 rounded-full bg-white/[0.06] lg:block"
              aria-hidden
            />
            <div className="relative flex h-full flex-col">
              <div>
                <h1 className="max-w-xs text-2xl font-bold leading-tight tracking-tight lg:text-[34px]">
                  Check your Credit Score
                </h1>
                <p className="mt-2 text-sm font-medium text-white/90 lg:hidden">
                  Free · Instant · Won&apos;t affect your score
                </p>
                <p className="mt-4 hidden max-w-sm text-base leading-6 text-white/85 lg:block">
                  Get your EQUIFAX score and full credit report securely in under a minute.
                </p>
                <ul className="mt-8 hidden space-y-4 lg:block">
                  {CREDIT_SCORE_BENEFITS.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-sm text-white/95">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                        <Check className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-wide text-white/75 lg:mt-auto lg:pt-12 lg:text-xs lg:normal-case lg:tracking-normal">
                <LockKeyhole className="h-4 w-4 shrink-0" aria-hidden />
                256-bit encrypted · Powered by EQUIFAX
              </p>
            </div>
          </aside>

          <section className="min-w-0 py-8 lg:px-10 lg:py-10">
            <div className="mb-7 hidden lg:block">
              <h2 className="text-2xl font-bold tracking-tight text-[#172033]">Tell us about you</h2>
              <p className="mt-1 text-sm text-gray-500">
                Enter your details to check your credit score.
              </p>
            </div>

            <div className="space-y-5">
              <EligibilityCheckFields
                formValues={formValues}
                formErrors={formErrors}
                handleFieldChange={handleFieldChange}
              />
            </div>

            <div className="mt-7">
              <ActionButton
                type="submit"
                disabled={!canSubmit}
                isLoading={isSubmitting}
                fullWidth
                className="h-13 rounded-xl bg-[#0D5FD8] text-base shadow-[0_8px_20px_rgba(13,95,216,0.22)] hover:bg-[#0B54C2]"
              >
                Submit
              </ActionButton>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
};

export default EligibilityCheckForm;
