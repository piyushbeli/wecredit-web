'use client';

import type { ReactNode } from 'react';
import { IMAGES } from '@/lib/constants/images';
import { FaqSection, PageHeading } from '@/components/shared';
import { FooterLinkPageWrapper } from './footer-link-page-wrapper';

const FaqWrapper = (): ReactNode => {
  return (
    <FooterLinkPageWrapper
      banner={{
        title: 'Frequently Asked Questions',
        iconImage: IMAGES.ICONS.TERMS_OF_SERVICE,
      }}
      contentClassName="px-4"
    >
      <PageHeading className="sr-only">WeCredit FAQs</PageHeading>
      <FaqSection
        showTitle={false}
        className="px-0 py-0 sm:py-0 md:py-0"
        listClassName="max-w-none"
      />
    </FooterLinkPageWrapper>
  );
};

export default FaqWrapper;
