'use client';

import type { ReactNode } from 'react';
import { FooterLinkPageWrapper } from './footer-link-page-wrapper';

const PARTNER_TERMS_BANNER_ICON = '/assets/images/ptac.png';

type PartnerTermsAndConditionsWrapperProps = {
  children: ReactNode;
};

const PartnerTermsAndConditionsWrapper = ({
  children,
}: PartnerTermsAndConditionsWrapperProps): ReactNode => {
  return (
    <FooterLinkPageWrapper
      banner={{
        title: 'Partner Terms & Conditions',
        iconImage: PARTNER_TERMS_BANNER_ICON,
      }}
      contentClassName="mt-10 grid gap-6 px-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <h1 className="sr-only">Partner Terms &amp; Conditions</h1>
      {children}
    </FooterLinkPageWrapper>
  );
};

export default PartnerTermsAndConditionsWrapper;
