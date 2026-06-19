'use client';

import type { ReactNode } from 'react';
import { IMAGES } from '@/lib/constants/images';
import { FooterLinkPageWrapper } from './footer-link-page-wrapper';

type TermsOfUseWrapperProps = {
  htmlContent: string;
};

const TermsOfUseWrapper = ({ htmlContent }: TermsOfUseWrapperProps): ReactNode => {
  return (
    <FooterLinkPageWrapper
      banner={{
        title: 'Terms of Use',
        iconImage: IMAGES.ICONS.TERMS_OF_SERVICE,
      }}
      contentClassName='px-4'
    >
      <h1 className="sr-only">Terms of Service</h1>
      <div
        className="wc-static-content max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </FooterLinkPageWrapper>
  );
};

export default TermsOfUseWrapper;
