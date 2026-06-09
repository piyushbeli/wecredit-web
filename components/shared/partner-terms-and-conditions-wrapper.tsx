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
        title: 'PARTNER TERMS & CONDITIONS',
        iconImage: PARTNER_TERMS_BANNER_ICON,
      }}
      contentClassName="mt-10 flex flex-col gap-6 items-center px-4"
    >
      <h1 className="sr-only">Partner Terms &amp; Conditions</h1>
      {children}
    </FooterLinkPageWrapper>
  );
};

export default PartnerTermsAndConditionsWrapper;
