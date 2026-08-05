'use client';

import type { ReactNode } from 'react';
import { IMAGES } from '@/lib/constants/images';
import { FooterLinkPageWrapper } from './footer-link-page-wrapper';
import PageHeading from './page-heading';

type PrivacyPolicyWrapperProps = {
  htmlContent: string;
};

const PrivacyPolicyWrapper = ({
  htmlContent,
}: PrivacyPolicyWrapperProps): ReactNode => {
  return (
    <FooterLinkPageWrapper
      banner={{
        title: 'Privacy Policy',
        iconImage: IMAGES.ICONS.WECREDIT_HEART,
        iconAlt: 'WeCredit Heart Icon',
      }}
      contentClassName='px-4'
    >
      <PageHeading className="sr-only">Privacy Policy</PageHeading>
      <div
        className="wc-static-content max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </FooterLinkPageWrapper>
  );
};

export default PrivacyPolicyWrapper;
