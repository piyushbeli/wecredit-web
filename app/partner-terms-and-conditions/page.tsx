import type { Metadata } from 'next';
import PageBanner from '@/components/shared/page-banner';
import { BackToHomeButton } from '@/components/shared/back-to-home-button';
import { IMAGES } from '@/lib/constants/images';
import Link from 'next/link';
import type { JSX } from 'react';

export const dynamic = 'force-static';
export const revalidate = 1800; // 30 minutes

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Partner Terms & Conditions | WeCredit',
    description: 'Read and understand partner terms and conditions for WeCredit lending partners.',
    keywords: 'partner terms, terms and conditions, WeCredit',
  };
}

type PartnerCardProps = {
  id: string;
  partnerName: string;
  logoSrc?: string;
  consentContent: Array<
    | { type: 'text'; value: string }
    | { type: 'link'; text: string; url: string; addTrailingSpace?: boolean }
  >;
  officialLinkText?: string;
  officialLinkUrl?: string;
};

const partners: PartnerCardProps[] = [
  {
    id: 'unity',
    partnerName: 'Unity Small Finance Bank',
    logoSrc: '/assets/images/image%201281.png',
    consentContent: [
      {
        type: 'text',
        value:
          'I hereby give my consent to Unity Small Finance Bank limited. as lender to collect, store, and verify my credit report from Credit Bureaus and KYC details for the processing of my loan application and contact me through SMS / Whatsapp / Call with reference to my loan application.',
      },
    ],
    officialLinkText: 'Official T&C Page',
    officialLinkUrl: 'https://unity.bank.in/terms-and-conditions',
  },
  {
    id: 'kreditbee',
    partnerName: 'KreditBee',
    logoSrc: '/assets/images/kreditbee.png',
    consentContent: [
      {
        type: 'text',
        value:
          'By continuing, I agree to CIBIL Terms and Conditions and authorise Krazybee Services Private Limited to run a CIBIL check for my profile. I also agree to KreditBee’s Privacy Policy and Terms & Conditions and consent to receive communications from KreditBee via SMS, email, and WhatsApp.',
      },
    ],
    officialLinkText: 'Official T&C Page',
    officialLinkUrl: 'https://www.kreditbee.in/terms-and-conditions',
  },
  {
    id: 'lt-finance',
    partnerName: 'L&T Finance',
    logoSrc: '/assets/images/lAndT.png',
    consentContent: [
      {
        type: 'text',
        value:
          'I hereby consent in favour of L&T Finance Ltd. to collect, store & process my personal data ( incl.Aadhaar details, location, audio/video data collected during appraisal process) including fetching and verifying my KYC, bureau and digilocker information and sharing it with third parties for my loan application. I hereby also agree to have read & understood the ',
      },
      {
        type: 'link',
        text: 'Personal Loan T&C',
        url: 'https://www.ltfinance.com/docs/default-source/default-document-library/pl_application_t-c.pdf?sfvrsn=ebbca65c_3',
        addTrailingSpace: true,
      },
      { type: 'text', value: 'and ' },
      {
        type: 'link',
        text: 'Privacy Policy T&C',
        url: 'https://www.ltfinance.com/privacy-policy',
        addTrailingSpace: true,
      },
      { type: 'text', value: 'and consent to the same' },
    ],
    officialLinkText: undefined,
    officialLinkUrl: undefined,
  },
  {
    id: 'hfcl',
    partnerName: 'HFCL',
    logoSrc: '/assets/images/hero-fincorp.png',
    consentContent: [
      {
        type: 'text',
        value:
          'I consent to Hero FinCorp requesting my credit information report from credit bureaus, KYC details from CKYCR/UIDAI, and securely sharing my data with third parties strictly for the purpose of facilitating my loan.',
      },
    ],
    officialLinkText: 'Official T&C Page',
    officialLinkUrl: 'https://loans.apps.herofincorp.com/en/terms-and-conditions',
  },
];

const PartnerCard = ({
  id,
  partnerName,
  logoSrc,
  consentContent,
  officialLinkText,
  officialLinkUrl,
}: PartnerCardProps): JSX.Element => {
  const hasOfficialLink = Boolean(officialLinkText && officialLinkUrl);

  return (
    <div
      id={id}
      className="w-full max-w-md bg-white rounded-2xl shadow-[0px_1px_2px_0px_rgba(27,28,28,0.05)] outline-1 -outline-offset-1 outline-neutral-200 p-5"
    >
      <div className="flex items-start gap-3">
        {/* Keep a stable icon box and show a neutral fallback if logo is unavailable. */}
        <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          {logoSrc ? (
            <img src={logoSrc} alt={`${partnerName} logo`} className="h-10 w-10 object-cover" />
          ) : (
            <img src="https://placehold.co/40x40" alt="" className="h-10 w-10 object-cover" />
          )}
        </div>

        <div className="flex-1">
          <div className="text-base font-medium text-zinc-900 leading-7">{partnerName}</div>
        </div>
      </div>

      <div className="mt-4 text-sm text-zinc-500 leading-5">
        {/* Render mixed content (plain text + inline links) in order. */}
        {consentContent.map((part, index) => {
          if (part.type === 'text') {
            return <span key={`${id}-text-${index}`}>{part.value}</span>;
          }

          return (
            <Link
              key={`${id}-link-${index}`}
              href={part.url}
              className="text-blue-700 underline"
              target="_blank"
              rel="noreferrer"
            >
              {part.text}
              {part.addTrailingSpace ? ' ' : ''}
            </Link>
          );
        })}

        {hasOfficialLink ? (
          <>
            <br />
            <Link href={officialLinkUrl!} className="text-blue-700 underline" target="_blank" rel="noreferrer">
              {officialLinkText}
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
};

const PartnerTermsAndConditionsPage = async (): Promise<JSX.Element> => {
  return (
    <div className="max-w-5xl mx-auto pt-24 pb-10 md:pt-28 md:pb-14 px-4">
      <div className="mx-4">
        <BackToHomeButton />
      </div>

      <div className="flex justify-center mx-4">
        <PageBanner title="PARTNER TERMS & CONDITIONS" iconImage={'/assets/images/ptac.png'} />
      </div>

      <div className="mt-10 flex flex-col gap-6 items-center">
        {partners.map((partner) => (
          <PartnerCard key={partner.id} {...partner} />
        ))}
      </div>
    </div>
  );
};

export default PartnerTermsAndConditionsPage;

