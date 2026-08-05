'use client';

import type { ReactNode } from 'react';
import { FooterLinkPageWrapper } from './footer-link-page-wrapper';
import PageHeading from './page-heading';

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
      <PageHeading className="sr-only">Partner Terms &amp; Conditions</PageHeading>
      {children}
    </FooterLinkPageWrapper>
  );
};

export default PartnerTermsAndConditionsWrapper;
