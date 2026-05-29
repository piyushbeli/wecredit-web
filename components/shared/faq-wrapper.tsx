'use client';

import type { ReactNode } from 'react';
import { IMAGES } from '@/lib/constants/images';
import { FaqSection } from '@/components/shared';
import { FooterLinkPageWrapper } from './footer-link-page-wrapper';

const FaqWrapper = (): ReactNode => {
  return (
    <FooterLinkPageWrapper
      banner={{
        title: 'Frequently Asked Questions ',
        iconImage: IMAGES.ICONS.TERMS_OF_SERVICE,
      }}
      contentClassName="px-4"
    >
      <FaqSection />
    </FooterLinkPageWrapper>
  );
};

export default FaqWrapper;
