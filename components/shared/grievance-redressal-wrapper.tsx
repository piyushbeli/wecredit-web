'use client';

import type { ReactNode } from 'react';
import { IMAGES } from '@/lib/constants/images';
import GrievanceContactContent from './grievance-contact-content';
import { FooterLinkPageWrapper } from './footer-link-page-wrapper';

const GrievanceRedressalWrapper = (): ReactNode => {
  return (
    <FooterLinkPageWrapper
      banner={{
        title: 'GRIEVANCE REDRESSAL',
        iconImage: IMAGES.ICONS.WECREDIT_HEART,
      }}
      contentClassName="mx-4 px-4"
    >
      <GrievanceContactContent />
    </FooterLinkPageWrapper>
  );
};

export default GrievanceRedressalWrapper;
