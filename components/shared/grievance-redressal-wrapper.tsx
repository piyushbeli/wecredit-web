'use client';

import type { ReactNode } from 'react';
import { IMAGES } from '@/lib/constants/images';
import GrievanceContactContent from './grievance-contact-content';
import { FooterLinkPageWrapper } from './footer-link-page-wrapper';

const GrievanceRedressalWrapper = (): ReactNode => {
  return (
    <FooterLinkPageWrapper
      banner={{
        title: 'Grievance Redressal',
        iconImage: IMAGES.ICONS.WECREDIT_HEART,
      }}
      contentClassName="px-4"
    >
      <h1 className="sr-only">WeCredit Grievance Redressal</h1>
      <GrievanceContactContent />
    </FooterLinkPageWrapper>
  );
};

export default GrievanceRedressalWrapper;
