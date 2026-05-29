'use client';

import type { ReactNode } from 'react';
import { IMAGES } from '@/lib/constants/images';
import { FooterLinkPageWrapper } from './footer-link-page-wrapper';

type PrivacyPolicyWrapperProps = {
  htmlContent: string;
};

const PrivacyPolicyWrapper = ({
  htmlContent,
}: PrivacyPolicyWrapperProps): ReactNode => {
  return (
    <FooterLinkPageWrapper
      banner={{
        title: 'PRIVACY POLICY',
        iconImage: IMAGES.ICONS.WECREDIT_HEART,
        iconAlt: 'WeCredit Heart Icon',
      }}
    >
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </FooterLinkPageWrapper>
  );
};

export default PrivacyPolicyWrapper;
